import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from './useToastStore';

export interface ShiftRecord {
  id: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  branchName: string;
  scheduledTime: string; // e.g. "08:00"
  openedAt: string;
  openingCash: number;
  isLate: boolean;
  lateMinutes: number;
  closedAt?: string;
  totalSalesCash?: number;
  totalSalesNonCash?: number;
  totalSalesTotal?: number;
  expectedCashInDrawer?: number;
  actualCashCounted?: number;
  discrepancy?: number;
  notes?: string;
  status: 'OPEN' | 'CLOSED';
}

export interface OwnerRealtimeAlert {
  id: string;
  type: 'SHIFT_OPEN' | 'SHIFT_LATE' | 'SHIFT_CLOSE' | 'LOW_STOCK' | 'REFUND_ALERT';
  title: string;
  message: string;
  branchName: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  isRead: boolean;
}

const INITIAL_ALERTS: OwnerRealtimeAlert[] = [
  {
    id: 'alt-01',
    type: 'SHIFT_LATE',
    title: '⚠️ Keterlambatan Masuk Shift (18 Menit)',
    message: 'Budi Santoso membuka shift pagi pukul 08:18 WIB (Jadwal: 08:00 WIB). Modal kasir awal Rp 500.000.',
    branchName: 'Outlet Senopati',
    severity: 'warning',
    timestamp: '2026-09-01T01:18:00Z',
    isRead: false,
  },
  {
    id: 'alt-02',
    type: 'LOW_STOCK',
    title: '🚨 Peringatan Stok Sisa Menipis',
    message: 'Roasted Beans Aceh Gayo 250g tersisa 4 unit di Gudang Utama GI (Batas aman: 10 unit). Segera buat pesanan ke Roastery.',
    branchName: 'Outlet Grand Indonesia',
    severity: 'critical',
    timestamp: '2026-09-01T03:45:00Z',
    isRead: false,
  },
  {
    id: 'alt-03',
    type: 'SHIFT_OPEN',
    title: '🟢 Buka Shift Kasir Pagi',
    message: 'Siti Rahma membuka shift tepat waktu pukul 07:55 WIB dengan modal kas awal Rp 500.000.',
    branchName: 'Outlet Grand Indonesia',
    severity: 'success',
    timestamp: '2026-09-01T00:55:00Z',
    isRead: false,
  },
];

interface ShiftState {
  currentShift: ShiftRecord | null;
  shiftHistory: ShiftRecord[];
  alerts: OwnerRealtimeAlert[];
  isShiftOpen: boolean;

  openShift: (params: {
    cashierId: string;
    cashierName: string;
    branchId: string;
    branchName: string;
    openingCash: number;
    scheduledTime?: string;
  }) => ShiftRecord;

  closeShift: (params: {
    actualCashCounted: number;
    notes?: string;
  }) => ShiftRecord;

  addAlert: (alert: Omit<OwnerRealtimeAlert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAlertsAsRead: () => void;
}

export const useShiftStore = create<ShiftState>()(
  persist(
    (set, get) => ({
      currentShift: {
        id: 'shf-01',
        cashierId: 'usr-cashier-01',
        cashierName: 'Siti Rahma',
        branchId: 'br-01',
        branchName: 'Outlet Grand Indonesia',
        scheduledTime: '08:00',
        openedAt: '2026-09-01T07:55:00Z',
        openingCash: 500000,
        isLate: false,
        lateMinutes: 0,
        status: 'OPEN',
      },
      shiftHistory: [],
      alerts: INITIAL_ALERTS,
      isShiftOpen: true,

      openShift: ({ cashierId, cashierName, branchId, branchName, openingCash, scheduledTime = '08:00' }) => {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMins = now.getMinutes();

        const [schedHours, schedMins] = scheduledTime.split(':').map((s) => parseInt(s, 10));
        const diffMinutes = currentHours * 60 + currentMins - (schedHours * 60 + schedMins);

        const isLate = diffMinutes > 5;
        const lateMinutes = Math.max(0, diffMinutes);

        const newShift: ShiftRecord = {
          id: `shf-${Date.now().toString().slice(-6)}`,
          cashierId,
          cashierName,
          branchId,
          branchName,
          scheduledTime,
          openedAt: now.toISOString(),
          openingCash,
          isLate,
          lateMinutes,
          status: 'OPEN',
        };

        // Create Realtime Alert for Owner
        const alert: OwnerRealtimeAlert = {
          id: `alt-${Date.now().toString().slice(-6)}`,
          type: isLate ? 'SHIFT_LATE' : 'SHIFT_OPEN',
          title: isLate
            ? `⚠️ Keterlambatan Masuk Shift (${lateMinutes} Menit)`
            : `🟢 Kasir Buka Shift Tepat Waktu`,
          message: `${cashierName} membuka shift kasir di ${branchName} dengan modal kas awal Rp ${openingCash.toLocaleString('id-ID')}.${
            isLate ? ` Terlambat ${lateMinutes} menit dari jadwal (${scheduledTime}).` : ''
          }`,
          branchName,
          severity: isLate ? 'warning' : 'success',
          timestamp: now.toISOString(),
          isRead: false,
        };

        set({
          currentShift: newShift,
          isShiftOpen: true,
          alerts: [alert, ...get().alerts],
        });

        toast.success(
          'Shift Kasir Berhasil Dibuka',
          `Modal Kasir Rp ${openingCash.toLocaleString('id-ID')}${isLate ? ` • Telat ${lateMinutes} mnt` : ''}`
        );

        return newShift;
      },

      closeShift: ({ actualCashCounted, notes }) => {
        const cur = get().currentShift;
        if (!cur) throw new Error('Tidak ada shift aktif.');

        const now = new Date();
        const totalSalesCash = 3450000;
        const totalSalesNonCash = 4200000;
        const totalSalesTotal = totalSalesCash + totalSalesNonCash;
        const expectedCashInDrawer = cur.openingCash + totalSalesCash;
        const discrepancy = actualCashCounted - expectedCashInDrawer;

        const closedShift: ShiftRecord = {
          ...cur,
          closedAt: now.toISOString(),
          totalSalesCash,
          totalSalesNonCash,
          totalSalesTotal,
          expectedCashInDrawer,
          actualCashCounted,
          discrepancy,
          notes,
          status: 'CLOSED',
        };

        // Create Alert for Owner
        const alert: OwnerRealtimeAlert = {
          id: `alt-${Date.now().toString().slice(-6)}`,
          type: 'SHIFT_CLOSE',
          title: '📋 Rekonsiliasi Tutup Shift Kasir',
          message: `${cur.cashierName} (${cur.branchName}) menutup shift. Total Omzet: Rp ${totalSalesTotal.toLocaleString(
            'id-ID'
          )}. Kas Fisik: Rp ${actualCashCounted.toLocaleString('id-ID')} (${
            discrepancy === 0
              ? '✅ SEIMBANG/MATCH'
              : discrepancy > 0
              ? `Lebih Rp ${discrepancy.toLocaleString('id-ID')}`
              : `⚠️ Kurang Rp ${Math.abs(discrepancy).toLocaleString('id-ID')}`
          }).`,
          branchName: cur.branchName,
          severity: discrepancy === 0 ? 'info' : 'warning',
          timestamp: now.toISOString(),
          isRead: false,
        };

        set({
          currentShift: null,
          isShiftOpen: false,
          shiftHistory: [closedShift, ...get().shiftHistory],
          alerts: [alert, ...get().alerts],
        });

        toast.info(
          'Shift Ditutup',
          `Kas Fisik Rp ${actualCashCounted.toLocaleString('id-ID')} • Selisih: Rp ${discrepancy.toLocaleString('id-ID')}`
        );

        return closedShift;
      },

      addAlert: (alertData) => {
        const newAlert: OwnerRealtimeAlert = {
          ...alertData,
          id: `alt-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        set({ alerts: [newAlert, ...get().alerts] });
      },

      markAlertsAsRead: () => {
        set({
          alerts: get().alerts.map((a) => ({ ...a, isRead: true })),
        });
      },
    }),
    {
      name: 'modula_shifts_and_alerts_store',
    }
  )
);
