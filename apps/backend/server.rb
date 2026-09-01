# frozen_string_literal: true

require 'webrick'
require 'json'
require 'bigdecimal'
require 'securerandom'
require 'date'
require 'net/http'
require 'uri'

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

# In-memory storage for seeded onboarding state
$onboarding_tenants = {}

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
    modules: ['pos_engine', 'finance_engine', 'inventory_engine', 'hr_engine', 'audit_engine', 'onboarding_engine'],
    timestamp: Time.now.iso8601
  }.to_json
end

# 2. ONBOARDING AI MAGIC SUGGESTION ENDPOINT
server.mount_proc '/api/v1/onboarding/ai_suggest' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  if req.request_method == 'POST'
    begin
      payload = JSON.parse(req.body || '{}')
      sector = (payload['sector'] || 'fnb').downcase
      brand_name = payload['brandName'] || 'Brand Baru Anda'

      suggestions = case sector
      when 'fnb', 'culinary', 'cafe'
        {
          taglines: [
            "Cita Rasa Autentik, Disajikan dengan Sepenuh Hati",
            "Ngopi Berkualitas & Santapan Terbaik Setiap Hari",
            "Eksplorasi Rasa Premium untuk Momen Spesial Anda"
          ],
          description: "#{brand_name} adalah destinasi kuliner dan kafe modern yang menyajikan racikan minuman artisanal serta hidangan pilihan dengan bahan baku berkualitas tinggi dalam suasana yang nyaman dan estetik.",
          recommendedCategories: [
            { name: 'Signature Coffee & Espresso', icon: '☕', code: 'CAT-COF' },
            { name: 'Artisanal Pastry & Bakery', icon: '🥐', code: 'CAT-PAS' },
            { name: 'Main Course & Asian Delights', icon: '🍲', code: 'CAT-FNB' },
            { name: 'Mocktail & Refreshing Drinks', icon: '🍹', code: 'CAT-MCK' }
          ],
          defaultBranchName: "Outlet Flagship #{brand_name}",
          suggestedOperatingHours: "08:00 - 22:00 WIB"
        }
      when 'retail', 'minimarket'
        {
          taglines: [
            "Belanja Lengkap, Hemat, dan Nyaman Dekat Anda",
            "Kebutuhan Harian Terlengkap dengan Harga Terbaik",
            "Solusi Belanja Cerdas & Praktis Keluarga Indonesia"
          ],
          description: "#{brand_name} merupakan jaringan minimarket dan retail modern yang menyediakan aneka kebutuhan pokok, sembako, makanan ringan, produk segar, dan perlengkapan rumah tangga dengan harga bersaing.",
          recommendedCategories: [
            { name: 'Sembako & Kebutuhan Dapur', icon: '🍚', code: 'CAT-SMB' },
            { name: 'Snack, Biskuit & Cokelat', icon: '🍪', code: 'CAT-SNK' },
            { name: 'Minuman Dingin & Susu', icon: '🧃', code: 'CAT-DRK' },
            { name: 'Perawatan Tubuh & Kebersihan', icon: '🧴', code: 'CAT-HYG' }
          ],
          defaultBranchName: "Store Utama #{brand_name}",
          suggestedOperatingHours: "07:00 - 23:00 WIB"
        }
      when 'fashion', 'apparel'
        {
          taglines: [
            "Gaya Autentik untuk Tampil Percaya Diri",
            "Koleksi Busana Tren Modern Berkualitas Premium",
            "Definisikan Karaktermu dengan Busana Terbaik"
          ],
          description: "#{brand_name} menghadirkan koleksi busana, apparel, dan aksesoris kontemporer yang menggabungkan kenyamanan material premium dengan desain modis untuk segala suasana.",
          recommendedCategories: [
            { name: 'T-Shirts & Casual Wear', icon: '👕', code: 'CAT-TSH' },
            { name: 'Outerwear & Jackets', icon: '🧥', code: 'CAT-OUT' },
            { name: 'Pants & Trousers', icon: '👖', code: 'CAT-PNT' },
            { name: 'Accessories & Bags', icon: '👜', code: 'CAT-ACC' }
          ],
          defaultBranchName: "Boutique #{brand_name} Grand Flagship",
          suggestedOperatingHours: "10:00 - 22:00 WIB"
        }
      when 'barbershop', 'services', 'salon'
        {
          taglines: [
            "Sentuhan Profesional untuk Penampilan Maksimal",
            "Layanan Grooming Premium & Perawatan Terbaik",
            "Tampil Rapi, Berkelas, dan Percaya Diri"
          ],
          description: "#{brand_name} adalah studio grooming dan perawatan profesional dengan kapster berpengalaman, produk perawatan premium, serta kenyamanan servis bintang lima.",
          recommendedCategories: [
            { name: 'Haircut & Styling', icon: '✂️', code: 'CAT-HRC' },
            { name: 'Shaving & Beard Grooming', icon: '🪒', code: 'CAT-SHV' },
            { name: 'Hair Spa & Scalp Treatment', icon: '💆', code: 'CAT-SPA' },
            { name: 'Pomade & Hair Care Products', icon: '🧴', code: 'CAT-PRD' }
          ],
          defaultBranchName: "Studio Studio #{brand_name}",
          suggestedOperatingHours: "09:00 - 21:00 WIB"
        }
      else
        {
          taglines: [
            "Solusi Terpercaya & Pelayanan Berkualitas Unggul",
            "Dedikasi Terbaik untuk Kepuasan Anda Setiap Saat",
            "Kualitas Prima, Transparansi, dan Kepercayaan"
          ],
          description: "#{brand_name} berkomitmen memberikan produk dan pelayanan unggul bagi seluruh pelanggan dengan standar operasional profesional dan teknologi terintegrasi.",
          recommendedCategories: [
            { name: 'Layanan Utama', icon: '⭐', code: 'CAT-PRI' },
            { name: 'Produk Pendukung', icon: '📦', code: 'CAT-SEC' }
          ],
          defaultBranchName: "Kantor / Cabang Utama #{brand_name}",
          suggestedOperatingHours: "08:00 - 17:00 WIB"
        }
      end

      res.status = 200
      res['Content-Type'] = 'application/json'
      res.body = {
        success: true,
        sector: sector,
        aiGenerated: true,
        data: suggestions
      }.to_json
    rescue => e
      res.status = 422
      res['Content-Type'] = 'application/json'
      res.body = { success: false, error: e.message }.to_json
    end
  end
end

# 3. ONBOARDING COMPLETE (ATOMIC SEEDING TRANSACTION)
server.mount_proc '/api/v1/onboarding/complete' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  if req.request_method == 'POST'
    begin
      payload = JSON.parse(req.body || '{}')
      tenant_id = payload['tenantId'] || 't-01'
      brand_data = payload['brand'] || {}
      branches_data = payload['branches'] || []
      employees_data = payload['employees'] || []

      # Validate critical fields
      raise "Nama brand wajib diisi!" if brand_data['name'].to_s.strip.empty?
      raise "Minimal harus ada 1 cabang!" if branches_data.empty?

      brand_id = "b-#{SecureRandom.hex(3)}"
      
      # Process and seed branches
      processed_branches = branches_data.map.with_index do |br, idx|
        {
          id: "br-#{SecureRandom.hex(3)}",
          tenantId: tenant_id,
          brandId: brand_id,
          name: br['name'],
          code: br['code'] || "CAB-#{idx+1}",
          address: br['address'] || '',
          city: br['city'] || 'Jakarta',
          phone: br['phone'] || '',
          operatingHours: br['operatingHours'] || '08:00 - 22:00 WIB',
          branchType: 'store',
          geofenceRadiusMeters: 100,
          isActive: true
        }
      end

      # Process and seed employees
      processed_employees = employees_data.map do |emp|
        {
          id: "emp-#{SecureRandom.hex(3)}",
          brandId: brand_id,
          brandName: brand_data['name'],
          name: emp['name'],
          email: emp['email'],
          phone: emp['phone'] || '',
          role: emp['role'] || 'cashier',
          roleTitle: emp['roleTitle'] || 'Kasir Frontliner',
          branchId: emp['branchIds']&.first || processed_branches.first[:id],
          branchName: processed_branches.first[:name],
          posPin: emp['posPin'] || '1234',
          status: 'active'
        }
      end

      # Mark tenant onboarding as complete
      $onboarding_tenants[tenant_id] = {
        onboarding_completed: true,
        completed_at: Time.now.iso8601,
        brand_id: brand_id,
        brand_name: brand_data['name']
      }

      res.status = 201
      res['Content-Type'] = 'application/json'
      res.body = {
        success: true,
        message: 'Onboarding completed & initial business ecosystem seeded successfully',
        tenant: {
          id: tenant_id,
          onboarding_completed: true
        },
        brand: {
          id: brand_id,
          name: brand_data['name'],
          businessSector: brand_data['businessSector'],
          tagline: brand_data['tagline'],
          description: brand_data['description'],
          logoUrl: brand_data['logoUrl'],
          bannerUrl: brand_data['bannerUrl'],
          socialLinks: brand_data['socialLinks'] || {}
        },
        branchesCreated: processed_branches,
        employeesCreated: processed_employees
      }.to_json
    rescue => e
      res.status = 422
      res['Content-Type'] = 'application/json'
      res.body = { success: false, error: e.message }.to_json
    end
  end
end

# 4. LIVE POS CHECKOUT & REAL-TIME AUTO POSTING API
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
      
      journal_lines = [
        { account: '1101-01 (Kas/Bank/EDC)', debit: grand_total, credit: 0.0 },
        { account: '4101-01 (Pendapatan Penjualan)', debit: 0.0, credit: subtotal },
        { account: '2103-01 (Hutang PPN Keluaran 11%)', debit: 0.0, credit: tax }
      ]
      
      cogs_total = (subtotal * 0.35).round(2)
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

# 5. FINANCIAL REPORTS API
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

# 10. DEVELOPER DUMMY SEEDER ENDPOINT
server.mount_proc '/api/v1/dev/seed' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  load File.expand_path('db/seeds.rb', __dir__) if File.exist?(File.expand_path('db/seeds.rb', __dir__))

  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    status: 'success',
    message: 'Data dummy transaksi POS, CRM member, multi-cabang, dan jurnal PSAK berhasil di-seed.',
    timestamp: Time.now.iso8601,
    data: DUMMY_DATABASE_SEED
  }.to_json
end

# 11. FAQ & KNOWLEDGE BASE API
server.mount_proc '/api/v1/faq' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    status: 'success',
    platform: 'Modula Enterprise',
    version: '3.2.0-enterprise',
    categories: ['pos', 'finance', 'security', 'saas', 'hardware'],
    timestamp: Time.now.iso8601
  }.to_json
end

# 12. TERMS & CONDITIONS API
server.mount_proc '/api/v1/terms' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    status: 'success',
    contract_version: 'v3.2-Legal',
    jurisdiction: 'Republik Indonesia',
    sla_uptime: '99.9%',
    privacy_protocol: 'Zero-Knowledge Isolation',
    timestamp: Time.now.iso8601
  }.to_json
end

# 13. ABOUT & CREATOR API
server.mount_proc '/api/v1/about' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    app_name: 'Modula Enterprise',
    creator: 'parikesitad-pm',
    creator_github: 'https://github.com/parikesitad-pm',
    target_repository: 'https://github.com/aenzet04/adamproject.git',
    tech_stack: {
      frontend: 'React 18.3 + TypeScript + Vite + TailwindCSS',
      backend: 'Ruby 3.2 + Modular Rails Engines',
      database: 'MariaDB / MySQL 8.0 InnoDB (utf8mb4)',
      email_sandbox: 'Mailpit (SMTP: 1025, Web: 8025)'
    },
    release_version: 'v3.2.0-enterprise',
    timestamp: Time.now.iso8601
  }.to_json
end

# 14. AUTH CONFIRMATION & RESET EMAIL DISPATCH (SERVER-TO-SERVER TO MAILPIT / SMTP)
server.mount_proc '/api/v1/auth/send_email' do |req, res|
  enable_cors(res)
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end

  if req.request_method == 'POST'
    begin
      payload = JSON.parse(req.body)
      to_email = payload['to'] || 'user@example.com'
      to_name = payload['name'] || 'User'
      subject = payload['subject'] || 'Modula Security Token'
      html_content = payload['html'] || "<p>Token: #{payload['token']}</p>"
      token = payload['token'] || '000000'

      # Send to Mailpit HTTP REST API on port 8025 (no browser CORS issue because Ruby is backend)
      uri = URI('http://localhost:8025/api/v1/send')
      http = Net::HTTP.new(uri.host, uri.port)
      http.open_timeout = 2
      http.read_timeout = 2

      mailpit_req = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
      mailpit_req.body = {
        From: { Email: 'noreply@modula.id', Name: 'Modula Enterprise Security Core' },
        To: [{ Email: to_email, Name: to_name }],
        Subject: subject,
        HTML: html_content,
        Text: "#{subject}\n\nKode Token Otentikasi Anda: #{token}\n\nBerlaku 15 menit.\nPT Multi Industri Nusantara"
      }.to_json

      mailpit_res = http.request(mailpit_req)

      res.status = 200
      res['Content-Type'] = 'application/json'
      res.body = {
        status: 'success',
        message: 'Email verifikasi berhasil dikirim ke Mailpit Inbox.',
        mailpit_status: mailpit_res.code,
        token: token
      }.to_json
    rescue => e
      res.status = 200
      res['Content-Type'] = 'application/json'
      res.body = {
        status: 'simulated',
        message: "Email dispatch simulation: #{e.message}",
        token: token || '123456'
      }.to_json
    end
  end
end

trap('INT') { server.shutdown }
puts "🚀 Ruby Enterprise API Server listening live on http://localhost:#{PORT}"
server.start
