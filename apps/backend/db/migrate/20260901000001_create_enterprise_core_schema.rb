# frozen_string_literal: true

class CreateEnterpriseCoreSchema < ActiveRecord::Migration[8.0]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
    enable_extension 'citext' unless extension_enabled?('citext')

    # =========================================================================
    # 1. TENANCY & HIERARCHICAL STRUCTURE (Tier 1 -> Tier 2 -> Tier 3)
    # =========================================================================
    create_table :tenants, id: :uuid do |t|
      t.string :name, null: false
      t.string :subdomain, null: false, index: { unique: true }
      t.string :tax_id # NPWP
      t.string :legal_entity_type, default: "PT" # PT, CV, Perorangan
      t.string :status, default: "active", null: false # active, suspended, trial
      t.jsonb :feature_flags, default: { pos: true, inventory: true, finance: true, hr: false, audit: true }
      t.timestamps
    end

    create_table :brands, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.string :code, null: false
      t.string :industry_type, default: "retail" # fnb, retail, services, wholesale
      t.string :logo_url
      t.string :status, default: "active"
      t.timestamps
      t.index [:tenant_id, :code], unique: true
    end

    create_table :branches, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.string :code, null: false
      t.string :branch_type, default: "store" # store, warehouse_only, central_kitchen, hq
      t.text :address
      t.string :phone
      t.decimal :latitude, precision: 10, scale: 7
      t.decimal :longitude, precision: 10, scale: 7
      t.integer :geofence_radius_meters, default: 100
      t.boolean :is_active, default: true
      t.timestamps
      t.index [:brand_id, :code], unique: true
    end

    create_table :warehouses, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :branch, type: :uuid, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.string :code, null: false
      t.boolean :is_primary, default: false
      t.string :costing_method, default: "moving_average" # moving_average, fifo
      t.timestamps
      t.index [:branch_id, :code], unique: true
    end

    # =========================================================================
    # 2. RBAC, USERS & PERMISSIONS
    # =========================================================================
    create_table :users, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.citext :email, null: false
      t.string :password_digest, null: false
      t.string :pin_hash # For quick POS cashier unlock
      t.string :status, default: "active"
      t.timestamps
      t.index [:tenant_id, :email], unique: true
    end

    create_table :roles, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.string :name, null: false # Super Admin, Brand Director, Branch Manager, Cashier, etc.
      t.string :code, null: false
      t.string :scope_level, default: "tenant" # tenant, brand, branch
      t.jsonb :permissions, default: {}
      t.timestamps
      t.index [:tenant_id, :code], unique: true
    end

    create_table :user_assignments, id: :uuid do |t|
      t.references :user, type: :uuid, null: false, foreign_key: true, index: true
      t.references :role, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, foreign_key: true, index: true
      t.references :branch, type: :uuid, foreign_key: true, index: true
      t.timestamps
    end

    # =========================================================================
    # 3. CHART OF ACCOUNTS (COA) & FINANCIAL MASTER
    # =========================================================================
    create_table :chart_of_accounts, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, foreign_key: true, index: true
      t.uuid :parent_id, index: true
      t.string :account_code, null: false # e.g. 1101-01 (Kas), 4101-01 (Pendapatan Penjualan)
      t.string :account_name, null: false
      t.string :account_type, null: false # asset, liability, equity, revenue, expense
      t.string :normal_balance, null: false # debit, credit
      t.string :category, null: false # cash_bank, accounts_receivable, inventory, fixed_asset, accounts_payable, etc.
      t.boolean :is_reconcilable, default: false
      t.boolean :is_active, default: true
      t.timestamps
      t.index [:tenant_id, :account_code], unique: true
    end

    # =========================================================================
    # 4. PRODUCTS, INVENTORY & COSTING
    # =========================================================================
    create_table :categories, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.string :code
      t.timestamps
    end

    create_table :products, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, null: false, foreign_key: true, index: true
      t.references :category, type: :uuid, foreign_key: true, index: true
      t.string :name, null: false
      t.string :sku, null: false
      t.string :barcode
      t.string :product_type, default: "inventory" # inventory, service, bundle/composite, raw_material
      t.string :uom_base, default: "PCS", null: false
      t.decimal :selling_price, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :standard_cost, precision: 15, scale: 2, default: 0.0, null: false
      t.boolean :track_inventory, default: true
      t.boolean :is_active, default: true
      # Default GL accounts
      t.references :inventory_account, type: :uuid, foreign_key: { to_table: :chart_of_accounts }
      t.references :sales_account, type: :uuid, foreign_key: { to_table: :chart_of_accounts }
      t.references :cogs_account, type: :uuid, foreign_key: { to_table: :chart_of_accounts }
      t.timestamps
      t.index [:tenant_id, :sku], unique: true
    end

    create_table :stock_levels, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :warehouse, type: :uuid, null: false, foreign_key: true, index: true
      t.references :product, type: :uuid, null: false, foreign_key: true, index: true
      t.decimal :quantity_on_hand, precision: 15, scale: 4, default: 0.0, null: false
      t.decimal :quantity_reserved, precision: 15, scale: 4, default: 0.0, null: false
      t.decimal :average_cost, precision: 15, scale: 4, default: 0.0, null: false # Realtime Moving Average
      t.decimal :safety_stock, precision: 15, scale: 4, default: 5.0
      t.decimal :reorder_point, precision: 15, scale: 4, default: 10.0
      t.timestamps
      t.index [:warehouse_id, :product_id], unique: true
    end

    create_table :stock_movements, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :warehouse, type: :uuid, null: false, foreign_key: true, index: true
      t.references :product, type: :uuid, null: false, foreign_key: true, index: true
      t.string :movement_type, null: false # pos_sale, purchase_receipt, transfer_in, transfer_out, opname_adjustment, scrap
      t.string :reference_type # PosOrder, PurchaseOrder, StockTransfer, StockOpname
      t.uuid :reference_id
      t.decimal :quantity_delta, precision: 15, scale: 4, null: false # +/- qty
      t.decimal :unit_cost, precision: 15, scale: 4, null: false
      t.decimal :total_cost, precision: 15, scale: 4, null: false
      t.decimal :quantity_balance_after, precision: 15, scale: 4, null: false
      t.decimal :average_cost_after, precision: 15, scale: 4, null: false
      t.timestamps
      t.index [:warehouse_id, :product_id, :created_at]
    end

    # =========================================================================
    # 5. POS SESSIONS, ORDERS & PAYMENTS
    # =========================================================================
    create_table :pos_sessions, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :branch, type: :uuid, null: false, foreign_key: true, index: true
      t.references :user, type: :uuid, null: false, foreign_key: true, index: true # Cashier
      t.string :session_code, null: false
      t.datetime :opened_at, null: false
      t.datetime :closed_at
      t.decimal :opening_cash, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :expected_closing_cash, precision: 15, scale: 2, default: 0.0
      t.decimal :actual_closing_cash, precision: 15, scale: 2
      t.decimal :cash_variance, precision: 15, scale: 2
      t.string :status, default: "open", null: false # open, closed, audited
      t.timestamps
      t.index [:tenant_id, :session_code], unique: true
    end

    create_table :pos_orders, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, null: false, foreign_key: true, index: true
      t.references :branch, type: :uuid, null: false, foreign_key: true, index: true
      t.references :warehouse, type: :uuid, null: false, foreign_key: true, index: true
      t.references :pos_session, type: :uuid, null: false, foreign_key: true, index: true
      t.references :user, type: :uuid, null: false, foreign_key: true, index: true # Cashier
      t.string :order_number, null: false # e.g. ORD-20260901-0001
      t.string :status, default: "completed", null: false # draft, completed, voided, refunded
      t.decimal :subtotal_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :discount_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :tax_rate, precision: 5, scale: 2, default: 11.0 # PPN 11% or 12%
      t.decimal :tax_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :service_charge_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :rounding_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :grand_total, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :total_cogs_amount, precision: 15, scale: 2, default: 0.0, null: false # Realized HPP
      t.string :customer_name
      t.string :table_number
      t.datetime :completed_at
      t.timestamps
      t.index [:tenant_id, :order_number], unique: true
    end

    create_table :pos_order_items, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :pos_order, type: :uuid, null: false, foreign_key: true, index: true
      t.references :product, type: :uuid, null: false, foreign_key: true, index: true
      t.decimal :quantity, precision: 15, scale: 4, null: false
      t.decimal :unit_price, precision: 15, scale: 2, null: false
      t.decimal :discount_rate, precision: 5, scale: 2, default: 0.0
      t.decimal :discount_amount, precision: 15, scale: 2, default: 0.0
      t.decimal :subtotal, precision: 15, scale: 2, null: false
      t.decimal :unit_cogs, precision: 15, scale: 4, default: 0.0, null: false
      t.decimal :total_cogs, precision: 15, scale: 4, default: 0.0, null: false
      t.text :notes
      t.timestamps
    end

    create_table :pos_order_payments, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :pos_order, type: :uuid, null: false, foreign_key: true, index: true
      t.references :chart_of_account, type: :uuid, null: false, foreign_key: true, index: true # GL target account (Kas/BCA/QRIS/AR)
      t.string :payment_method, null: false # cash, qris, edc_bca, edc_mandiri, transfer, customer_credit
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.decimal :change_given, precision: 15, scale: 2, default: 0.0
      t.string :reference_number # EDC trace / QRIS RRN
      t.string :status, default: "settled", null: false
      t.timestamps
    end

    # =========================================================================
    # 6. GENERAL LEDGER (DOUBLE-ENTRY AUTOMATIC JOURNAL)
    # =========================================================================
    create_table :journal_entries, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, null: false, foreign_key: true, index: true
      t.references :branch, type: :uuid, foreign_key: true, index: true
      t.string :entry_number, null: false # JRN-20260901-0001
      t.date :entry_date, null: false
      t.string :source_type, null: false # PosOrder, PurchaseBill, StockOpname, PayrollRun
      t.uuid :source_id, null: false, index: true
      t.text :narration, null: false
      t.decimal :total_debit, precision: 15, scale: 2, null: false
      t.decimal :total_credit, precision: 15, scale: 2, null: false
      t.string :status, default: "posted", null: false # draft, posted, reversed
      t.references :posted_by, type: :uuid, foreign_key: { to_table: :users }
      t.timestamps
      t.index [:tenant_id, :entry_number], unique: true
      t.index [:source_type, :source_id]
    end

    create_table :journal_entry_lines, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :journal_entry, type: :uuid, null: false, foreign_key: true, index: true
      t.references :chart_of_account, type: :uuid, null: false, foreign_key: true, index: true
      t.decimal :debit, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :credit, precision: 15, scale: 2, default: 0.0, null: false
      t.text :description
      t.timestamps
    end

    # =========================================================================
    # 7. IMMUTABLE AUDIT TRAIL & FRAUD DETECTION
    # =========================================================================
    create_table :audit_logs, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true, index: true
      t.references :brand, type: :uuid, foreign_key: true, index: true
      t.references :branch, type: :uuid, foreign_key: true, index: true
      t.references :user, type: :uuid, foreign_key: true, index: true
      t.string :event_type, null: false # checkout, void_order, price_override, stock_adjustment, cash_drawer_open
      t.string :auditable_type, null: false
      t.uuid :auditable_id, null: false
      t.jsonb :payload_before, default: {}
      t.jsonb :payload_after, default: {}
      t.string :ip_address
      t.string :user_agent
      t.boolean :flagged_fraud, default: false
      t.string :fraud_reason
      t.datetime :occurred_at, null: false
      t.timestamps
      t.index [:tenant_id, :event_type, :occurred_at]
    end
  end
end
