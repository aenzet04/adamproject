import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuditActionType =
  | 'STOCK_INBOUND_CREATED'
  | 'STOCK_OPNAME_ADJUSTED'
  | 'STOCK_INTER_BRANCH_TRANSFER'
  | 'STAFF_BRANCH_TRANSFERRED'
  | 'CASHIER_SHIFT_OPENED'
  | 'CASHIER_SHIFT_CLOSED'
  | 'POS_TRANSACTION_PROCESSED'
  | 'PRICE_MODIFIED'
  | 'BRAND_ONBOARDING_COMPLETED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditActionType;
  actionTitle: string;
  module: 'POS' | 'INVENTORY' | 'STAFF' | 'FINANCE' | 'ONBOARDING';
  branchId?: string;
  branchName?: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

interface AuditLogState {
  logs: AuditLogEntry[];
  addLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>) => void;
  clearLogs: () => void;
}

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set, get) => ({
      logs: [
        {
          id: 'log-001',
          timestamp: '2026-08-31 23:35:10',
          actorId: 'usr-01',
          actorName: 'Parikesit (Owner)',
          actorRole: 'owner',
          action: 'BRAND_ONBOARDING_COMPLETED',
          actionTitle: 'Setup Brand Baru & Multi-Cabang',
          module: 'ONBOARDING',
          branchName: 'Headquarters',
          details: 'Inisialisasi profil Kopi Nusantara Roastery & 3 outlet cabang.',
          ipAddress: '127.0.0.1 (Local Verified)',
          severity: 'INFO',
        },
        {
          id: 'log-002',
          timestamp: '2026-08-31 22:45:00',
          actorId: 'usr-04',
          actorName: 'Hendra Saputra',
          actorRole: 'warehouse_staff',
          action: 'STOCK_OPNAME_ADJUSTED',
          actionTitle: 'Penyesuaian Fisik Stok Opname',
          module: 'INVENTORY',
          branchName: 'Outlet Grand Indonesia',
          details: 'Audit fisik 8 item di WH-GI-MAIN dengan selisih Rp -88.000.',
          ipAddress: '192.168.1.42 (Internal SCM)',
          severity: 'WARNING',
        },
        {
          id: 'log-003',
          timestamp: '2026-08-31 21:10:20',
          actorId: 'usr-02',
          actorName: 'Bambang Supriyadi',
          actorRole: 'branch_manager',
          action: 'STAFF_BRANCH_TRANSFERRED',
          actionTitle: 'Mutasi Staf Antar Cabang',
          module: 'STAFF',
          branchName: 'Outlet Senopati',
          details: 'Mutasi Kasir Sarah Amanda dari GI-01 ke SNP-02 disetujui.',
          ipAddress: '192.168.1.15',
          severity: 'INFO',
        },
      ],

      addLog: (entry) => {
        const newLog: AuditLogEntry = {
          ...entry,
          id: `log-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ipAddress: '127.0.0.1 (Internal Modula Core)',
        };
        set((state) => ({
          logs: [newLog, ...state.logs.slice(0, 99)],
        }));
      },

      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'modula_audit_logs_store',
    }
  )
);
