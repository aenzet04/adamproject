# 👑 MODULA v2.6.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

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

## 🚀 Changelog Versi Terbaru: Modula v2.6.0

### 🛒 1. Login Kasir Cepat dengan ID/Username/Email & Kode Cabang (Branch Code)
- Kasir kini dapat masuk ke sistem POS tanpa form email panjang yang merepotkan:
  - **Input:** Kode Cabang (e.g. `GI-01` - Outlet Grand Indonesia, `SNP-02` - Outlet Senopati, `KG-01` - Store Kelapa Gading), ID Kasir / Username, dan PIN / Password.
  - **Otomatisasi:** Sistem langsung memvalidasi kode cabang dan mengarahkan kasir ke POS Terminal outlet tujuan dengan isolasi data yang tepat.

### 📩 2. Konfirmasi Registrasi Akun via Token Email Mailpit (Port 8025)
- Saat pengguna baru mendaftar akun:
  - Sistem menghasilkan kode token verifikasi 6-digit (OTP) dan mengirimkannya melalui **Mailpit Local SMTP Server** (Port `1025` / Web UI `8025`).
  - Web UI Mailpit otomatis terbuka di browser Chrome pada `http://localhost:8025/` untuk memeriksa email yang masuk secara instan dan tanpa spam.
  - Pengguna memasukkan kode token 6-digit untuk mengaktifkan akun.

### 🔒 3. Alur Lupa Kata Sandi (Forgot Password) dengan Token Reset
- Pengguna yang lupa kata sandi dapat memasukkan email $\rightarrow$ token reset OTP 6-digit terkirim ke Mailpit $\rightarrow$ masukkan token dan buat kata sandi baru yang aman.

### 📋 4. Stok Opname Fisik & Bukti Belanja Multi-Item
- Modul Stok Opname (`📋 Stok Opname`) untuk audit fisik persediaan, deteksi selisih (*variance: surplus/deficit*), dan jurnal penyesuaian otomatis.
- Riwayat belanja supplier multi-item dengan lampiran foto fisik unboxing & pratinjau PDF faktur resmi.

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

## 🏃 Cara Menjalankan Aplikasi & Mailpit

```bash
# 1. Jalankan Mailpit Email Server (Background)
mailpit &

# 2. Masuk ke direktori frontend & jalankan
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
