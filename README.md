# 👑 MODULA — ENTERPRISE MODULAR ERP-POS & FINANCIAL CORE

> **Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core**  
> *Arsitektur Pengganti Next-Gen untuk Odoo, Accurate, dan Jurnal.id.*

---

## 👨‍💻 INFORMASI AUTHOR & KOLABORASI
- **Primary Creator & Software Architect:** [@parikesitad-pm](https://github.com/parikesitad-pm)
- **Repository Collaborator / Owner:** [@aenzet04](https://github.com/aenzet04)
- **GitHub Repository:** [https://github.com/aenzet04/adamproject.git](https://github.com/aenzet04/adamproject.git)
- **Status Rilis:** `v1.6.0 Enterprise Production Ready`

---

## 🌟 FITUR UTAMA SISTEM (ENTERPRISE GRADE)

1. **🔤 Tipografi Presisi: Google Font Ubuntu & Ubuntu Mono:**
   - Tipografi yang sangat nyaman dibaca, ramah di mata untuk kasir dan eksekutif dari semua umur.

2. **👥 CRM Member, Loyalitas, Poin & Top Spender:**
   - Master data member dengan auto-tiering (*Bronze, Silver, Gold, Platinum, VIP*).
   - Akumulasi poin belanja dan pengiriman saldo poin langsung via WhatsApp.
   - **Podium Top Spender (#1, #2, #3)** di Dashboard Owner dan Kasir.
   - Integrasi pencarian member instan pada Kasir POS, Hold Bill / Open Table, dan Split Bill.

3. **💎 Granular SaaS Add-on Licensing & Tier Subscription (Starter / Business / Enterprise):**
   - Super User dapat mengaktifkan / mengunci modul secara individual per tenant (ala Accurate & Jurnal.id).
   - **Tier Starter, Business, & Enterprise:** Pilihan paket fleksibel dengan indikator sisa masa aktif langganan.
   - **Enterprise White-Labeling:** Fitur kustom footer struk yang menghilangkan seluruh watermark Modula menjadi brand/slogan tenant sendiri.

4. **🚀 Page Transition Preloader & Hot Reloading:**
   - Animasi micro-progress bar di bagian atas layar saat transisi antar menu untuk pengalaman pengguna yang sangat cepat (*snappy & seamless*).

5. **🍳 Tiket Dapur vs Struk Konsumen (58mm ESC/POS):**
   - Pemisahan cetak pesanan dapur (lengkap dengan catatan khusus per item) dan struk resmi konsumen (dengan QR Code e-Invoice & WA Dispatcher).

6. **🎫 Pusat Tiketing Insiden & 3-Tier Soft-Delete Policy:**
   - Laporan kendala operasional dengan notifikasi real-time ke Owner & Super User.
   - Kebijakan *No Hard Delete* di lingkungan produksi.

---

## 🚀 PANDUAN MENJALANKAN LOKAL

### 1. Frontend (React 19 + Vite):
```bash
cd apps/frontend
npm install
npm run dev
# Server aktif di: http://localhost:3000/
# Portal Review Konsumen (Guest): http://localhost:3000/review
```

### 2. Backend API (Ruby on Rails 8 Engine):
```bash
cd apps/backend
ruby server.rb
# API aktif di: http://localhost:3001/
```

---
*© 2026 PT Multi Industri Nusantara. Engineered with ❤️ by parikesitad-pm & aenzet04.*
