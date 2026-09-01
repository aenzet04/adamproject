# 👑 MODULA v3.2.0-enterprise — Quick Start & Architecture Guide

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-v3.2.0--enterprise-purple.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![Ruby](https://img.shields.io/badge/Backend-Ruby%203.2%20%2F%20Rails-red.svg)]()
[![Mailpit](https://img.shields.io/badge/Email%20Testing-Mailpit%208025%2F1025-0284c7.svg)]()

> **Modula** adalah platform SaaS ERP, Kasir POS Super Cepat (< 1 ms), Manajemen Gudang SCM, dan Inti Akuntansi Buku Besar PSAK multi-tenant tingkat enterprise untuk grup holding dan multi-cabang.

---

## 👨‍💻 Tim Pengembang
- **Principal Software Architect & Lead Creator:** [parikesitad-pm](https://github.com/parikesitad-pm) (GitHub: `parikesitad-pm`)
- **Deployment Repository:** [aenzet04/adamproject](https://github.com/aenzet04/adamproject.git)

---

## 🚀 Panduan Cepat Menjalankan Sistem (Local Dev)

### 1. Jalankan Mailpit (Email Sandbox)
```bash
# Jalankan Mailpit dengan CORS diizinkan (atau gunakan proxy Ruby default)
mailpit --smtp-bind-addr 0.0.0.0:1025 --listen 0.0.0.0:8025
# Web UI Dashboard: http://localhost:8025/
# SMTP Server: localhost:1025
```

### 2. Jalankan Backend Ruby API (Port 3001)
```bash
cd apps/backend
bundle install
ruby server.rb
# API aktif di: http://localhost:3001
```

### 3. Jalankan Frontend React (Port 3000)
```bash
cd apps/frontend
npm install
npm run dev
# Buka di browser: http://localhost:3000
```

---

## 📬 Penjelasan Solusi Bug Mailpit CORS
> **Penyebab:** Mailpit memblokir direct browser request dari `localhost:3000` ke `localhost:8025/api/v1/send` karena proteksi built-in CORS (`[cors] blocking request from unauthorized origin: localhost:3000`).
>
> **Solusi:** Frontend kini mem-forward pengiriman email verifikasi dan reset password melalui **Backend Ruby API Proxy** di `POST http://localhost:3001/api/v1/auth/send_email`. Ruby kemudian mendispatch secara server-to-server ke Mailpit tanpa kendala CORS browser.

---

## 🔑 Kredensial Login & Akses Cepat

| Peran (Role) | Email Login | PIN Kasir | Akses Utama |
|---|---|---|---|
| **Super User** | `superuser@modula.id` | - | SaaS Director, License Management, Database Manager |
| **Owner Holding** | `owner@holding.id` | - | Executive Analytics, Investor Slide, Financial PSAK |
| **Admin Brand** | `admin@kopinusantara.id` | - | Manajemen Cabang, Edit Karyawan, Reset PIN |
| **Kasir Shift** | `kasir.gi@kopinusantara.id` | `0000` *(Wajib ganti)* | POS Terminal, Dual Payment, Split Bill |

---

## ⌨️ Shortcut Keyboard Kasir POS

| Shortcut | Aksi Cepat |
|---|---|
| `[F2]` | Fokus Kolom Cari Produk / Scan Barcode |
| `[F3]` | Modal Pencarian CRM & Registrasi Tamu Baru |
| `[F4]` | Modal Buka / Tutup Shift Kasir |
| `[F8]` | Manajemen Meja & Hold Bill Antar Pelanggan |
| `[F9]` | Buka Modal Pembayaran (Cash, QRIS, EDC BCA, Dual Payment) |

---

## 📊 Fitur Baru (Release v3.2.0-Enterprise)
- **Multi-Chart Suite:** Selector visualisasi tren penjualan (Line Trend, Bar Chart, Channel Pie, Kategori Donut, Tabular).
- **Public Legal & Info Pages:** Akses instan ke `/faq`, `/terms`, `/about` dan navigasi footer sidebar.
- **Skeleton & Page Reloader:** Loading shimmer sub-milidetik pada pergantian modul.
- **14-Day Warehouse Trial Mode:** Simulasi perpindahan barang tanpa mengganggu neraca keuangan riil.
- **Zero-Knowledge Privacy:** Isolasi data operasional cabang dari akses sepihak Super User.

---
© 2026 **Modula Enterprise**. Engineered by [parikesitad-pm](https://github.com/parikesitad-pm).
