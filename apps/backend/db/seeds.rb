# frozen_string_literal: true

require 'json'
require 'securerandom'
require 'date'

puts "🌱 [Modula Developer Seeder] Initializing enterprise dummy dataset..."

DUMMY_DATABASE_SEED = {
  tenant: {
    id: "t-#{SecureRandom.hex(4)}",
    name: "PT Multi Industri Nusantara Holding",
    legalEntityType: "PT",
    taxId: "01.892.435.1-014.000",
    status: "active"
  },
  brands: [
    {
      id: "b-01",
      name: "Kopi Nusantara Roastery",
      code: "KNR",
      industryType: "fnb",
      tagline: "Cita Rasa Autentik Nusantara, Disajikan dengan Sepenuh Hati"
    },
    {
      id: "b-02",
      name: "Nusantara Retail Mart",
      code: "NRM",
      industryType: "retail",
      tagline: "Belanja Lengkap, Cepat & Hemat Dekat Anda"
    }
  ],
  branches: [
    { id: "br-01", brandId: "b-01", name: "Outlet Grand Indonesia", code: "GI-01", city: "Jakarta Pusat" },
    { id: "br-02", brandId: "b-01", name: "Outlet Senopati", code: "SNP-02", city: "Jakarta Selatan" },
    { id: "br-03", brandId: "b-02", name: "Store Kelapa Gading", code: "KG-01", city: "Jakarta Utara" }
  ],
  warehouses: [
    { id: "wh-01", branchId: "br-01", name: "Gudang Utama Barista GI", code: "WH-GI-MAIN" },
    { id: "wh-02", branchId: "br-02", name: "Gudang Outlet Senopati", code: "WH-SNP-MAIN" }
  ],
  products: [
    { sku: "FNB-ESP-01", name: "Espresso Single Origin Gayo", sellingPrice: 28000, standardCost: 8500, stockOnHand: 150, category: "Coffee" },
    { sku: "FNB-LAT-02", name: "Signature Palm Sugar Latte", sellingPrice: 35000, standardCost: 11000, stockOnHand: 120, category: "Coffee" },
    { sku: "FNB-CRO-08", name: "Smoked Beef Croissant", sellingPrice: 42000, standardCost: 16500, stockOnHand: 45, category: "Bakery" },
    { sku: "RET-RBG-12", name: "Roasted Beans Aceh Gayo 250g", sellingPrice: 95000, standardCost: 44000, stockOnHand: 35, category: "Merchandise" }
  ],
  crm_members: [
    { id: "crm-01", name: "Bpk. Irwan Hidayat", phone: "081234567890", tier: "Gold", points: 450, totalSpend: 2450000 },
    { id: "crm-02", name: "Ibu Dian Sastro (VIP)", phone: "081987654321", tier: "VIP", points: 890, totalSpend: 5800000 },
    { id: "crm-03", name: "Sdr. Kevin Sanjaya", phone: "081399887766", tier: "Silver", points: 120, totalSpend: 680000 }
  ],
  sales_channels: ["DINE_IN", "TAKE_AWAY", "GRABFOOD", "GOFOOD", "SHOPEEFOOD", "MAXIM"]
}

puts "✅ [Modula Developer Seeder] Successfully seeded #{DUMMY_DATABASE_SEED[:products].length} products, #{DUMMY_DATABASE_SEED[:crm_members].length} CRM members, and #{DUMMY_DATABASE_SEED[:branches].length} branches!"
