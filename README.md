# 👑 MODULA v2.5.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

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

## 🚀 Changelog Versi Terbaru: Modula v2.5.0

### 🧾 1. Riwayat Belanja Multi-Item & Bukti Faktur Supplier (Stok Terakhir Masuk)
- **Detail Rincian Pembelian Multi-Item:**
  - Setiap kali ada penambahan stok / pembelian dari vendor, kasir/staf gudang dapat membuka faktur tersebut untuk melihat:
    1. Waktu & tanggal belanja diterima.
    2. Rincian seluruh item dalam 1 faktur (*Nama barang, Qty masuk, Harga beli satuan, Subtotal*).
    3. Total nilai belanja faktur.
    4. Supplier & Gudang penerima.
    5. **Bukti Belanja:** Foto fisik barang saat unboxing & Pratinjau/Unduh Faktur PDF resmi.
- **Rekap Riwayat Belanja di Menu Vendor / Seller:**
  - Di direktori vendor, klik **`📋 Buka Riwayat Belanja`** untuk melihat daftar seluruh transaksi pembelian yang pernah dilakukan ke vendor tersebut.

### 📦 2. Peran Karyawan: Staf Gudang & SCM Supplier Lead
- Penambahan role karyawan baru dalam 1 brand: **`warehouse_staff` (Staf Gudang & SCM)** yang bertanggung jawab atas penerimaan barang supplier, pencatatan surat jalan, dan koordinasi stok cabang.

### 📋 3. Menu Sidebar Baru: Stok Opname Fisik Persediaan Gudang
- Penambahan modul dan menu sidebar **`📋 Stok Opname`**:
  - **Audit Fisik Berkala:** Input hitungan fisik aktual vs stok sistem di gudang cabang.
  - **Kalkulasi Selisih Otomatis (Variance):** Menghitung selisih unit (*surplus/deficit*) dan total nilai kerugian/kelebihan dalam rupiah.
  - **Tagging Alasan Selisih:** *Sesuai (Match), Rusak Fisik, Kedaluwarsa, Tumpah/Bocor, Selisih Hitung, Sample/Barista Testing, Hilang (Shrinkage)*.
  - **Penyesuaian Stok 1-Klik (*Apply Stock Adjustment*):** Otomatis menyesuaikan data stok persediaan utama dan mencetak Berita Acara Opname.

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

## 🛠️ Stack Teknologi

- **Frontend:** React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4
- **Tipografi:** Google Font Ubuntu & Ubuntu Mono
- **Audio:** Web Audio API Frequency Synthesizer (100% Offline)
- **State Management:** Zustand dengan `persist` middleware
- **Backend API:** Ruby 3.2 / Sinatra / Rails API
- **Database Engine:** MySQL 8.0 & MariaDB Compatible
- **Authentication:** JWT + OAuth 2.0 (Google, GitHub, Apple, Microsoft)

---

## 🏃 Cara Menjalankan Aplikasi

```bash
# 1. Masuk ke direktori frontend
cd apps/frontend

# 2. Install dependencies & build
npm install
npm run build

# 3. Jalankan server development
npm run dev
```

Akses portal aplikasi di:
- **Modula Core:** `http://localhost:3000/`
- **Customer Guest Review Portal:** `http://localhost:3000/review`

---
*Dikembangkan dengan standar arsitektur enterprise oleh **parikesitad-pm**.*
