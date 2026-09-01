# 👑 MODULA v3.2.0-enterprise — Developer & Architecture Handbook

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-v3.2.0--enterprise-purple.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)]()
[![Ruby](https://img.shields.io/badge/Backend-Ruby%203.2%20%2F%20Rails-red.svg)]()
[![Database](https://img.shields.io/badge/Database-MySQL%208%20%2F%20MariaDB-orange.svg)]()
[![Mailpit](https://img.shields.io/badge/Email%20Testing-Mailpit%208025%2F1025-0284c7.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **Modula Enterprise Core** adalah platform modular enterprise multi-tenant yang menggabungkan mesin Kasir POS Berkecepatan Tinggi (&lt; 1 ms), Manajemen Rantai Pasok Multi-Gudang (SCM), dan Inti Pembukuan Akuntansi Buku Besar Otomatis Standar PSAK Indonesia.

---

## 👨‍💻 Identitas Arsitek & Engineering Team
- **Principal Software Architect & Lead Creator:** [parikesitad-pm](https://github.com/parikesitad-pm) (GitHub: `parikesitad-pm`)
- **Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 📐 Arsitektur Monorepo & Sistem Modul

```
adamProject/
├── apps/
│   ├── frontend/                       # React 18.3 + TypeScript + Vite + TailwindCSS
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── atoms/              # Toast, SkeletonSuite, Preloader, Shimmer
│   │   │   │   ├── admin/              # BrandAdminDashboard, StaffEditModal
│   │   │   │   ├── auth/               # AuthPortal, CashierPinChangeModal
│   │   │   │   ├── benchmark/          # BenchmarkViewer (Hardware Stress Engine)
│   │   │   │   ├── chat/               # RealtimeTeamChatView (AddOn Paywall + Live Beacon)
│   │   │   │   ├── crm/                # CustomerManagementView (Top Spender & Tiering)
│   │   │   │   ├── database/           # DatabaseManagerView (Zero-Knowledge Schema Explorer)
│   │   │   │   ├── docs/               # DocumentationViewer (Slide & Developer Guide)
│   │   │   │   ├── finance/            # FinancialStatementsViewer (Laba Rugi & PPTX Exporter)
│   │   │   │   ├── inventory/          # InventoryManagementView, StockOpnameView
│   │   │   │   ├── landing/            # PublicLandingPage (Pricing Tiers & Add-On Catalogue)
│   │   │   │   ├── onboarding/         # OnboardingWizardModal (Multi-Step First-Time Wizard)
│   │   │   │   ├── owner/              # OwnerAnalyticsDashboard (Multi-Chart Suite)
│   │   │   │   ├── pos/                # PosTerminal, PosCustomerSearchModal [F3], SplitBillModal
│   │   │   │   ├── presentation/       # InvestorPitchDeckModal (Interactive Presentation)
│   │   │   │   ├── public/             # FaqView, TermsAndConditionsView, AboutUsView
│   │   │   │   ├── superuser/          # SuperUserDashboard (Flexible SaaS Renewal)
│   │   │   │   ├── swagger/            # SwaggerApiViewer (Interactive OpenAPI Spec)
│   │   │   │   └── trash/              # SoftDeleteManager (Audit Trail & Item Recovery)
│   │   │   ├── stores/                 # Zustand Persistent State Stores
│   │   │   │   ├── useAuthStore.ts     # Auth Session & Role-Based Access Control
│   │   │   │   ├── useCustomerStore.ts # CRM Members, Points & Lifetime Spender
│   │   │   │   ├── useInternalChatStore.ts # WebSocket Chat, Emoji Reactions & Beacon
│   │   │   │   ├── useModuleLicenseStore.ts# Granular SaaS Modular Licensing
│   │   │   │   ├── usePosCartStore.ts  # POS Cart State, Discounts, Split-Bill
│   │   │   │   ├── useStaffStore.ts    # Staff Directory, Branch Transfers & PIN
│   │   │   │   ├── useTenantStore.ts   # Holding Tenants, Brands, Branches, Warehouses
│   │   │   │   └── useToastStore.ts    # High-Contrast Notification & Audio Cues
│   │   │   └── types/index.ts          # Core TypeScript Enums, Regex Patterns & Interfaces
│   └── backend/                        # Ruby 3.2 High-Concurrency API Server
│       ├── server.rb                   # WEBrick + Custom Router (Port 3001)
│       └── engines/                    # Modular Engines (pos, finance, inventory, hr, audit)
└── scripts/
    └── auto_git_sync.mjs               # Background Daemon Git Synchronizer
```

---

## ⚡ Fitur Utama & Invarian Rekayasa (v3.2.0-Enterprise)

### 1. 🔐 Keamanan PIN Kasir & RBAC Hierarkis
- **PIN Bawaan Kasir:** Setiap staf kasir baru otomatis memiliki PIN `0000`.
- **Wajib Ganti PIN:** Saat kasir login pertama kali, komponen `CashierPinChangeModal.tsx` secara otomatis memblokir transaksi hingga kasir memasukkan 4-6 digit PIN baru yang divalidasi via `REGEX_PATTERNS.PIN`.
- **Role Hierarki:** `super_user`, `owner`, `general_manager`, `branch_manager`, `admin_brand`, `warehouse_staff`, `cashier`, `staff_it`, `staff`.

### 2. 📊 Multi-Chart Visualizer & Analisis Finansial PSAK
- `OwnerAnalyticsDashboard.tsx` dilengkapi multi-format visualizer:
  - 📈 **Spline Area Line Chart:** Tren omzet harian dengan hover tooltip & titik interaktif.
  - 📊 **Column Bar Chart:** Perbandingan volume transaksi per hari.
  - 🥧 **Channel Pie Chart:** Pangsa revenue (Dine-In, Take Away, GoFood, GrabFood, ShopeeFood, Maxim).
  - 🍩 **Kategori Donut Chart:** Kontribusi kopi signature, makanan berat, dan pastry.
  - 📋 **Tabular Breakdown:** Rekapitulasi struk dan average ticket size.

### 3. 📑 Executive Exporter Suite (.PDF, .CSV, .PPTX)
- Modul Keuangan PSAK menyediakan ekspor satu-klik:
  - `exportToPdf`: Dokumen PDF resolusi tinggi dengan header legal perusahaan.
  - `exportToExcelCsv`: File spreadsheet kompatibel Microsoft Excel & Google Sheets.
  - `exportToPptxPresentation`: Presentasi PowerPoint `.pptx` interaktif untuk presentasi direksi & investor holding.

### 4. 🏭 Multi-Warehouse & 14-Day Trial Sandbox Mode
- Dukungan pembuatan gudang baru dengan metode HPP: **Moving Average (PSAK)**, **FIFO**, dan **Standard Costing**.
- Fitur simulasi trial gudang 14 hari tanpa mengubah jurnal pembukuan buku besar riil.

### 5. 🛡️ Protokol Zero-Knowledge Privacy Super User
- Akun `super_user` diisolasi dari transaksi operasional toko harian (`pos`, `inventory`, `opname`) untuk mematuhi etika bisnis privasi tenant.
- Inspeksi diagnostik hanya dapat dilakukan melalui tiket audit `#TCK-XXXXXX` yang disetujui Owner / GM.

---

## ⌨️ Shortcut Keyboard POS Terminal Kasir

| Shortcut | Fungsi |
|---|---|
| `[F2]` | Fokus Kolom Pencarian Cepat Produk & Scan Barcode |
| `[F3]` | Buka Modal CRM Member (Pencarian & Registrasi Tamu Baru) |
| `[F4]` | Buka Modal Buka / Tutup Shift Kasir & Rekonsiliasi Kas |
| `[F8]` | Manajemen Meja & Hold Bill Antar Transaksi |
| `[F9]` | Buka Settlement Modal Pembayaran (Cash, QRIS, EDC BCA, EDC Mandiri, Dual Payment) |

---

## 🚀 Panduan Menjalankan Sistem Lokal

### Frontend (React 18 + Vite)
```bash
cd apps/frontend
npm install
npm run dev
# Server running at: http://localhost:3000
```

### Backend (Ruby 3.2 API)
```bash
cd apps/backend
bundle install
ruby server.rb
# API Server listening at: http://localhost:3001
```

### Mailpit Email Sandbox
```bash
# Web UI Dashboard: http://localhost:8025/
# SMTP Port: 1025
```

---

## 🧪 Verifikasi & Pengujian Kode
```bash
# Verifikasi Type Safety TypeScript & Production Build
cd apps/frontend
npx tsc --noEmit
npm run build
```

---
© 2026 **Modula Enterprise**. Designed & Engineered by [parikesitad-pm](https://github.com/parikesitad-pm).
