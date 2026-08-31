# 🏛️ Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core
> Modern Next-Gen Core Platform replacing Odoo / Accurate / Jurnal.

## 🏗️ Architecture Overview

- **Multi-Tenant Hierarchy:**
  - `Tenant` (Holding Group / Legal Entity)
  - `Brand` (Business Unit / Subsidiary)
  - `Branch` (Store / Outlet / Central Kitchen)
  - `Warehouse` (Multi-warehouse per branch)
- **Backend Stack:** Ruby on Rails 8 API + Modular Engines (`core_engine`, `pos_engine`, `inventory_engine`, `finance_engine`, `hr_engine`, `audit_engine`), Sidekiq, PostgreSQL.
- **Frontend Stack:** Next.js 15 (React 19), TypeScript, Tailwind CSS, Shadcn UI, Zustand, TanStack Query & TanStack Table v8.

## 📁 Monorepo Layout
```
adamProject/
├── apps/
│   ├── backend/                     # Rails 8 API Server
│   │   ├── app/
│   │   ├── config/
│   │   ├── db/migrate/              # Core Schema Migrations
│   │   └── engines/                 # Modular Isolation Engines
│   │       ├── core_engine/         # Tenancy, Auth & RBAC
│   │       ├── pos_engine/          # Offline/Online POS Checkout & Shifts
│   │       ├── inventory_engine/    # Multi-Warehouse & Realtime Moving Avg COGS
│   │       ├── finance_engine/      # PSAK/IFRS Double-Entry Auto Posting & General Ledger
│   │       ├── hr_engine/           # Geofence Attendance & Payroll Jurnal
│   │       └── audit_engine/        # Immutable Audit Trails & Anti-Fraud
│   └── frontend/                    # Next.js 15 / React 19 Client
│       └── src/
│           ├── app/                 # App Router & Multi-Tenant Switchers
│           ├── components/          # Shadcn UI & Data Tables
│           └── stores/              # Zustand Cart & Offline Queues
├── packages/
│   ├── types/                       # Shared TypeScript Interfaces
│   ├── ui/                          # Shared Design System
│   └── config/                      # ESLint, Prettier, Tailwind Presets
└── docker-compose.yml
```
