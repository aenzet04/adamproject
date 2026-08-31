# frozen_string_literal: true

require "bigdecimal"
require "securerandom"

module FinanceEngine
  class AutoPostingService
    class UnbalancedJournalError < StandardError; end
    class MissingAccountMappingError < StandardError; end
    class PostingAlreadyExistsError < StandardError; end

    # Precision tolerance for monetary arithmetic (floating-point safe)
    EPSILON = BigDecimal("0.001")

    attr_reader :tenant, :brand, :branch, :source, :posted_by, :lines

    def self.post_pos_order!(pos_order:, posted_by:)
      new(source: pos_order, posted_by: posted_by).post_pos_order!
    end

    def initialize(source:, posted_by:)
      @source = source
      @tenant = source.tenant
      @brand = source.brand
      @branch = source.branch
      @posted_by = posted_by
      @lines = []
    end

    # =========================================================================
    # POSTING POS ORDER: SALES REVENUE + TAX + SERVICE + COGS + PAYMENTS
    # =========================================================================
    def post_pos_order!
      ActiveRecord::Base.transaction do
        # 1. Lock source row and check idempotency
        @source.lock!
        existing = JournalEntry.find_by(tenant_id: tenant.id, source_type: "PosOrder", source_id: @source.id)
        raise PostingAlreadyExistsError, "Journal entry already exists for POS Order #{@source.order_number}" if existing

        # 2. Build Double-Entry Journal Lines
        build_sales_revenue_lines
        build_tax_and_service_lines
        build_payment_lines
        build_cogs_and_inventory_lines

        # 3. Compute Totals & Validate Balance
        total_debit = @lines.sum { |l| l[:debit] }
        total_credit = @lines.sum { |l| l[:credit] }

        variance = (total_debit - total_credit).abs
        if variance > EPSILON
          raise UnbalancedJournalError,
                "Double-entry journal out of balance! Debit: #{total_debit}, Credit: #{total_credit}, Variance: #{variance}"
        end

        # 4. Persist Journal Entry & Lines
        entry_number = generate_entry_number(prefix: "JRN-POS")
        journal_entry = JournalEntry.create!(
          tenant_id: tenant.id,
          brand_id: brand.id,
          branch_id: branch.id,
          entry_number: entry_number,
          entry_date: @source.completed_at&.to_date || Date.current,
          source_type: "PosOrder",
          source_id: @source.id,
          narration: "Auto-posting for POS Order ##{@source.order_number} (#{customer_reference})",
          total_debit: total_debit,
          total_credit: total_credit,
          status: "posted",
          posted_by_id: posted_by&.id
        )

        @lines.each do |line|
          journal_entry.journal_entry_lines.create!(
            tenant_id: tenant.id,
            chart_of_account_id: line[:account_id],
            debit: line[:debit],
            credit: line[:credit],
            description: line[:description]
          )
        end

        journal_entry
      end
    end

    private

    # -------------------------------------------------------------------------
    # 1. SALES REVENUE & DISCOUNTS (KREDIT PENDAPATAN / DEBIT POTONGAN)
    # -------------------------------------------------------------------------
    def build_sales_revenue_lines
      @source.pos_order_items.each do |item|
        product = item.product
        sales_account = product.sales_account || default_account_for(:sales_revenue)
        gross_sales = BigDecimal(item.unit_price.to_s) * BigDecimal(item.quantity.to_s)

        add_line(
          account_id: sales_account.id,
          debit: BigDecimal("0.0"),
          credit: gross_sales,
          description: "Pendapatan Penjualan: #{product.name} (Qty: #{item.quantity})"
        )

        # Record Item Discount if present
        if item.discount_amount > BigDecimal("0.0")
          discount_account = default_account_for(:sales_discount)
          add_line(
            account_id: discount_account.id,
            debit: BigDecimal(item.discount_amount.to_s),
            credit: BigDecimal("0.0"),
            description: "Diskon Item: #{product.name}"
          )
        end
      end

      # Record Order-Level Discount if present
      if @source.discount_amount > BigDecimal("0.0") && @source.pos_order_items.sum(&:discount_amount).zero?
        discount_account = default_account_for(:sales_discount)
        add_line(
          account_id: discount_account.id,
          debit: BigDecimal(@source.discount_amount.to_s),
          credit: BigDecimal("0.0"),
          description: "Diskon Transaksi ##{@source.order_number}"
        )
      end
    end

    # -------------------------------------------------------------------------
    # 2. TAX & SERVICE CHARGES (KREDIT HUTANG PPN & PENDAPATAN SERVICE)
    # -------------------------------------------------------------------------
    def build_tax_and_service_lines
      if @source.tax_amount > BigDecimal("0.0")
        tax_account = default_account_for(:vat_output_payable) # Hutang PPN Keluaran
        add_line(
          account_id: tax_account.id,
          debit: BigDecimal("0.0"),
          credit: BigDecimal(@source.tax_amount.to_s),
          description: "Hutang PPN Keluaran #{@source.tax_rate}% (Order ##{@source.order_number})"
        )
      end

      if @source.service_charge_amount > BigDecimal("0.0")
        service_account = default_account_for(:service_charge_revenue)
        add_line(
          account_id: service_account.id,
          debit: BigDecimal("0.0"),
          credit: BigDecimal(@source.service_charge_amount.to_s),
          description: "Pendapatan Service Charge (Order ##{@source.order_number})"
        )
      end

      if @source.rounding_amount != BigDecimal("0.0")
        rounding_account = default_account_for(:rounding_expense)
        if @source.rounding_amount > BigDecimal("0.0")
          add_line(account_id: rounding_account.id, debit: BigDecimal("0.0"), credit: @source.rounding_amount.abs, description: "Pembulatan Penjualan (+)")
        else
          add_line(account_id: rounding_account.id, debit: @source.rounding_amount.abs, credit: BigDecimal("0.0"), description: "Pembulatan Penjualan (-)")
        end
      end
    end

    # -------------------------------------------------------------------------
    # 3. PAYMENTS RECEIVED (DEBIT KAS / BANK / QRIS / PIUTANG)
    # -------------------------------------------------------------------------
    def build_payment_lines
      @source.pos_order_payments.each do |payment|
        gl_account = payment.chart_of_account || default_account_for_payment_method(payment.payment_method)
        net_payment_amount = BigDecimal(payment.amount.to_s) - BigDecimal(payment.change_given.to_s)

        add_line(
          account_id: gl_account.id,
          debit: net_payment_amount,
          credit: BigDecimal("0.0"),
          description: "Penerimaan #{payment.payment_method.upcase} (Ref: #{payment.reference_number || '-'})"
        )
      end
    end

    # -------------------------------------------------------------------------
    # 4. COGS / HPP & INVENTORY ASSET (DEBIT BEBAN HPP, KREDIT PERSEDIAAN)
    # -------------------------------------------------------------------------
    def build_cogs_and_inventory_lines
      @source.pos_order_items.each do |item|
        product = item.product
        next unless product.track_inventory

        total_cogs = BigDecimal(item.total_cogs.to_s)
        next if total_cogs.zero?

        cogs_account = product.cogs_account || default_account_for(:cogs)
        inventory_account = product.inventory_account || default_account_for(:inventory_asset)

        # Debit: Beban Pokok Penjualan (HPP)
        add_line(
          account_id: cogs_account.id,
          debit: total_cogs,
          credit: BigDecimal("0.0"),
          description: "HPP: #{product.name} (Qty: #{item.quantity})"
        )

        # Kredit: Persediaan Barang Dagang
        add_line(
          account_id: inventory_account.id,
          debit: BigDecimal("0.0"),
          credit: total_cogs,
          description: "Pengurangan Persediaan: #{product.name} (Qty: #{item.quantity})"
        )
      end
    end

    # -------------------------------------------------------------------------
    # HELPER METHODS & COA RESOLUTION
    # -------------------------------------------------------------------------
    def add_line(account_id:, debit:, credit:, description:)
      @lines << {
        account_id: account_id,
        debit: debit.round(2),
        credit: credit.round(2),
        description: description
      }
    end

    def default_account_for(category_key)
      category_map = {
        sales_revenue: { code_prefix: "4101", category: "sales_revenue", default_name: "Pendapatan Penjualan" },
        sales_discount: { code_prefix: "4102", category: "sales_discount", default_name: "Potongan Penjualan" },
        vat_output_payable: { code_prefix: "2103", category: "tax_payable", default_name: "Hutang PPN Keluaran" },
        service_charge_revenue: { code_prefix: "4201", category: "service_revenue", default_name: "Pendapatan Jasa Servis" },
        cogs: { code_prefix: "5101", category: "cost_of_goods_sold", default_name: "Beban Pokok Penjualan (HPP)" },
        inventory_asset: { code_prefix: "1104", category: "inventory", default_name: "Persediaan Barang Dagang" },
        rounding_expense: { code_prefix: "5209", category: "operating_expense", default_name: "Selisih Pembulatan Kasir" }
      }

      meta = category_map[category_key]
      account = ChartOfAccount.find_by(tenant_id: tenant.id, category: meta[:category]) ||
                ChartOfAccount.where(tenant_id: tenant.id).where("account_code LIKE ?", "#{meta[:code_prefix]}%").first

      unless account
        raise MissingAccountMappingError, "Chart of Account for #{category_key} (#{meta[:default_name]}) is not configured for Tenant #{tenant.name}"
      end

      account
    end

    def default_account_for_payment_method(method)
      case method.to_s.downcase
      when "cash"
        ChartOfAccount.find_by!(tenant_id: tenant.id, category: "cash_bank")
      when "customer_credit"
        ChartOfAccount.find_by!(tenant_id: tenant.id, category: "accounts_receivable")
      else
        ChartOfAccount.where(tenant_id: tenant.id, category: "cash_bank").second ||
          ChartOfAccount.find_by!(tenant_id: tenant.id, category: "cash_bank")
      end
    end

    def generate_entry_number(prefix:)
      "#{prefix}-#{Date.current.strftime('%Y%m%d')}-#{SecureRandom.hex(4).upcase}"
    end

    def customer_reference
      @source.customer_name.presence || "Pelanggan Reguler (Walk-in)"
    end
  end
end
