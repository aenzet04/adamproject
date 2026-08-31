# 👑 MODULA v2.0.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)]()
[![Ruby](https://img.shields.io/badge/Backend-Ruby%203.2%20%2F%20Rails-red.svg)]()
[![Database](https://img.shields.io/badge/Database-MySQL%208%20%2F%20MariaDB-orange.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **Modula** adalah platform ERP, Point of Sale (POS), Manajemen Gudang SCM, dan Inti Akuntansi Buku Besar PSAK multi-tenant tingkat enterprise. Dirancang untuk skalabilitas grup holding, multi-brand, multi-cabang, dan multi-gudang dengan isolasi data yang sangat ketat dan performa tinggi.

---

## 👨‍💻 Identitas Pembuat & Tim Pengembang
- **Lead Creator & Software Architect:** [parikesitad-pm](https://github.com/parikesitad-pm)
- **Collaborator & Target Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 🚀 Changelog Versi Terbaru: Modula v2.0.0

### 🔊 1. Web Audio API "Ceting" Notification (WhatsApp / Ping Chime)
- Menggunakan **Web Audio API Synthesizer** murni (zero download asset, zero latency, 100% offline).
- Setiap *action* (tambah keranjang, bayar, hold bill, pesan chat baru, keterlambatan shift) menghasilkan suara *chime/ping* yang renyah dan interaktif.

### ⏱️ 2. Open & Close Shift Kasir dengan Deteksi Keterlambatan Realtime
- **Open Shift:** Kasir menginput modal kas awal laci (*cash float*) dan jadwal masuk.
- **Deteksi Keterlambatan Masuk Shift:** Otomatis menghitung keterlambatan kasir (*e.g. Telat 18 menit*) dan langsung mengirimkan kartu peringatan (*Alert Card*) ke **Dashboard Owner**.
- **Close Shift & Rekonsiliasi Kas Fisik:** Rekonsiliasi otomatis kas fisik vs sistem dengan laporan selisih kas (*discrepancy*).

### 🔔 3. Real-Time Command & Notification Feed di Dashboard Owner
- Kartu alert *real-time* untuk Owner:
  1. *⚠️ Keterlambatan Masuk Shift Kasir*.
  2. *🚨 Peringatan Sisa Stok Menipis Gudang*.
  3. *🟢 Notifikasi Kasir Buka Shift Tepat Waktu*.
  4. *📋 Rekonsiliasi Tutup Shift & Omzet*.
- Tombol aksi 1-klik untuk langsung menghubungi kasir via WhatsApp atau membuat PO restock.

### 💬 4. Brand Team Chat & Isolasi Ketat Multi-Tenant
- **Internal Brand Team Chat:** Kasir ↔ Admin Brand ↔ Owner dalam 1 brand dapat berkoordinasi secara langsung.
- **Strict Multi-Tenant Isolation:** Brand $B$ tidak dapat melihat atau mengakses ruang chat maupun data internal milik Brand $A$.

### 🛡️ 5. Super User Ticket Authorization & Direct Owner Live Chat
- Super User **TIDAK DAPAT** menginspeksi data brand secara sembarangan tanpa adanya tiket permohonan akses aktif (*Escalated Incident Ticket*).
- Super User dan Owner memiliki ruang **Real-Time Live Chat khusus** di dalam tiket untuk mendiskusikan perbaikan bug dan verifikasi sistem.

### 📈 6. Grafik Saham Interaktif (Candlestick & Volume ala TradingView)
- Grafik Candlestick *Bullish/Bearish* lengkap dengan sumbu atas & bawah (*High/Low/Open/Close*), Moving Average MA(5), dan indikator Volume transaksi.
- Filter timeframe: `1D`, `1W`, `1M`, `3M`, `1Y`.

### ✂️ 7. Split Bill Manual Input Bebas
- Tidak terbatas 1-6 orang; kasir bebas mengetik jumlah orang secara manual (*e.g. 7, 15, 25 orang*) dengan perhitungan rata hingga nominal rupiah terkecil.

### 📱 8. 100% Mobile Responsive & Ergonomis
- Mobile navigation drawer, floating module switcher, dan split mobile tab (Katalog vs Keranjang) untuk kemudahan operasional satu jempol di layar HP.

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
- **Swagger API Console:** Akses modul Swagger di sidebar aplikasi.

---
*Dikembangkan dengan standar arsitektur enterprise oleh **parikesitad-pm**.*
