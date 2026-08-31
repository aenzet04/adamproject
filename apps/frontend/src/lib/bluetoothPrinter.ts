/**
 * 🖨️ Bluetooth Thermal Printer 58mm ESC/POS Driver (Pure Web Bluetooth API)
 * - Khusus koneksi Bluetooth Direct (GATT) - TANPA Wifi / IP network scanning.
 * - Format kertas 58mm (Maksimal 32 karakter per baris).
 */

export interface ReceiptPrintData {
  orderNumber: string;
  storeName: string;
  branchName: string;
  cashierName: string;
  customerName?: string;
  tableNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount?: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  rounding: number;
  grandTotal: number;
  payments: Array<{
    method: string;
    amount: number;
    changeGiven?: number;
  }>;
}

const PRINTER_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb',
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  '0000e7cf-0000-1000-8000-00805f9b34fb',
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
];

class BluetoothPrinterService {
  private device: any = null;
  private characteristic: any = null;

  public isConnected(): boolean {
    return !!(this.device && this.device.gatt && this.device.gatt.connected && this.characteristic);
  }

  public getDeviceName(): string {
    return this.device ? this.device.name || 'Bluetooth 58mm Printer' : '';
  }

  /**
   * Request Bluetooth Pairing (Hanya menampilkan perangkat Bluetooth di browser)
   */
  public async connect(): Promise<string> {
    if (typeof window === 'undefined' || !('bluetooth' in navigator)) {
      throw new Error('Browser Anda belum mendukung Web Bluetooth API. Gunakan Google Chrome / Edge.');
    }

    try {
      // Filter ONLY Bluetooth devices
      this.device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: PRINTER_SERVICES,
      });

      const server = await this.device.gatt.connect();

      let primaryService = null;
      for (const serviceUuid of PRINTER_SERVICES) {
        try {
          primaryService = await server.getPrimaryService(serviceUuid);
          if (primaryService) break;
        } catch {
          // continue
        }
      }

      if (!primaryService) {
        const services = await server.getPrimaryServices();
        if (services.length > 0) primaryService = services[0];
      }

      if (!primaryService) {
        throw new Error('GATT Service Printer tidak ditemukan.');
      }

      const characteristics = await primaryService.getCharacteristics();
      this.characteristic = characteristics.find(
        (c: any) => c.properties.write || c.properties.writeWithoutResponse
      );

      if (!this.characteristic) {
        throw new Error('Write characteristic printer tidak ditemukan.');
      }

      return this.device.name || 'Printer Bluetooth 58mm';
    } catch (err: any) {
      this.disconnect();
      throw err;
    }
  }

  public disconnect(): void {
    if (this.device && this.device.gatt && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }

  public async printReceipt(data: ReceiptPrintData): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    const escPosBytes = this.buildEscPosBytes(data);
    await this.sendBytesInChunks(escPosBytes);
  }

  private buildEscPosBytes(data: ReceiptPrintData): Uint8Array {
    const encoder = new TextEncoder();
    const buffer: number[] = [];

    const addBytes = (...bytes: number[]) => buffer.push(...bytes);
    const addText = (text: string) => {
      const encoded = encoder.encode(text);
      for (let i = 0; i < encoded.length; i++) buffer.push(encoded[i]);
    };

    const LINE_WIDTH = 32;

    const formatRow = (left: string, right: string) => {
      const spaceLen = Math.max(1, LINE_WIDTH - left.length - right.length);
      return left + ' '.repeat(spaceLen) + right + '\n';
    };

    // 1. Initialize
    addBytes(0x1b, 0x40);

    // 2. Header Center
    addBytes(0x1b, 0x61, 0x01);
    addBytes(0x1b, 0x45, 0x01); // Bold ON
    addBytes(0x1d, 0x21, 0x01); // Double Height
    addText(data.storeName.toUpperCase() + '\n');
    addBytes(0x1d, 0x21, 0x00);
    addBytes(0x1b, 0x45, 0x00); // Bold OFF

    addText(data.branchName + '\n');
    addText('NPWP: 01.892.435.1-014.000\n');
    addText('-'.repeat(LINE_WIDTH) + '\n');

    // 3. Meta Left
    addBytes(0x1b, 0x61, 0x00);
    addText(`No. Nota : ${data.orderNumber}\n`);
    addText(`Tgl      : ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}\n`);
    addText(`Kasir    : ${data.cashierName}\n`);
    if (data.customerName || data.tableNumber) {
      addText(`Pelanggan: ${data.customerName || 'Walk-in'}${data.tableNumber ? ` (Meja ${data.tableNumber})` : ''}\n`);
    }
    addText('-'.repeat(LINE_WIDTH) + '\n');

    // 4. Items
    data.items.forEach((item) => {
      addBytes(0x1b, 0x45, 0x01);
      addText(item.name.substring(0, LINE_WIDTH) + '\n');
      addBytes(0x1b, 0x45, 0x00);
      const qtyPrice = `${item.quantity} x ${item.unitPrice.toLocaleString('id-ID')}`;
      const subtotal = item.subtotal.toLocaleString('id-ID');
      addText(formatRow('  ' + qtyPrice, subtotal));
      if (item.discount && item.discount > 0) {
        addText(formatRow('  (Diskon)', `-${item.discount.toLocaleString('id-ID')}`));
      }
    });

    addText('-'.repeat(LINE_WIDTH) + '\n');

    // 5. Summary
    addText(formatRow('Subtotal', data.subtotal.toLocaleString('id-ID')));
    if (data.discount > 0) {
      addText(formatRow('Diskon', `-${data.discount.toLocaleString('id-ID')}`));
    }
    addText(formatRow('PPN (11%)', data.tax.toLocaleString('id-ID')));
    if (data.serviceCharge > 0) {
      addText(formatRow('Service Chg', data.serviceCharge.toLocaleString('id-ID')));
    }
    if (data.rounding !== 0) {
      addText(formatRow('Pembulatan', data.rounding.toLocaleString('id-ID')));
    }

    addText('='.repeat(LINE_WIDTH) + '\n');
    addBytes(0x1b, 0x45, 0x01);
    addText(formatRow('TOTAL AKHIR', 'Rp ' + data.grandTotal.toLocaleString('id-ID')));
    addBytes(0x1b, 0x45, 0x00);
    addText('='.repeat(LINE_WIDTH) + '\n');

    // 6. Payments
    data.payments.forEach((p) => {
      addText(formatRow(p.method.toUpperCase(), p.amount.toLocaleString('id-ID')));
      if (p.changeGiven && p.changeGiven > 0) {
        addText(formatRow('Kembali', p.changeGiven.toLocaleString('id-ID')));
      }
    });

    // 7. Footer
    addBytes(0x1b, 0x61, 0x01);
    addText('\n' + '-'.repeat(LINE_WIDTH) + '\n');
    addText('Terima Kasih Atas Kunjungan Anda\n');
    addText('Simpan Struk Ini Sebagai Bukti\n');
    addText(`*${data.orderNumber}*\n\n\n\n`);

    // 8. Cut Feed
    addBytes(0x1b, 0x64, 0x03);

    return new Uint8Array(buffer);
  }

  private async sendBytesInChunks(bytes: Uint8Array): Promise<void> {
    const CHUNK_SIZE = 512;
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.slice(i, i + CHUNK_SIZE);
      if (this.characteristic.writeValueWithResponse) {
        await this.characteristic.writeValueWithResponse(chunk);
      } else {
        await this.characteristic.writeValue(chunk);
      }
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

export const bluetoothPrinter = new BluetoothPrinterService();
