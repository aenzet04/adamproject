import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { bluetoothPrinter, type ReceiptPrintData } from '../lib/bluetoothPrinter';

interface PrinterState {
  autoPrintEnabled: boolean;
  connectedPrinterName: string | null;
  isConnecting: boolean;
  lastPrintStatus: string | null;
  toggleAutoPrint: () => void;
  connectPrinter: () => Promise<void>;
  disconnectPrinter: () => void;
  printReceipt: (data: ReceiptPrintData) => Promise<boolean>;
}

export const usePrinterStore = create<PrinterState>()(
  persist(
    (set, get) => ({
      autoPrintEnabled: true,
      connectedPrinterName: null,
      isConnecting: false,
      lastPrintStatus: null,

      toggleAutoPrint: () => {
        set((state) => ({ autoPrintEnabled: !state.autoPrintEnabled }));
      },

      connectPrinter: async () => {
        set({ isConnecting: true, lastPrintStatus: 'Menghubungkan ke Bluetooth Printer...' });
        try {
          const name = await bluetoothPrinter.connect();
          set({
            connectedPrinterName: name,
            isConnecting: false,
            lastPrintStatus: `Terhubung ke ${name}`,
          });
        } catch (err: any) {
          set({
            isConnecting: false,
            lastPrintStatus: `Gagal: ${err.message || 'Koneksi dibatalkan'}`,
          });
          throw err;
        }
      },

      disconnectPrinter: () => {
        bluetoothPrinter.disconnect();
        set({ connectedPrinterName: null, lastPrintStatus: 'Terputus' });
      },

      printReceipt: async (data: ReceiptPrintData) => {
        try {
          set({ lastPrintStatus: 'Mengirim data cetak via Bluetooth...' });
          await bluetoothPrinter.printReceipt(data);
          set({ lastPrintStatus: 'Berhasil dicetak ke Bluetooth 58mm' });
          return true;
        } catch (err: any) {
          console.warn('Bluetooth print error:', err);
          set({ lastPrintStatus: `Gagal cetak: ${err.message}` });
          return false;
        }
      },
    }),
    {
      name: 'adam_bluetooth_printer_config',
    }
  )
);
