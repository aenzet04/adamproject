# 👑 MODULA v3.0.0 — Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core

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

## 🚀 Changelog Versi Terbaru: Modula v3.0.0 (Team Collaboration & Chat Engine)

### 💬 1. Realtime Team Chat di Sidebar (Jendela Penuh Ala Telegram Web & WhatsApp Web)
- **Menu Sidebar Terdedikasi:** Menu `💬 Realtime Team Chat` aktif di sidebar navigasi utama dengan badge `LIVE` dan *pulsing indicator*.
- **Arsitektur 2 Saluran Komunikasi (Dual Channels):**
  1. 🏢 **Brand Headquarters Team Chat (All-Branch Team):** Saluran komunikasi terbuka untuk seluruh karyawan, manajer, dan owner dari seluruh cabang di bawah Brand aktif.
  2. 📍 **Branch Local Chat (Outlet Team):** Saluran komunikasi internal khusus karyawan yang bertugas di cabang yang sedang aktif (misal: *Outlet Grand Indonesia*), terisolasi dari cabang lain.
- **Fitur Lengkap Kolaborasi Tim:**
  - 📸 **Lampirkan Gambar & File Dokumen:** Pratinjau langsung di dalam balon percakapan dengan modal zoom.
  - 📌 **Sematkan Pesan (Pin Chat):** Header banner pengumuman penting / SOP yang tersemat di bagian atas ruangan obrolan.
  - 📊 **Polling Suara Interaktif (Live Voting):** Fitur membuat voting (misal: pemilihan menu seasonal / jadwal lembur) dengan bar persentase suara real-time.
  - 👤 **Mention Karyawan (@username):** Mengetik `@` memicu popup autocomplete daftar staf lengkap dengan foto profil, role badge, dan nama pengguna.
  - 🖼️ **Foto Profil & Role Badge:** Setiap bubble chat menampilkan avatar foto profil, nama staf, role (*Owner, GM, Kasir, Barista, Gudang*), dan waktu pengiriman WIB.

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
