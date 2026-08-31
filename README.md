# 👑 MODULA v2.3.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)]()
[![Ruby](https://img.shields.io/badge/Backend-Ruby%203.2%20%2F%20Rails-red.svg)]()
[![Database](https://img.shields.io/badge/Database-MySQL%208%20%2F%20MariaDB-orange.svg)]()
[![OAuth 2.0](https://img.shields.io/badge/OAuth%202.0-Google%20%7C%20GitHub%20%7C%20Apple%20%7C%20Microsoft-blueviolet.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **Modula** adalah platform SaaS ERP, Point of Sale (POS) Berkecepatan Tinggi, Manajemen Rantai Pasok Gudang (SCM), dan Inti Akuntansi Buku Besar PSAK multi-tenant tingkat enterprise. Dirancang untuk grup holding konglomerasi, multi-brand, multi-cabang, dan multi-gudang dengan isolasi data yang sangat ketat, keamanan otentikasi enterprise, dan performa tinggi.

---

## 👨‍💻 Identitas Pembuat & Tim Pengembang
- **Lead Creator & Software Architect:** [parikesitad-pm](https://github.com/parikesitad-pm) (GitHub: `parikesitad-pm`)
- **Collaborator & Target Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 🌟 Fitur Unggulan Utama Modula v2.3.0

### 🔐 1. OAuth 2.0 & Enterprise Single Sign-On (SSO)
- **Multi-Provider Authentication:**
  - 🔴 **Google SSO / Workspace**
  - 🐙 **GitHub OAuth** (Terintegrasi profil arsitek `parikesitad-pm`)
  - 🍎 **Apple ID**
  - 💼 **Microsoft / Azure Active Directory SSO**
- **Keamanan Kata Sandi Real-Time:** Meteran indikator kekuatan sandi (*Password Strength Meter*) mendeteksi huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter.

### 🎨 2. 5 Pilihan Gaya Layout Tampilan Keranjang (Cart Display Modes)
Kasir dapat mengganti tampilan keranjang belanja kasir secara instan melalui tombol **`🎨`**:
1. **🎴 Modern Sleek Cards:** Kartu modern dengan tombol kuantitas interaktif dan input catatan dapur individual.
2. **📑 Compact Table List (Supermarket / Retail Mode):** Format baris tabel berdensitas tinggi untuk kecepatan input kasir minimarket.
3. **🖼️ Visual Thumbnail Grid:** Kotak media visual dengan tombol sentuh kuantitas cepat untuk tablet/iPad kasir.
4. **🍳 Kitchen / Barista KDS Ticket View:** Menonjolkan instruksi resep dan catatan pesanan dapur secara mencolok (*Less sugar, extra hot, no ice*).
5. **📊 Detailed Accounting & Tax Breakdown:** Menampilkan rincian audit kode SKU, HPP standar (COGS), alokasi PPN/PB1, dan estimasi margin laba kotor item.

### 🍽️ 3. Manajemen Table & Hold Bill Multi-Konsumen (`[F8]`)
- Simpan pesanan berjalan (*Hold Bill / Open Table*) per nomor meja & nama pelanggan secara terpisah.
- Kasir dapat beralih antar meja aktif (*Switch/Resume Table*), menambah item pesanan, atau langsung menyelesaikan pembayaran.
- Keranjang kasir langsung bersih setelah pesanan di-hold, siap melayani tamu berikutnya tanpa risiko data tertukar.

### 📁 4. Sidebar Auto-Hide / Collapsible Ala Gemini & ChatGPT
- Toggle collapse/expand sidebar (`w-16` vs `w-64`) untuk memaksimalkan area kerja kasir, laporan keuangan, dan dashboard analitik (*full-width workspace*).

### 📈 5. Grafik Garis Standar Laporan Keuangan (PSAK)
- Grafik garis pendapatan bersih dengan interactive hover tooltip, filter harian/mingguan/bulanan/tahunan, dan ringkasan tren omzet tanpa elemen rumit bursa saham.

### ⏱️ 6. Open / Close Shift Kasir & Deteksi Keterlambatan Realtime
- **Open Shift:** Kasir menginput jadwal masuk dan modal kas awal laci (*cash float*).
- **Deteksi Keterlambatan:** Menghitung otomatis keterlambatan kasir dan langsung mengirimkan kartu peringatan (*Alert Card*) ke Dashboard Owner.
- **Close Shift & Rekonsiliasi Kas Fisik:** Rekonsiliasi otomatis kas fisik vs sistem dengan laporan selisih kas (*discrepancy*).

### 💬 7. Brand Team Chat & Tiketing Super User Terisolasi
- **Internal Brand Team Chat:** Kasir ↔ Admin Brand ↔ Owner dalam 1 brand saling berkoordinasi secara langsung.
- **Isolasi Ketat Multi-Tenant:** Brand $B$ tidak dapat melihat atau mengakses obrolan maupun data internal Brand $A$.
- **Otorisasi Super User:** Super User wajib memiliki tiket permohonan akses (*Incident Ticket*) yang disetujui Owner sebelum dapat menginspeksi data.

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
🏢 Holding / Tenant Level (PT Multi Industri Nusantara)
 ├── 🏷️ Brand A: Kopi Nusantara Roastery (F&B)
 │    ├── 📍 Outlet Grand Indonesia [Gudang Utama Barista GI]
 │    └── 📍 Outlet Senopati [Gudang Outlet Senopati]
 ├── 🏷️ Brand B: Nusantara Retail Mart (Retail Supermarket)
 │    └── 📍 Store Kelapa Gading
 └── 🏷️ Brand C: Logistik Cepat Mandiri (Jasa Ekspedisi)
```

---

## 🛠️ Stack Teknologi

- **Frontend:** React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4
- **Tipografi:** Google Font Ubuntu & Ubuntu Mono
- **Audio:** Web Audio API Frequency Synthesizer (100% Offline, Zero Asset Latency)
- **State Management:** Zustand dengan `persist` middleware
- **Backend API:** Ruby 3.2 / Sinatra / Rails API
- **Database Engine:** MySQL 8.0 & MariaDB Compatible
- **Authentication:** JWT + OAuth 2.0 (Google, GitHub, Apple, Microsoft)
- **API Documentation:** OpenAPI 3.0 / Swagger Interactive Console

---

## 🏃 Cara Menjalankan Aplikasi

### 1. Jalankan Backend API (Ruby / Rails):
```bash
# Masuk ke direktori backend
cd apps/backend

# Jalankan server API di port 3001
ruby server.rb
```

### 2. Jalankan Frontend (React / Vite):
```bash
# Masuk ke direktori frontend
cd apps/frontend

# Install dependencies & build
npm install
npm run build

# Jalankan server development di port 3000
npm run dev
```

Akses portal aplikasi di:
- **Modula Core:** `http://localhost:3000/`
- **Customer Guest Review Portal:** `http://localhost:3000/review`
- **Swagger API Docs:** Akses modul Dokumentasi / Swagger di sidebar aplikasi.

---

## 📋 Riwayat Changelog Modula

- **v2.3.0:** OAuth 2.0 (Google, GitHub, Apple, Microsoft SSO), update dokumentasi README komprehensif, dan verifikasi CI/CD build.
- **v2.2.0:** Pilihan 5 Gaya Tampilan Cart (`🎨`), Manajemen Meja & Hold Bill Multi-Konsumen (`[F8]`), Sidebar Auto-Hide Collapsible ala Gemini/ChatGPT, Grafik Garis Keuangan Standar, dan Silent Cart Mode.
- **v2.0.0:** Web Audio API WA "Ceting" Synthesizer, Open/Close Shift dengan deteksi keterlambatan realtime ke Dashboard Owner, Brand Team Chat dengan isolasi multi-tenant, dan Tiketing Insiden Super User.
- **v1.5.0:** Split Bill 3 Mode (Manual Input), Diskon & Pajak Fleksibel (`%` vs `Rp`), Gudang SCM dengan upload faktur PDF/Foto, Barter antar gudang, dan Export CRM Laporan Cabang (CSV).
- **v1.0.0:** Inisialisasi Inti ERP POS Modular, Buku Besar PSAK, Multi-Tenant Holding, dan Swagger OpenAPI 3.0.

---
*Dikembangkan dengan standar arsitektur enterprise oleh **parikesitad-pm**.*
