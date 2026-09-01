# 👑 MODULA v3.1.0-enterprise — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-v3.1.0--enterprise-purple.svg)]()
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

## 🚀 Changelog Versi Terbaru: Modula v3.1.0-enterprise (Release Sprint)

### 🛡️ 1. Zero-Knowledge Privacy Protocol & Etika Bisnis Super User
- **Isolasi Privasi Ketat:** Super User / Platform Developer **tidak dapat mengintip data internal transaksi POS, laporan laba rugi, maupun obrolan internal cabang** milik Brand secara sepihak.
- **Audit Inspection Ticket Gateway (`#TCK-XXXXXX`):** Super User wajib mengajukan tiket permohonan audit resmi kepada Owner/GM dan harus disetujui terlebih dahulu sebelum inspeksi diagnostik diizinkan aktif.

### 🐷 2. Enterprise Emoji & Reaction Suite (Babi Hoki, Gen Z & Lansia Friendly)
- **Koleksi Emoji Lengkap dengan Glosarium Korporat:**
  - 🐷 **Babi Hoki & Swine Synergy:** `🐷` *(Swine Optimization - Simbol Pembawa Cuan)*, `🥓` *(Bacon ROI - Margin Gurih)*, `🐖` *(Babi Gesit SCM)*, `🐽` *(Snout Margin)*, `🐗` *(Ekspansi Brutal)*.
  - ⚡ **Gen Z Core:** `💀` *(Dead/Ketar-Ketir Target Q3)*, `🗿` *(Sigma Disiplin PSAK)*, `🔥` *(Menyala Abangkuh - Rekor Sales)*, `💅` *(Slay Budgeting)*, `🧢` *(No Cap - Data Riil)*, `🤡` *(Clown Costing)*, `✨` *(Aesthetic Synergy)*.
  - 👴 **Lansia & Restu Holding:** `🙏` *(Matur Nuwun / Berkah)*, `☕` *(Ngopi Santai)*, `👴` *(Sesepuh Holding)*, `👵` *(Petuah Eyang)*, `👍` *(Jempol Bapak-Bapak ACC Cair)*.
  - 📈 **Corporate Synergy:** `🚀` *(To The Moon)*, `💼` *(Actionable Roadmap)*, `💸` *(Cuan Maksimal)*, `📊` *(Pivot Matrix)*.
- **Interactive Reactions:** Reaksi cepat pada tiap balon pesan chat dengan counter suara interaktif.

### ⚡ 3. Live Hardware Stress Benchmark Suite
- Penambahan mesin stress testing di modul Benchmark (`BenchmarkViewer.tsx`):
  - 100,000 Payload JSON loop test (< 1 ms).
  - 1,000,000 kalkulasi arithmetic BigInt/Float per detik (> 120,000 Ops/s).
  - Verifikasi DOM reflow 60 FPS tanpa frame drop dengan predikat **A+ ENTERPRISE GRADE**.

### 💬 4. Executive Direct Messaging (1-on-1 DM) & Happening Now Live Beacon
- **Direct 1-on-1 Chat:** Owner & General Manager dapat mengklik profil karyawan di sidebar chat untuk memulai percakapan pribadi langsung (*Personal DM*).
- **Happening Now Live Beacon:** Banner siaran langsung di bagian atas ruang chat yang dapat di-update oleh Owner/GM untuk mengumumkan promo kilat atau status operasional penting ke seluruh staf.

### 👑 5. Super User Platform Director Suite
- **Manajemen Akun Owner & Holding:** Direktori multi-owner (*PT, CV, Perorangan*), total brand & cabang, serta status aktif.
- **Granular Per-Brand Module Licensing:** Buka/kunci modul (*POS, Akuntansi GL, Gudang SCM, Stok Opname, CRM, Chat*) per brand secara independen.
- **Pelacak Sisa Masa Aktif SaaS (Subscription Expiry Tracker):**
  - Pemantauan masa aktif & hitung mundur jatuh tempo (*Warning < 30 Hari*).
  - Tombol 1-klik perpanjangan langganan `+12 Bulan` dan broadcast notifikasi tagihan via WhatsApp / Mailpit.
- **Semantic Versioning & Health Monitor:** Riwayat rilis semantik GitHub dan pelacak status backend Ruby (Port 3001) & Mailpit (Port 8025).

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
