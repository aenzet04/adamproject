# frozen_string_literal: true

module InventoryEngine
  class DeadStockService
    attr_reader :tenant, :brand, :warehouse

    def self.analyze(tenant:, brand: nil, warehouse: nil, days_threshold: 60)
      new(tenant: tenant, brand: brand, warehouse: warehouse).analyze(days_threshold: days_threshold)
    end

    def initialize(tenant:, brand: nil, warehouse: nil)
      @tenant = tenant
      @brand = brand
      @warehouse = warehouse
    end

    # Identifies products with no stock movement in the last N days
    def analyze(days_threshold: 60)
      cutoff_date = days_threshold.days.ago

      stock_scope = StockLevel.joins(:product)
                              .where(tenant_id: tenant.id)
                              .where("quantity_on_hand > 0")

      stock_scope = stock_scope.where(warehouse_id: warehouse.id) if warehouse
      stock_scope = stock_scope.where(products: { brand_id: brand.id }) if brand

      results = []

      stock_scope.find_each do |stock|
        last_movement = StockMovement.where(
          tenant_id: tenant.id,
          warehouse_id: stock.warehouse_id,
          product_id: stock.product_id
        ).order(created_at: :desc).first

        last_moved_at = last_movement&.created_at || stock.created_at
        days_inactive = (Time.current - last_moved_at) / 1.day

        if days_inactive >= days_threshold
          tied_up_capital = stock.quantity_on_hand * stock.average_cost
          results << {
            product_id: stock.product_id,
            product_name: stock.product.name,
            sku: stock.product.sku,
            warehouse_id: stock.warehouse_id,
            quantity_on_hand: stock.quantity_on_hand,
            average_cost: stock.average_cost,
            tied_up_capital: tied_up_capital,
            days_inactive: days_inactive.round(1),
            last_moved_at: last_moved_at
          }
        end
      end

      results.sort_by { |r| -r[:tied_up_capital] }
    end

    # Automatically generates PO drafts for products below reorder point
    def generate_auto_reorder_drafts!
      low_stock_items = StockLevel.joins(:product)
                                  .where(tenant_id: tenant.id)
                                  .where("quantity_on_hand <= reorder_point")

      low_stock_items = low_stock_items.where(warehouse_id: warehouse.id) if warehouse

      drafts = []
      low_stock_items.each do |item|
        suggested_order_qty = (item.safety_stock * 2) - item.quantity_on_hand
        next if suggested_order_qty <= 0

        drafts << {
          product_id: item.product_id,
          product_name: item.product.name,
          sku: item.product.sku,
          warehouse_id: item.warehouse_id,
          current_qty: item.quantity_on_hand,
          reorder_point: item.reorder_point,
          suggested_order_qty: suggested_order_qty,
          estimated_cost: suggested_order_qty * item.product.standard_cost
        }
      end

      drafts
    end
  end
end
