# frozen_string_literal: true

require 'webrick'
require 'json'
require 'bigdecimal'
require 'securerandom'
require 'date'

# Load our core Ruby modular services
require_relative 'engines/finance_engine/app/services/finance_engine/auto_posting_service'
require_relative 'engines/finance_engine/app/services/finance_engine/financial_report_service'
require_relative 'engines/inventory_engine/app/services/inventory_engine/dead_stock_service'

PORT = 3001
server = WEBrick::HTTPServer.new(
  Port: PORT,
  AccessLog: [],
  Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO)
)

# Enable CORS helper
def enable_cors(res)
  res['Access-Control-Allow-Origin'] = '*'
  res['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  res['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Tenant-Id'
end

# 1. HEALTH CHECK & STATUS
server.mount_proc '/api/v1/health' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    status: 'online',
    engine: 'Ruby Enterprise Backend API',
    ruby_version: RUBY_VERSION,
    active_tenancy: 'PT Multi Industri Nusantara',
    modules: ['pos_engine', 'finance_engine', 'inventory_engine', 'hr_engine', 'audit_engine'],
    timestamp: Time.now.iso8601
  }.to_json
end

# 2. LIVE POS CHECKOUT & REAL-TIME AUTO POSTING API
server.mount_proc '/api/v1/pos/checkout' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  if req.request_method == 'POST'
    begin
      payload = JSON.parse(req.body)
      items = payload['items'] || []
      payments = payload['payments'] || []
      
      subtotal = items.sum { |i| (i['unitPrice'].to_f * i['quantity'].to_f) - (i['discountAmount'] || 0).to_f }
      tax = (subtotal * 0.11).round(2)
      service_charge = (payload['serviceChargeAmount'] || 0).to_f
      rounding = (payload['roundingAmount'] || 0).to_f
      grand_total = subtotal + tax + service_charge + rounding
      
      order_number = "ORD-RAILS-#{Date.today.strftime('%Y%m%d')}-#{SecureRandom.hex(3).upcase}"
      journal_number = "JRN-POS-#{Date.today.strftime('%Y%m%d')}-#{SecureRandom.hex(3).upcase}"
      
      # Simulate Real-Time Double-Entry Auto-Posting Verification
      journal_lines = [
        { account: '1101-01 (Kas/Bank/EDC)', debit: grand_total, credit: 0.0 },
        { account: '4101-01 (Pendapatan Penjualan)', debit: 0.0, credit: subtotal },
        { account: '2103-01 (Hutang PPN Keluaran 11%)', debit: 0.0, credit: tax }
      ]
      
      cogs_total = (subtotal * 0.35).round(2) # 35% standard HPP
      journal_lines << { account: '5101-01 (Beban HPP / COGS)', debit: cogs_total, credit: 0.0 }
      journal_lines << { account: '1104-01 (Persediaan Barang Dagang)', debit: 0.0, credit: cogs_total }
      
      res.status = 201
      res['Content-Type'] = 'application/json'
      res.body = {
        success: true,
        message: 'Order processed & Double-Entry Journal posted automatically',
        order: {
          order_number: order_number,
          subtotal: subtotal,
          tax: tax,
          grand_total: grand_total,
          completed_at: Time.now.iso8601,
          customer_name: payload['customerName'] || 'Walk-in Guest'
        },
        general_ledger_journal: {
          entry_number: journal_number,
          status: 'posted',
          total_debit: grand_total + cogs_total,
          total_credit: grand_total + cogs_total,
          lines: journal_lines
        }
      }.to_json
    rescue => e
      res.status = 422
      res['Content-Type'] = 'application/json'
      res.body = { success: false, error: e.message }.to_json
    end
  end
end

# 3. FINANCIAL REPORTS API (LABA RUGI & NERACA)
server.mount_proc '/api/v1/finance/reports/profit_loss' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    revenues: [
      { code: '4101-01', name: 'Pendapatan Penjualan F&B', amount: 345200000 },
      { code: '4101-02', name: 'Pendapatan Penjualan Retail & Merch', amount: 84500000 },
      { code: '4201-01', name: 'Pendapatan Service Charge (5%)', amount: 17260000 }
    ],
    totalRevenue: 446960000,
    cogs: [
      { code: '5101-01', name: 'Beban Pokok Penjualan (HPP F&B Bahan Baku)', amount: 138080000 },
      { code: '5101-02', name: 'Beban Pokok Penjualan (HPP Retail/Merchandise)', amount: 42250000 }
    ],
    totalCogs: 180330000,
    grossProfit: 266630000,
    operatingExpenses: [
      { code: '5201-01', name: 'Beban Gaji, Upah & Lembur Staf', amount: 82000000 },
      { code: '5202-01', name: 'Beban Sewa Gedung & Outlet', amount: 25000000 },
      { code: '5203-01', name: 'Beban Utilitas (Listrik, Air & Internet)', amount: 12400000 },
      { code: '5204-01', name: 'Beban Pemasaran & Promo Digital', amount: 15000000 }
    ],
    totalOperatingExpense: 134400000,
    netIncome: 132230000
  }.to_json
end

trap('INT') { server.shutdown }
puts "🚀 Ruby Enterprise API Server listening live on http://localhost:#{PORT}"
server.start
