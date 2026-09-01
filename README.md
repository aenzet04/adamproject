# 👑 MODULA v3.2.0-enterprise — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

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

> **Modula** adalah platform SaaS ERP, Point of Sale (POS) Berkecepatan Tinggi, Manajemen Rantai Pasok Gudang (SCM), dan Inti Akuntansi Buku Besar PSAK multi-tenant tingkat enterprise. Dirancang untuk grup holding konglomerasi, multi-brand, multi-cabang, dan multi-gudang dengan isolasi data yang sangat ketat, keamanan otentikasi enterprise, dan performa tinggi.

---

## 👨‍💻 Identitas Pembuat & Tim Pengembang
- **Lead Creator & Software Architect:** [parikesitad-pm](https://github.com/parikesitad-pm) (GitHub: `parikesitad-pm`)
- **Collaborator & Target Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 🚀 Changelog Versi Terbaru: Modula v3.2.0-enterprise (Release Sprint)

### 🔐 1. Manajemen Keamanan PIN Kasir (Default `0000` & Wajib Ubah PIN)
- **Pembuatan Kasir Baru:** Saat admin menambahkan staf dengan peran `cashier`, form input PIN dinamis otomatis muncul dengan default `0000`.
- **Enforcement Modal Ganti PIN:** Saat kasir login untuk pertama kali dengan PIN bawaan, sistem menampilkan banner peringatan keamanan merah dan modal interaktif wajib ganti PIN (4-6 digit numeric regex).

### 💳 2. Perpanjangan Langganan Fleksibel & Notifikasi Tagihan
- **Opsi Durasi Perpanjangan:** Menu Super User kini mendukung perpanjangan fleksibel:
  - `+1 Bulan (Bulanan)`
  - `+3 Bulan (Triwulan)`
  - `+6 Bulan (Semester)`
  - `+12 Bulan (Tahunan)`
- **Auto-Billing WhatsApp & Mailpit:** Pengiriman invoice instan ke nomor WhatsApp Owner dan testing email via Mailpit.

### 🌐 3. Public SaaS Landing Page & Katalog Harga Add-On
- **Landing Page Publik di Root (`/`):**
  - Paket Starter UMKM (`Rp 149.000/bln`), Business Menengah (`Rp 349.000/bln`), dan Enterprise Holding (`Rp 799.000/bln`).
  - Toggle Switch Diskon Tahunan Hemat 25%.
  - Add-On Modular Catalogue (Realtime Chat Rp 49k, AI Forecaster Rp 349k, dll).
  - Tombol CTA *"Luncurkan Demo Enterprise"* untuk masuk langsung ke aplikasi.

### 📑 4. PowerPoint (.pptx) Executive Presentation Exporter
- **Ekspor Presentasi PPTX 1-Klik:** Di samping PDF dan Excel CSV, modul Akuntansi & Keuangan kini memiliki tombol `[ 📑 Export PPTX ]` untuk men-generate deck presentasi eksekutif berformat `.pptx` bagi investor.

### 🏭 5. Multi-Warehouse Creation & 14-Day Trial Sandbox Mode
- **Modal Tambah Gudang Baru:** Pembuatan gudang dengan pilihan metode kalkulasi HPP (*Moving Average PSAK, FIFO, Standard*).
- **Mode Simulasi Trial Gudang (14 Hari):** Switch interaktif untuk menguji transfer stok dan restock gudang tanpa memengaruhi neraca keuangan riil.

### 🔬 6. R&D & Engineering Labs Sidebar Navigation
- **Struktur Sidebar Baru Terorganisir:**
  1. `👑 Executive Suite`: Owner Dashboard, Investor Slide Deck, Brand & Staff Admin, Super User Director.
  2. `🛒 Operasional & Toko` *(Strictly Hidden & Isolated untuk Super User demi Privasi)*: Kasir POS, Gudang SCM, Stok Opname, CRM & Member, Akuntansi & GL.
  3. `💬 Kolaborasi Tim`: Realtime Team Chat (Brand & Branch).
  4. `🔬 R&D & Engineering Labs` *(Tersedia untuk semua role)*:
     - 🚀 Hardware Stress Benchmark Suite.
     - 📚 Dokumentasi Modula.
     - 📑 Swagger API Specs.
     - 🗄️ Database Manager *(Eksklusif Super User)*.
     - 🎫 Tiket Insiden Bug.
     - 🗑️ Soft-Delete Trash Manager.

### 🗄️ 7. Super User Database Manager & Zero-Knowledge Schema Explorer
- Eksplorasi 11 tabel relasional internal dengan pemantauan ukuran memori dan jumlah baris real-time.
- Interactive SQL Query Runner, Live Snapshot Backup, dan status enkripsi AES-256 GCM.

### ✏️ 8. Edit Data Karyawan & Reset PIN
- Modal `✏️ Edit Data Karyawan` di Brand Admin Dashboard untuk memperbarui profil, nomor telepon, shift, mutasi cabang, dan reset PIN kasir ke `0000`.

### 👥 9. Lightweight CRM Customer Search Modal `[F3]`
- Modal pencarian instan member CRM dengan keyboard shortcut `[F3]`, pencarian instan nama/nomor HP, dan pendaftaran kilat tamu baru dengan welcome bonus 10 poin.

---

## ⌨️ Daftar Shortcut Keyboard Kasir POS

| Shortcut | Aksi Cepat |
|---|---|
| `[F2]` | Fokus ke Kolom Pencarian Produk / Scan Barcode |
| `[F3]` | Buka Modal Cepat Pendaftaran & Pencarian Member CRM |
| `[F4]` | Buka Modal Manajemen Shift Kasir (Buka / Tutup Shift) |
| `[F8]` | Buka Pusat Manajemen Meja & Transaksi Hold Antar Konsumen |
| `[F9]` | Buka Modal Penyelesaian Pembayaran Multi-Metode (Settlement) |

---

## 🏗️ Struktur Arsitektur Multi-Tenant

```
Modula Enterprise Holding Core
├── 🏢 Tenants (Holding Company / Badan Hukum PT, CV)
│   ├── 🏷️ Brands (Unit Bisnis & Sektor Usaha: F&B, Retail, Jasa, dll)
│   │   ├── 🏪 Branches / Outlets (Toko Fisik & Geofence Location)
│   │   │   ├── 📦 Warehouses (Gudang Bahan Baku, Packaging, Central Kitchen)
│   │   │   └── 🛒 POS Terminals & Kasir (Dual Payment, Split Bill, Kitchen Ticket)
│   │   └── 👥 Staff & Karyawan (Owner, GM, Branch Manager, Kasir PIN, Gudang, IT)
│   └── 📊 General Ledger PSAK & Chart of Accounts
```

---

## 🛠️ Panduan Instalasi & Menjalankan Sistem

```bash
# 1. Clone repository
git clone https://github.com/aenzet04/adamproject.git
cd adamproject

# 2. Setup & Jalankan Frontend Vite
cd apps/frontend
npm install
npm run dev

# 3. Setup & Jalankan Backend Ruby API (Terminal Baru)
cd apps/backend
bundle install
ruby server.rb

# 4. Testing Email dengan Mailpit
# SMTP Port: 1025 | Web Dashboard: http://localhost:8025/
```

---
© 2026 **Modula Enterprise**. Engineered by [parikesitad-pm](https://github.com/parikesitad-pm).
