# 👑 MODULA v2.4.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

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

## 🚀 Changelog Versi Terbaru: Modula v2.4.0

### 👥 1. Struktur Karyawan Brand & Mutasi Penugasan Antar Cabang
- **Hierarki Peran Karyawan 1 Brand:**
  1. 👑 **Owner Brand & CEO Group**
  2. 👔 **General Manager Operasional**
  3. 🏢 **Manajer Cabang (Branch Manager)**
  4. 💻 **Admin IT & Sistem POS**
  5. 🛒 **Senior Cashier / Frontliner POS**
  6. ☕ **Staf Barista / Kitchen Cook / Gudang**
- **Fitur Mutasi Cabang Instan (Inter-Branch Reassignment):**
  - Karyawan di Cabang A dapat dipindahkan dinas ke Cabang B (atau sebaliknya) secara instan dengan alasan mutasi dan approval.
  - **Efek Otomatis:** Sistem POS Terminal dan presensi di cabang tujuan langsung otomatis membaca dan mengenali karyawan tersebut aktif di cabang baru tanpa perlu buat akun ulang.
  - Pencatatan log riwayat mutasi dinas secara permanen.

### 📥 2. Desain Baru Menu Tambah Stok & Barang (3 Opsi Fleksibel ala Olsera & Moka)
1. **⚡ Opsi 1: Tambah Stok Cepat dari Katalog Produk yang Sudah Ada:**  
   Pilih barang dari katalog $\rightarrow$ input jumlah restock, HPP beli, vendor, gudang cabang, no faktur & upload bukti PDF/foto fisik.
2. **🥐 Opsi 2: Buat Barang Baru Mulai dari Kategori (Category-First Flow ala Olsera):**  
   - **Langkah 1:** Pilih atau buat kategori baru (Kopi, Makanan, Minuman, Merchandise, Bahan Baku).
   - **Langkah 2:** Isi detail nama, SKU, Barcode otomatis, UOM, harga jual, HPP standar, dan kalkulasi margin laba otomatis.
   - **Langkah 3:** Input stok awal & alokasikan ke gudang cabang langsung.
3. **📋 Opsi 3: Restock Masal Multi-Item (Batch Inbound 1 Faktur Supplier):**  
   Pemasukan puluhan item sekaligus dalam 1 nota/surat jalan supplier dengan total nilai pembelian terkonsolidasi.

### ⭐ 3. Manajemen Detail Lengkap CRM Konsumen di Seluruh Dashboard
- Profil member terintegrasi di Dashboard Owner, Brand Admin, POS Terminal, dan CRM:
  - Tier loyalitas (*Bronze, Silver, Gold, Platinum, VIP*), total poin belanja, riwayat transaksi, dan nomor WhatsApp.
  - Tombol 1-klik kirim pesan WhatsApp & cetak ringkasan loyalty.

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
