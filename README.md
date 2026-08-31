# 👑 MODULA v2.8.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

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

## 🚀 Changelog Versi Terbaru: Modula v2.8.0

### 🖥️ 1. Slide Presentasi PowerPoint Interaktif untuk Investor (Pitch Deck & Financial Review)
- **Mode Presentasi Eksekutif / Investor Deck:**
  - Fitur slide presentasi layar penuh (*Fullscreen Interactive Slide Show*) yang disajikan khusus saat pitching ke investor atau meeting manajemen direksi.
  - **Daftar Slide:**
    1. 👑 **Slide 01: Executive Summary & Growth:** Valuasi brand Rp 18,5 M, Omset bulanan +28.4% MoM, Gross Margin 59.6%, dan Net EBITDA.
    2. 📈 **Slide 02: Laba Rugi (Profit & Loss Statement):** Breakdown penjualan, HPP bahan baku, OpEx, dan margin laba bersih 29.6%.
    3. ⚖️ **Slide 03: Neraca (Balance Sheet) & Asset Health:** Aset lancar kas bank Rp 890 Jt, persediaan, aset mesin espresso, dan rasio lancar 3.4x.
    4. 🏬 **Slide 04: Multi-Branch Unit Economics:** Performa produktivitas per outlet (*Grand Indonesia, Senopati, Kelapa Gading*).
    5. 🎯 **Slide 05: Expansion Roadmap & Investment:** Target ekspansi 15 cabang di Q4 2026 dan proyeksi omset 2027 Rp 12,8 Miliar.
  - **Kontrol Presentasi:** Keyboard navigation (`Arrow Left/Right`, `Space`, `Esc`), auto-play timer (6 detik), fullscreen toggle, direct **Export PDF Pitch Deck**, dan **Export Excel Proyeksi Finansial**.

### 📊 2. Fitur Export PDF & Excel di Seluruh Modul Sistem
- **Laporan Keuangan PSAK:** Export PDF resmi & Download Worksheet Excel Laba Rugi / Neraca.
- **CRM Konsumen & Top Spender:** Export PDF ringkasan loyalty member & Ekspor Excel data member lengkap per cabang / semua cabang.
- **Gudang SCM & Stok Opname:** Cetak Berita Acara Opname (PDF), Ekspor Lembar Kerja Audit Fisik Excel (.csv), dan Ekspor Katalog Persediaan.
- **Dokumentasi Sistem:** Export PDF Dokumentasi & Slide SOP Operasional.

### 📋 3. Menu Sidebar Stok Opname & Investor Slide Deck
- Menu **`📋 Stok Opname`** (*Audit Persediaan & Jurnal Penyesuaian Fisik*) dan pintasan **`🖥️ Investor Slide Deck`** (*Pitch Deck Eksekutif*) aktif di sidebar navigasi utama.

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
