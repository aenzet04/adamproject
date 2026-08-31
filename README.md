# 👑 MODULA v2.9.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)]()
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

## 🚀 Changelog Versi Terbaru: Modula v2.9.0 (Developer Sprint)

### ✂️ 1. Split Bill Single-Owner Default & CRM Multi-Million Customer Search Modal
- **Default Single-Owner:** Pada state awal split bill, hanya pemilik meja/pemesan utama yang dimuat (tidak ada nama konsumen dummy lain).
- **Scalable CRM Search Modal (`[ + Cari / Tambah Konsumen CRM ]`):** Menggantikan dropdown statis dengan modal pencarian cepat berindeks (mampu menangani jutaan baris pelanggan dengan pencarian nama, WhatsApp, tier, dan filter cabang).
- **Strict Per-Item Allocation Lock:** Jika suatu menu (*Item A*) telah diklaim oleh Konsumen 1, menu tersebut otomatis **`DISABLED / LINE-THROUGH`** pada baris Konsumen 2 dan seterusnya untuk mencegah alokasi ganda (*double-claim prevention*).

### 💳 2. Dual Payment Settlement dengan Mutual Exclusion Lock
- **Mutual Exclusion:** Saat pembayaran pertama dipilih (misal `Cash`), opsi `Cash` pada alokasi berikutnya otomatis dinonaktifkan (*disabled*) sehingga kasir wajib memilih metode sekunder (`QRIS`, `EDC BCA`, `Transfer Bank`, dll).
- **Preset Dual Split Instan:** Tombol cepat `[ ⚡ Dual: 50% Tunai + 50% QRIS ]` dan `[ ⚡ Dual: 50% Tunai + 50% EDC BCA ]`.

### 🛵 3. Saluran Penjualan (Order Channels) & Printout Matrix
- Pilihan channel penjualan: **`Dine In`**, **`Take Away`**, **`GrabFood`**, **`GoFood`**, **`ShopeeFood`**, dan **`Maxim`**.
- Label channel tercetak otomatis pada struk thermal fisik ESC/POS dan tiket pesanan dapur/barista `[DINE IN]`, `[GRABFOOD]`, `[GOFOOD]`.
- Tersimpan di payload checkout untuk analisis segmentasi pasar per channel.

### 🛡️ 4. Strict Role-Based Access Control (RBAC) & Immutable Audit Log Trail
- **Isolasi Izin Hak Akses:**
  - **Kasir (Cashier):** Read-only pada data gudang & tidak dapat mengubah stok persediaan.
  - **Staf IT / Admin Sistem:** Mengelola infrastruktur sistem tanpa hak modifikasi stok fisik atau akses kasir POS.
  - **Staf Gudang (SCM):** Melihat klasifikasi *Fast Moving*, *Slow Moving*, dan *Dead Stock*, menambah vendor, mencatat barang masuk/keluar, dan mengajukan mutasi/tukar guling dengan izin manajer.
  - **Manajer Cabang:** Akses analitik terbatas pada cabangnya sendiri.
  - **Owner / GM:** Akses konsolidasi seluruh cabang, laporan PSAK, dan Pitch Deck Investor.
- **Sistem Audit Log (`AuditLogViewerModal`):** Pencatatan mutasi permanen dengan identitas aktor, IP address, severity level, dan modul terkait.

### 🔔 5. Realtime Notification Bell Popover & High-Contrast Error Alert Sound
- **Notification Bell Popover:** Header hanya menampilkan ikon lonceng dengan badge unread counter dan popover dropdown dengan opsi *Tandai Sudah Dibaca* dan *Bersihkan*.
- **High-Contrast Error Bubble:** Bubble notifikasi crimson dengan border merah tebal, box shadow menyala, dan synthesizer nada buzzer alarm Web Audio API bernada rendah.

### 🌱 6. Rails / Ruby Developer Seeder Engine
- Endpoint backend `POST /api/v1/dev/seed` dan script `apps/backend/db/seeds.rb` untuk pengetesan logic multi-tenant, CRM, produk, gudang, dan entri jurnal double-entry otomatis.

### ⚙️ 7. GitHub Actions CI/CD Pipeline
- File workflow `.github/workflows/ci.yml` mencakup:
  - TypeScript strict type checking (`tsc --noEmit`).
  - Production Vite bundle build.
  - Ruby backend API syntax validation.

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
- **Audio Synthesizer:** Web Audio API (Chime + Dual-Tone Error Buzzer)
- **CI/CD:** GitHub Actions CI Pipeline
- **Backend API:** Ruby 3.2 / Sinatra / Rails API (Port: `3001`)
- **Database Engine:** MySQL 8.0 & MariaDB Compatible

---

## 🏃 Cara Menjalankan Aplikasi

```bash
# 1. Jalankan Mailpit Email Server (Background)
mailpit &

# 2. Jalankan Backend Ruby API (Port 3001)
ruby apps/backend/server.rb &

# 3. Seed Data Dummy Pengetesan (Optional Developer Step)
curl -X POST http://localhost:3001/api/v1/dev/seed

# 4. Masuk ke direktori frontend & jalankan (Port 3000)
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
