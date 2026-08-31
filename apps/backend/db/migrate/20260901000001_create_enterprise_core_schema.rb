# frozen_string_literal: true

class CreateEnterpriseCoreSchema < ActiveRecord::Migration[8.0]
  def change
    # =========================================================================
    # 1. TENANCY & HIERARCHICAL STRUCTURE (MySQL 8 / MariaDB InnoDB)
    # =========================================================================
    create_table :tenants, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :name, limit: 191, null: false
      t.string :subdomain, limit: 100, null: false, index: { unique: true }
      t.string :tax_id, limit: 50 # NPWP
      t.string :legal_entity_type, limit: 50, default: "PT"
      t.string :status, limit: 30, default: "active", null: false
      t.json :feature_flags
      t.timestamps
    end

    create_table :brands, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :name, limit: 191, null: false
      t.string :code, limit: 50, null: false
      t.string :industry_type, limit: 50, default: "retail"
      t.string :logo_url, limit: 255
      t.string :status, limit: 30, default: "active"
      t.timestamps
      t.index [:tenant_id, :code], unique: true
    end

    create_table :branches, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :brand_id, limit: 36, null: false, index: true
      t.string :name, limit: 191, null: false
      t.string :code, limit: 50, null: false
      t.string :branch_type, limit: 50, default: "store"
      t.text :address
      t.string :phone, limit: 50
      t.decimal :latitude, precision: 10, scale: 7
      t.decimal :longitude, precision: 10, scale: 7
      t.integer :geofence_radius_meters, default: 100
      t.boolean :is_active, default: true
      t.timestamps
      t.index [:brand_id, :code], unique: true
    end

    create_table :warehouses, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :branch_id, limit: 36, null: false, index: true
      t.string :name, limit: 191, null: false
      t.string :code, limit: 50, null: false
      t.boolean :is_primary, default: false
      t.string :costing_method, limit: 50, default: "moving_average"
      t.timestamps
      t.index [:branch_id, :code], unique: true
    end

    # =========================================================================
    # 2. RBAC & USERS
    # =========================================================================
    create_table :users, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :name, limit: 191, null: false
      t.string :email, limit: 191, null: false
      t.string :password_digest, limit: 255, null: false
      t.string :pin_hash, limit: 255
      t.string :status, limit: 30, default: "active"
      t.timestamps
      t.index [:tenant_id, :email], unique: true
    end

    create_table :roles, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :name, limit: 100, null: false
      t.string :code, limit: 50, null: false
      t.string :scope_level, limit: 30, default: "tenant"
      t.json :permissions
      t.timestamps
      t.index [:tenant_id, :code], unique: true
    end

    # =========================================================================
    # 3. CHART OF ACCOUNTS (COA) - PSAK / IFRS
    # =========================================================================
    create_table :chart_of_accounts, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :brand_id, limit: 36, index: true
      t.string :parent_id, limit: 36, index: true
      t.string :account_code, limit: 50, null: false
      t.string :account_name, limit: 191, null: false
      t.string :account_type, limit: 50, null: false
      t.string :normal_balance, limit: 20, null: false
      t.string :category, limit: 50, null: false
      t.boolean :is_reconcilable, default: false
      t.boolean :is_active, default: true
      t.timestamps
      t.index [:tenant_id, :account_code], unique: true
    end

    # =========================================================================
    # 4. PRODUCTS & STOCK
    # =========================================================================
    create_table :products, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :brand_id, limit: 36, null: false, index: true
      t.string :name, limit: 191, null: false
      t.string :sku, limit: 100, null: false
      t.string :barcode, limit: 100
      t.string :product_type, limit: 50, default: "inventory"
      t.string :uom_base, limit: 30, default: "PCS", null: false
      t.decimal :selling_price, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :standard_cost, precision: 15, scale: 2, default: 0.0, null: false
      t.boolean :track_inventory, default: true
      t.boolean :is_active, default: true
      t.string :inventory_account_id, limit: 36
      t.string :sales_account_id, limit: 36
      t.string :cogs_account_id, limit: 36
      t.timestamps
      t.index [:tenant_id, :sku], unique: true
      t.index [:tenant_id, :barcode]
    end

    create_table :stock_levels, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :warehouse_id, limit: 36, null: false, index: true
      t.string :product_id, limit: 36, null: false, index: true
      t.decimal :quantity_on_hand, precision: 15, scale: 4, default: 0.0, null: false
      t.decimal :quantity_reserved, precision: 15, scale: 4, default: 0.0, null: false
      t.decimal :average_cost, precision: 15, scale: 4, default: 0.0, null: false
      t.decimal :safety_stock, precision: 15, scale: 4, default: 5.0
      t.decimal :reorder_point, precision: 15, scale: 4, default: 10.0
      t.timestamps
      t.index [:warehouse_id, :product_id], unique: true
    end

    # =========================================================================
    # 5. POS ORDERS & GENERAL LEDGER
    # =========================================================================
    create_table :pos_orders, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :brand_id, limit: 36, null: false, index: true
      t.string :branch_id, limit: 36, null: false, index: true
      t.string :warehouse_id, limit: 36, null: false, index: true
      t.string :order_number, limit: 100, null: false
      t.string :status, limit: 30, default: "completed", null: false
      t.decimal :subtotal_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :discount_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :tax_rate, precision: 5, scale: 2, default: 11.0
      t.decimal :tax_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :service_charge_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :rounding_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :grand_total, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :total_cogs_amount, precision: 15, scale: 2, default: 0.0, null: false
      t.string :customer_name, limit: 191
      t.string :table_number, limit: 50
      t.datetime :completed_at
      t.timestamps
      t.index [:tenant_id, :order_number], unique: true
    end

    create_table :journal_entries, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :brand_id, limit: 36, null: false, index: true
      t.string :branch_id, limit: 36, index: true
      t.string :entry_number, limit: 100, null: false
      t.date :entry_date, null: false
      t.string :source_type, limit: 50, null: false
      t.string :source_id, limit: 36, null: false
      t.text :narration, null: false
      t.decimal :total_debit, precision: 15, scale: 2, null: false
      t.decimal :total_credit, precision: 15, scale: 2, null: false
      t.string :status, limit: 30, default: "posted", null: false
      t.string :posted_by_id, limit: 36
      t.timestamps
      t.index [:tenant_id, :entry_number], unique: true
      t.index [:source_type, :source_id]
    end

    create_table :journal_entry_lines, id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
      t.string :id, limit: 36, primary_key: true, null: false
      t.string :tenant_id, limit: 36, null: false, index: true
      t.string :journal_entry_id, limit: 36, null: false, index: true
      t.string :chart_of_account_id, limit: 36, null: false, index: true
      t.decimal :debit, precision: 15, scale: 2, default: 0.0, null: false
      t.decimal :credit, precision: 15, scale: 2, default: 0.0, null: false
      t.text :description
      t.timestamps
    end
  end
end
