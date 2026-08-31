# 👑 MODULA v2.7.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)]()
[![Ruby](https://img.shields.io/badge/Backend-Ruby%203.2%20%2F%20Rails-red.svg)]()
[![Database](https://img.shields.io/badge/Database-MySQL%208%20%2F%20MariaDB-orange.svg)]()
[![Mailpit](https://img.shields.io/badge/Email%20Testing-Mailpit%208025%2F1025-0284c7.svg)]()
[![OAuth 2.0](https://img.shields.io/badge/OAuth%202.0-Google%20%7C%20GitHub%20%7C%20Apple%20%7C%20Microsoft-blueviolet.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **Modula** adalah platform SaaS ERP, Point of Sale (POS) Berkecepatan Tinggi, Manajemen Rantai Pasok Gudang (SCM), dan Inti Akuntansi Buku Besar PSAK multi-tenant tingkat enterprise. Dirancang untuk grup holding konglomerasi, multi-brand, multi-cabang, dan multi-gudang dengan isolasi data yang sangat ketat, keamanan otentikasi enterprise, dan performa tinggi.

---

## 👨‍💻 Identitas Pembuat & Tim Pengembang
- **Lead Creator & Software Architect:** [parikesitad-pm](https://github.com/parikesitad-pm) (GitHub: `parikesitad-pm`)
- **Collaborator & Target Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 🚀 Changelog Versi Terbaru: Modula v2.7.0

### 🧙‍♂️ 1. First-Time Login Onboarding Wizard (Multi-Step Setup Stepper)
- **Alur Interaktif Saat Login Pertama / Brand Baru:**
  1. **🔹 Step 1: Identitas Brand & AI Magic Suggestion:**
     - Input Nama Brand, Sektor Bisnis (*F&B / Kafe, Retail / Minimarket, Fashion & Apparel, Barbershop / Salon, Apotek / Klinik, Ekspedisi / Jasa*).
     - Tombol **`[ ✨ Generate via AI ]`** yang otomatis meng-generate tagline menjual, deskripsi bisnis yang menarik, dan template kategori produk sesuai sektor usaha.
     - Pratinjau & Upload Logo Brand (Square) serta Banner Header Lebar (16:9 aspect ratio) untuk branding struk, katalog web, dan dashboard.
     - Input media sosial: Instagram, TikTok, WhatsApp Business, dan Website.
  2. **🔹 Step 2: Multi-Branch Initializer & Auto Warehouse:**
     - Setup Cabang Utama & tombol **`[ + Tambah Cabang Lainnya ]`** dinamis (Nama cabang, kode cabang, alamat, kota, telepon, dan jam operasional).
     - Setiap cabang otomatis dibuatkan gudang persediaan utama (*default inventory storage*).
  3. **🔹 Step 3: Setup Karyawan Awal & POS PIN:**
     - Input Nama Karyawan, WhatsApp/Email, Peran (*Branch Manager, Head Cashier, Kasir POS, Staf Gudang SCM*), Penugasan Cabang, dan 4-6 digit numeric POS PIN untuk login cepat tablet/HP.
     - List karyawan instan lengkap dengan status badge & masked PIN (`••••`).
  4. **🔹 Step 4: Peluncuran Bisnis:**
     - Review profil brand lengkap $\rightarrow$ tombol **`[ 🚀 Simpan & Luncurkan Bisnis Saya ]`**.

### ⚡ 2. Backend Rails / Ruby Endpoints untuk Onboarding
- `POST /api/v1/onboarding/ai_suggest` $\rightarrow$ Menghasilkan rekomendasi bio, tagline, kategori produk, dan cabang default berdasarkan sektor bisnis dalam 1ms.
- `POST /api/v1/onboarding/complete` $\rightarrow$ Transaksi atomik (*Atomic Seeding Transaction*) yang menyimpan Brand, Media Branding, Multi-Cabang, Gudang, dan Karyawan sekaligus.

### 🛒 3. Login Kasir Cepat Kode Cabang, Email Mailpit & Lupa Sandi
- Mode login kasir kilat menggunakan **Kode Cabang (Branch Code)** + ID/Username Kasir + PIN.
- Konfirmasi OTP pendaftaran akun via **Mailpit Local SMTP Server** (Port `1025` / Web UI `http://localhost:8025/`).
- Alur Lupa Kata Sandi terintegrasi.

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

## 🛠️ Stack Teknologi & Layanan Server

- **Frontend:** React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4
- **Email Testing Server:** Mailpit (SMTP: `1025`, Web UI: `http://localhost:8025/`)
- **Tipografi:** Google Font Ubuntu & Ubuntu Mono
- **Audio:** Web Audio API Frequency Synthesizer (100% Offline)
- **State Management:** Zustand dengan `persist` middleware
- **Backend API:** Ruby 3.2 / Sinatra / Rails API (Port: `3001`)
- **Database Engine:** MySQL 8.0 & MariaDB Compatible
- **Authentication:** JWT + OAuth 2.0 (Google, GitHub, Apple, Microsoft)

---

## 🏃 Cara Menjalankan Aplikasi

```bash
# 1. Jalankan Mailpit Email Server (Background)
mailpit &

# 2. Jalankan Backend Ruby API (Port 3001)
ruby apps/backend/server.rb &

# 3. Masuk ke direktori frontend & jalankan (Port 3000)
cd apps/frontend
npm install
npm run build
npm run dev
```

Akses portal aplikasi di:
- **Modula Core:** `http://localhost:3000/`
- **Mailpit Email Web UI:** `http://localhost:8025/`
- **Customer Guest Review Portal:** `http://localhost:3000/review`

---
*Dikembangkan dengan standar arsitektur enterprise oleh **parikesitad-pm**.*
