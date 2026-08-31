import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventoryStore } from './useInventoryStore';

export type OpnameReason =
  | 'SESUAI'
  | 'RUSAK'
  | 'KADALUARSA'
  | 'TUMPAH_BOCOR'
  | 'SELISIH_HITUNG'
  | 'SAMPLE_TESTING'
  | 'HILANG_SHRINKAGE';

export interface OpnameItem {
  productId: string;
  productName: string;
  sku: string;
  uom: string;
  systemStock: number;
  physicalStock: number;
  variance: number; // physical - system
  unitCost: number;
  varianceValue: number; // variance * unitCost
  reason: OpnameReason;
  notes?: string;
}

export interface StockOpnameSession {
  id: string;
  sessionNumber: string;
  warehouseId: string;
  warehouseName: string;
  auditorName: string;
  auditorRole: string;
  status: 'DRAFT' | 'COMPLETED_ADJUSTED';
  opnameDate: string;
  totalSystemItems: number;
  totalVarianceItems: number;
  totalVarianceValue: number;
  items: OpnameItem[];
  notes?: string;
}

interface StockOpnameState {
  sessions: StockOpnameSession[];
  createSession: (
    warehouseId: string,
    warehouseName: string,
    auditorName: string,
    auditorRole: string,
    notes?: string
  ) => StockOpnameSession;
  updateSessionItem: (
    sessionId: string,
    productId: string,
    physicalStock: number,
    reason: OpnameReason,
    notes?: string
  ) => void;
  finalizeAndApplyAdjustment: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
}

const INITIAL_SESSIONS: StockOpnameSession[] = [
  {
    id: 'opn-01',
    sessionNumber: 'OPN-GI-20260831-01',
    warehouseId: 'wh-01',
    warehouseName: 'Gudang Utama Barista GI',
    auditorName: 'Hendra Saputra',
    auditorRole: 'Staf Gudang & SCM',
    status: 'COMPLETED_ADJUSTED',
    opnameDate: '2026-08-31',
    totalSystemItems: 7,
    totalVarianceItems: 2,
    totalVarianceValue: -45000,
    notes: 'Opname akhir bulan Agustus, penyesuaian biji kopi tumpah saat kalibrasi mesin',
    items: [
      {
        productId: 'prod-001',
        productName: 'Espresso Single Origin Gayo',
        sku: 'BEV-ESP-01',
        uom: 'CUP',
        systemStock: 145,
        physicalStock: 145,
        variance: 0,
        unitCost: 8500,
        varianceValue: 0,
        reason: 'SESUAI',
      },
      {
        productId: 'prod-012',
        productName: 'Roasted Beans Aceh Gayo 250g',
        sku: 'RET-RBG-12',
        uom: 'BAG',
        systemStock: 36,
        physicalStock: 35,
        variance: -1,
        unitCost: 45000,
        varianceValue: -45000,
        reason: 'SAMPLE_TESTING',
        notes: '1 bag dipakai untuk cupping & uji aroma barista',
      },
    ],
  },
];

export const useStockOpnameStore = create<StockOpnameState>()(
  persist(
    (set, get) => ({
      sessions: INITIAL_SESSIONS,

      createSession: (warehouseId, warehouseName, auditorName, auditorRole, notes) => {
        const inventoryProducts = useInventoryStore.getState().products;

        const items: OpnameItem[] = inventoryProducts.map((p) => ({
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          uom: p.uom,
          systemStock: p.stockOnHand,
          physicalStock: p.stockOnHand, // default same as system
          variance: 0,
          unitCost: p.standardCost,
          varianceValue: 0,
          reason: 'SESUAI',
        }));

        const newSession: StockOpnameSession = {
          id: `opn-${Date.now().toString().slice(-6)}`,
          sessionNumber: `OPN-${warehouseName.replace(/\s+/g, '-').slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          warehouseId,
          warehouseName,
          auditorName,
          auditorRole,
          status: 'DRAFT',
          opnameDate: new Date().toISOString().split('T')[0],
          totalSystemItems: items.length,
          totalVarianceItems: 0,
          totalVarianceValue: 0,
          items,
          notes,
        };

        set({ sessions: [newSession, ...get().sessions] });
        return newSession;
      },

      updateSessionItem: (sessionId, productId, physicalStock, reason, notes) => {
        set({
          sessions: get().sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;

            const updatedItems = sess.items.map((it) => {
              if (it.productId !== productId) return it;
              const variance = physicalStock - it.systemStock;
              const varianceValue = variance * it.unitCost;
              return {
                ...it,
                physicalStock,
                variance,
                varianceValue,
                reason,
                notes,
              };
            });

            const varianceCount = updatedItems.filter((i) => i.variance !== 0).length;
            const varianceValSum = updatedItems.reduce((s, i) => s + i.varianceValue, 0);

            return {
              ...sess,
              items: updatedItems,
              totalVarianceItems: varianceCount,
              totalVarianceValue: varianceValSum,
            };
          }),
        });
      },

      finalizeAndApplyAdjustment: (sessionId) => {
        const sess = get().sessions.find((s) => s.id === sessionId);
        if (!sess) return;

        // Apply physical stock to inventory store products
        const inventoryProducts = useInventoryStore.getState().products;
        const updatedProducts = inventoryProducts.map((p) => {
          const matched = sess.items.find((it) => it.productId === p.id);
          if (matched) {
            return {
              ...p,
              stockOnHand: matched.physicalStock,
            };
          }
          return p;
        });

        useInventoryStore.setState({ products: updatedProducts });

        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? { ...s, status: 'COMPLETED_ADJUSTED' } : s
          ),
        });
      },

      deleteSession: (sessionId) => {
        set({ sessions: get().sessions.filter((s) => s.id !== sessionId) });
      },
    }),
    {
      name: 'modula_stock_opname_store',
    }
  )
);
