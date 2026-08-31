# frozen_string_literal: true

require "bigdecimal"

module PosEngine
  class CheckoutService
    class InsufficientStockError < StandardError; end
    class UnderpaidOrderError < StandardError; end
    class ClosedSessionError < StandardError; end

    attr_reader :pos_session, :cashier, :params, :tenant, :brand, :branch, :warehouse

    def self.call(pos_session:, cashier:, params:)
      new(pos_session: pos_session, cashier: cashier, params: params).execute!
    end

    def initialize(pos_session:, cashier:, params:)
      @pos_session = pos_session
      @cashier = cashier
      @params = params
      @tenant = pos_session.tenant
      @branch = pos_session.branch
      @brand = @branch.brand
      @warehouse = @branch.warehouses.find_by(is_primary: true) || @branch.warehouses.first
    end

    def execute!
      raise ClosedSessionError, "POS Session is not active" unless pos_session.status == "open"

      ActiveRecord::Base.transaction do
        # 1. Calculate items, validate inventory & compute Realized COGS (Moving Average)
        items_payload = params[:items] || []
        total_subtotal = BigDecimal("0.0")
        total_discount = BigDecimal(params[:discount_amount].to_s || "0.0")
        total_cogs = BigDecimal("0.0")

        order = PosOrder.new(
          tenant_id: tenant.id,
          brand_id: brand.id,
          branch_id: branch.id,
          warehouse_id: warehouse.id,
          pos_session_id: pos_session.id,
          user_id: cashier.id,
          order_number: generate_order_number,
          customer_name: params[:customer_name],
          table_number: params[:table_number],
          tax_rate: BigDecimal(params[:tax_rate].to_s || "11.0"),
          completed_at: Time.current,
          status: "completed"
        )

        # Process each line item
        items_payload.each do |raw_item|
          product = Product.find_by!(tenant_id: tenant.id, id: raw_item[:product_id])
          qty = BigDecimal(raw_item[:quantity].to_s)
          unit_price = BigDecimal(raw_item[:unit_price].to_s || product.selling_price.to_s)
          discount_amount = BigDecimal(raw_item[:discount_amount].to_s || "0.0")
          item_subtotal = (unit_price * qty) - discount_amount

          total_subtotal += item_subtotal

          # Stock Level Deduction & Real-time COGS calculation
          unit_cogs = BigDecimal("0.0")
          if product.track_inventory
            stock_level = StockLevel.lock.find_or_create_by!(
              tenant_id: tenant.id,
              warehouse_id: warehouse.id,
              product_id: product.id
            )

            if stock_level.quantity_on_hand < qty
              raise InsufficientStockError, "Insufficient stock for product #{product.name} (SKU: #{product.sku})"
            end

            unit_cogs = stock_level.average_cost
            item_cogs = unit_cogs * qty
            total_cogs += item_cogs

            # Decrement stock on hand
            new_qty = stock_level.quantity_on_hand - qty
            stock_level.update!(quantity_on_hand: new_qty)

            # Record Immutable Stock Movement
            StockMovement.create!(
              tenant_id: tenant.id,
              warehouse_id: warehouse.id,
              product_id: product.id,
              movement_type: "pos_sale",
              reference_type: "PosOrder",
              quantity_delta: -qty,
              unit_cost: unit_cogs,
              total_cost: item_cogs,
              quantity_balance_after: new_qty,
              average_cost_after: unit_cogs
            )
          end

          order.pos_order_items.build(
            tenant_id: tenant.id,
            product_id: product.id,
            quantity: qty,
            unit_price: unit_price,
            discount_amount: discount_amount,
            subtotal: item_subtotal,
            unit_cogs: unit_cogs,
            total_cogs: unit_cogs * qty,
            notes: raw_item[:notes]
          )
        end

        # Calculate Taxes, Service Charge, and Grand Total
        taxable_base = total_subtotal - total_discount
        tax_amount = (taxable_base * (order.tax_rate / BigDecimal("100.0"))).round(2)
        service_charge_amount = BigDecimal(params[:service_charge_amount].to_s || "0.0")
        rounding_amount = BigDecimal(params[:rounding_amount].to_s || "0.0")
        grand_total = taxable_base + tax_amount + service_charge_amount + rounding_amount

        order.subtotal_amount = total_subtotal
        order.discount_amount = total_discount
        order.tax_amount = tax_amount
        order.service_charge_amount = service_charge_amount
        order.rounding_amount = rounding_amount
        order.grand_total = grand_total
        order.total_cogs_amount = total_cogs
        order.save!

        # 2. Process Multi-Payment Allocations
        payments_payload = params[:payments] || []
        total_paid = BigDecimal("0.0")

        payments_payload.each do |raw_payment|
          payment_amount = BigDecimal(raw_payment[:amount].to_s)
          change_given = BigDecimal(raw_payment[:change_given].to_s || "0.0")
          total_paid += (payment_amount - change_given)

          order.pos_order_payments.create!(
            tenant_id: tenant.id,
            chart_of_account_id: raw_payment[:chart_of_account_id],
            payment_method: raw_payment[:payment_method],
            amount: payment_amount,
            change_given: change_given,
            reference_number: raw_payment[:reference_number],
            status: "settled"
          )
        end

        if total_paid < grand_total
          raise UnderpaidOrderError, "Total payment (#{total_paid}) is less than grand total (#{grand_total})"
        end

        # 3. Post Automatic Double-Entry Ledger Entry
        FinanceEngine::AutoPostingService.post_pos_order!(pos_order: order, posted_by: cashier)

        # 4. Record Audit Log for the checkout
        AuditLog.create!(
          tenant_id: tenant.id,
          brand_id: brand.id,
          branch_id: branch.id,
          user_id: cashier.id,
          event_type: "pos_checkout",
          auditable_type: "PosOrder",
          auditable_id: order.id,
          payload_after: order.as_json(include: [:pos_order_items, :pos_order_payments]),
          ip_address: params[:ip_address],
          user_agent: params[:user_agent],
          occurred_at: Time.current
        )

        order
      end
    end

    private

    def generate_order_number
      "ORD-#{branch.code}-#{Date.current.strftime('%Y%m%d')}-#{SecureRandom.hex(3).upcase}"
    end
  end
end
