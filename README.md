# 👑 MODULA v2.2.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)]()
[![Ruby](https://img.shields.io/badge/Backend-Ruby%203.2%20%2F%20Rails-red.svg)]()
[![Database](https://img.shields.io/badge/Database-MySQL%208%20%2F%20MariaDB-orange.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **Modula** adalah platform ERP, Point of Sale (POS), Manajemen Gudang SCM, dan Inti Akuntansi Buku Besar PSAK multi-tenant tingkat enterprise. Dirancang untuk grup holding, multi-brand, multi-cabang, dan multi-gudang dengan isolasi data yang sangat ketat dan performa tinggi.

---

## 👨‍💻 Identitas Pembuat & Tim Pengembang
- **Lead Creator & Software Architect:** [parikesitad-pm](https://github.com/parikesitad-pm)
- **Collaborator & Target Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 🚀 Changelog Versi Terbaru: Modula v2.2.0

### 🎨 1. Pilihan Beragam Gaya & Layout Tampilan Keranjang (Cart Display Modes)
Tersedia 5 gaya tampilan keranjang yang dapat diganti sewaktu-waktu melalui tombol `🎨`:
1. **Modern Sleek Cards:** Kartu modern dengan kontrol kuantitas dan input catatan preferensi dapur individual.
2. **Compact Table List (Supermarket / Retail Mode):** Baris tabel berdensitas tinggi untuk kecepatan input kasir minimarket.
3. **Visual Thumbnail Grid:** Kotak media visual dengan tombol sentuh kuantitas cepat.
4. **Kitchen / Barista KDS Ticket View:** Menonjolkan catatan resep dapur (*Less sugar, extra hot, no ice, dsb*).
5. **Detailed Accounting & Tax Breakdown:** Menampilkan breakdown SKU, harga satuan, PPN/PB1, dan estimasi margin laba kotor item.

### 🍽️ 2. Manajemen Table & Hold Bill Multi-Konsumen (`[F8]`)
- Simpan transaksi pesanan aktif per nomor meja & nama pelanggan secara terpisah.
- Kasir dapat beralih antar meja aktif (*Switch/Resume Table*), menambah item pesanan, atau langsung menyelesaikan pembayaran.
- Keranjang kasir langsung bersih setelah pesanan di-hold, siap melayani tamu berikutnya tanpa risiko data tertukar.

### 📁 3. Sidebar Auto-Hide / Collapsible Ala Gemini & ChatGPT
- Toggle collapse/expand sidebar (`w-16` vs `w-64`) untuk memaksimalkan area kerja kasir dan laporan keuangan (*full-width workspace*).

### 📈 4. Grafik Garis Standar Laporan Keuangan
- Grafik garis pendapatan bersih dengan interactive hover tooltip, filter harian/mingguan/bulanan/tahunan, dan ringkasan tren omzet.

### 🔇 5. Suara Cart Dinonaktifkan (Silent Mode)
- Menghilangkan suara saat kasir menambahkan menu ke cart agar tidak mengganggu/risih, sementara suara notifikasi tetap aktif untuk pembayaran berhasil, chat tim, dan alert shift.

---

## 🛠️ Stack Teknologi

- **Frontend:** React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4
- **Tipografi:** Google Font Ubuntu & Ubuntu Mono
- **Audio:** Web Audio API Frequency Synthesizer
- **State Management:** Zustand dengan `persist` middleware
- **Backend API:** Ruby 3.2 / Sinatra / Rails API
- **Database Engine:** MySQL 8.0 & MariaDB Compatible
- **API Documentation:** OpenAPI 3.0 / Swagger Interactive Console

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
