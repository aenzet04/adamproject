'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { usePrinterStore } from '../../stores/usePrinterStore';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { toast } from '../../stores/useToastStore';
import type { CartItem, PaymentAllocation } from '../../types';

interface ReceiptModalProps {
  orderNumber: string;
  customerName?: string;
  tableNumber?: string;
  orderChannel?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  rounding: number;
  grandTotal: number;
  payments: PaymentAllocation[];
  cashierName: string;
  branchName: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  orderNumber,
  customerName,
  tableNumber,
  orderChannel = 'DINE_IN',
  items,
  subtotal,
  discount,
  tax,
  serviceCharge,
  rounding,
  grandTotal,
  payments,
  cashierName,
  branchName,
  onClose,
}) => {
  const [ticketType, setTicketType] = useState<'customer' | 'kitchen'>('customer');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isBluetoothPrinting, setIsBluetoothPrinting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState<string>('');

  const receiptRef = useRef<HTMLDivElement>(null);
  const kitchenRef = useRef<HTMLDivElement>(null);

  const {
    autoPrintEnabled,
    connectedPrinterName,
    toggleAutoPrint,
    connectPrinter,
    printReceipt,
    lastPrintStatus,
  } = usePrinterStore();

  const { subscriptionTier, customReceiptFooter } = useModuleLicenseStore();

  const invoiceUrl = `https://pos.modula.id/e-invoice/${orderNumber}?verify=psak2026`;

  const footerText =
    subscriptionTier === 'enterprise'
      ? customReceiptFooter
      : 'Terima Kasih Atas Kunjungan Anda\nPowered by Modula ERP-POS';

  const getCustomerPrintData = () => ({
    orderNumber,
    storeName: 'KOPI NUSANTARA ROASTERY',
    branchName,
    cashierName,
    customerName,
    tableNumber,
    items: items.map((i) => ({
      name: i.productName + (i.notes ? ` (${i.notes})` : ''),
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
      discount: i.discountAmount,
    })),
    subtotal,
    discount,
    tax,
    serviceCharge,
    rounding,
    grandTotal,
    payments: payments.map((p) => ({
      method: p.paymentMethod,
      amount: p.amount,
      changeGiven: p.changeGiven,
    })),
  });

  const getKitchenPrintData = () => ({
    orderNumber: `DAPUR-${orderNumber.slice(-4)}`,
    storeName: '*** PESANAN DAPUR / BARISTA ***',
    branchName,
    cashierName,
    customerName,
    tableNumber: tableNumber || 'Take Away',
    items: items.map((i) => ({
      name: `[${i.quantity}x] ${i.productName}${i.notes ? `\n   NOTE: ${i.notes}` : ''}`,
      quantity: i.quantity,
      unitPrice: 0,
      subtotal: 0,
      discount: 0,
    })),
    subtotal: 0,
    discount: 0,
    tax: 0,
    serviceCharge: 0,
    rounding: 0,
    grandTotal: 0,
    payments: [],
  });

  useEffect(() => {
    QRCode.toDataURL(invoiceUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR Code error:', err));

    if (autoPrintEnabled && connectedPrinterName) {
      setIsBluetoothPrinting(true);
      printReceipt(getCustomerPrintData()).finally(() => setIsBluetoothPrinting(false));
    }
  }, [invoiceUrl, autoPrintEnabled, connectedPrinterName]);

  const handleManualPrint = async (type: 'customer' | 'kitchen') => {
    setIsBluetoothPrinting(true);
    toast.print(type === 'kitchen' ? 'Tiket Dapur (58mm)' : 'Struk Konsumen Resmi');
    try {
      if (type === 'kitchen') {
        await printReceipt(getKitchenPrintData());
      } else {
        await printReceipt(getCustomerPrintData());
      }
    } finally {
      setIsBluetoothPrinting(false);
    }
  };

  const handleDownloadTxt = () => {
    const W = 32;
    const formatRow = (left: string, right: string) => {
      const space = Math.max(1, W - left.length - right.length);
      return left + ' '.repeat(space) + right;
    };

    let txt = '';
    if (ticketType === 'kitchen') {
      txt += '   *** TIKET DAPUR / BARISTA ***   \n';
      txt += `Outlet   : ${branchName}\n`;
      txt += `No. Order: ${orderNumber}\n`;
      txt += `Meja     : ${tableNumber || 'Take Away'}\n`;
      txt += `Waktu    : ${new Date().toLocaleTimeString('id-ID')} WIB\n`;
      txt += `Tamu     : ${customerName || 'Walk-in'}\n`;
      txt += '='.repeat(W) + '\n';
      items.forEach((it) => {
        txt += `[${it.quantity}x] ${it.productName}\n`;
        if (it.notes) txt += `  * CATATAN: ${it.notes}\n`;
      });
      txt += '='.repeat(W) + '\n';
    } else {
      txt += '      KOPI NUSANTARA ROASTERY   \n';
      txt += `       ${branchName}\n`;
      txt += '       NPWP: 01.892.435.1-014.000\n';
      txt += '-'.repeat(W) + '\n';
      txt += `No. Nota : ${orderNumber}\n`;
      txt += `Waktu    : ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}\n`;
      txt += `Kasir    : ${cashierName} (POS-01)\n`;
      if (customerName || tableNumber) {
        txt += `Tamu     : ${customerName || 'Walk-in'}${tableNumber ? ` (Meja ${tableNumber})` : ''}\n`;
      }
      txt += '-'.repeat(W) + '\n';

      items.forEach((item) => {
        txt += item.productName.substring(0, W) + '\n';
        if (item.notes) txt += `  * ${item.notes}\n`;
        const qtyPrice = `  ${item.quantity} x ${item.unitPrice.toLocaleString('id-ID')}`;
        txt += formatRow(qtyPrice, item.subtotal.toLocaleString('id-ID')) + '\n';
      });

      txt += '-'.repeat(W) + '\n';
      txt += formatRow('Subtotal', subtotal.toLocaleString('id-ID')) + '\n';
      if (discount > 0) txt += formatRow('Diskon', `-${discount.toLocaleString('id-ID')}`) + '\n';
      txt += formatRow('PPN (11%)', tax.toLocaleString('id-ID')) + '\n';
      if (rounding !== 0) txt += formatRow('Pembulatan', rounding.toLocaleString('id-ID')) + '\n';
      txt += '='.repeat(W) + '\n';
      txt += formatRow('TOTAL AKHIR', `Rp ${grandTotal.toLocaleString('id-ID')}`) + '\n';
      txt += '='.repeat(W) + '\n';

      payments.forEach((p) => {
        txt += formatRow(p.paymentMethod.toUpperCase(), p.amount.toLocaleString('id-ID')) + '\n';
      });

      txt += '-'.repeat(W) + '\n';
      txt += `   ${footerText}   \n`;
      txt += `     *${orderNumber}*\n`;
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ticketType === 'kitchen' ? 'tiket-dapur' : 'struk'}-${orderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Unduh TXT Sukses', `File ${link.download} tersimpan.`);
  };

  const handleDownloadPdf = async (): Promise<string | null> => {
    const targetElement = ticketType === 'kitchen' ? kitchenRef.current : receiptRef.current;
    if (!targetElement) return null;
    setIsGeneratingPdf(true);

    try {
      const canvas = await (html2canvas as any)(targetElement, {
        scale: 2,
        backgroundColor: ticketType === 'kitchen' ? '#f1f5f9' : '#fffdfa',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 58;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const filename = `${ticketType === 'kitchen' ? 'tiket-dapur' : 'struk'}-${orderNumber}.pdf`;
      pdf.save(filename);
      toast.success('Unduh PDF Sukses', `Dokumen ${filename} siap cetak.`);
      return filename;
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Gagal Ekspor PDF', 'Terjadi kendala saat rendering kanvas.');
      return null;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const formatWhatsappNumber = (input: string): string => {
    let clean = input.replace(/\D/g, '');
    if (clean.startsWith('08')) clean = '628' + clean.substring(2);
    else if (clean.startsWith('8')) clean = '628' + clean.substring(1);
    return clean;
  };

  const handleSendWhatsappText = () => {
    const normalized = formatWhatsappNumber(whatsappPhone);
    if (!normalized || normalized.length < 10) {
      toast.warning('Nomor WhatsApp Belum Valid', 'Masukkan no. HP lokal (contoh: 081234567890)');
      return;
    }

    let msg = `🧾 *STRUK PEMBELIAN RESMI*\n`;
    msg += `🏪 *KOPI NUSANTARA ROASTERY*\n`;
    msg += `📍 ${branchName}\n`;
    msg += `--------------------------------------------\n`;
    msg += `📄 *No. Nota*    : ${orderNumber}\n`;
    msg += `📅 *Waktu*       : ${new Date().toLocaleString('id-ID')} WIB\n`;
    msg += `👤 *Kasir*       : ${cashierName}\n`;
    msg += `👥 *Pelanggan*   : ${customerName || 'Walk-in Guest'}${tableNumber ? ` (Meja ${tableNumber})` : ''}\n`;
    msg += `--------------------------------------------\n`;
    msg += `*RINCIAN PESANAN:*\n`;

    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productName}*\n`;
      if (item.notes) msg += `   _Catatan: ${item.notes}_\n`;
      msg += `   ${item.quantity} x Rp ${item.unitPrice.toLocaleString('id-ID')} = *Rp ${item.subtotal.toLocaleString('id-ID')}*\n`;
    });

    msg += `--------------------------------------------\n`;
    msg += `💰 *TOTAL AKHIR   : Rp ${grandTotal.toLocaleString('id-ID')} (LUNAS)*\n`;
    msg += `--------------------------------------------\n`;
    msg += `🔗 *Lihat E-Struk / E-Faktur Online:* \n${invoiceUrl}\n\n`;
    msg += `_${footerText}_`;

    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success('Membuka WhatsApp', `Mengirim e-struk ke ${normalized}`);
  };

  const handleSendPdfToWhatsapp = async () => {
    const normalized = formatWhatsappNumber(whatsappPhone);
    if (!normalized || normalized.length < 10) {
      toast.warning('Nomor WhatsApp Belum Valid', 'Masukkan nomor WhatsApp pelanggan (contoh: 081234567890)');
      return;
    }

    const filename = await handleDownloadPdf();

    let msg = `Halo Kak ${customerName || ''},\n\n`;
    msg += `Berikut kami lampirkan Dokumen Resmi E-Struk Pembelian Anda (*No. Nota: ${orderNumber}*).\n`;
    msg += `Total Tagihan: *Rp ${grandTotal.toLocaleString('id-ID')}* *(LUNAS)*\n\n`;
    msg += `📄 File PDF Struk telah kami siapkan (*${filename || 'struk.pdf'}*).\n`;
    msg += `🔗 Unduh E-Faktur Digital: ${invoiceUrl}\n\n`;
    msg += `_${footerText}_`;

    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col my-auto transition-colors">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <span className="text-red-600 text-lg">🧾</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pusat Cetak Struk & Tiket Dapur (58mm)
              </h3>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Pilih Cetak Konsumen atau Cetak Tiket Dapur / Barista
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Struk Konsumen vs Tiket Dapur */}
        <div className="p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex space-x-2">
          <button
            onClick={() => setTicketType('customer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              ticketType === 'customer'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>🧾</span>
            <span>Struk Konsumen (Harga & QR)</span>
          </button>

          <button
            onClick={() => setTicketType('kitchen')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              ticketType === 'kitchen'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>🍳</span>
            <span>Tiket Dapur (Catatan Menu)</span>
          </button>
        </div>

        {/* Bluetooth Device Banner Bar */}
        <div className="bg-slate-100/70 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 text-sm">📶</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              {connectedPrinterName ? (
                <span className="text-red-600 dark:text-red-400 font-bold">Terhubung: {connectedPrinterName}</span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">BT Printer Belum Terhubung</span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoPrintEnabled}
                onChange={toggleAutoPrint}
                className="w-3.5 h-3.5 accent-red-600 rounded"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Auto-Print</span>
            </label>

            {!connectedPrinterName && (
              <button
                onClick={() => connectPrinter()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shadow-sm"
              >
                + Hubungkan BT
              </button>
            )}
          </div>
        </div>

        {/* SMART WHATSAPP DISPATCHER */}
        {ticketType === 'customer' && (
          <div className="bg-rose-50 dark:bg-red-950/30 p-3.5 border-b border-rose-100 dark:border-red-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 dark:text-red-400 text-sm">💬</span>
                <span className="text-xs font-bold text-red-900 dark:text-red-300">
                  Kirim E-Struk ke WhatsApp Pelanggan
                </span>
              </div>
              <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded-full">
                Format 081...
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="tel"
                placeholder="Ketik No. WhatsApp (contoh: 081234567890)"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-red-300 dark:border-red-600/50 rounded-2xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-red-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSendWhatsappText}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
                >
                  <span>💬</span>
                  <span>Kirim WA (Teks)</span>
                </button>

                <button
                  onClick={handleSendPdfToWhatsapp}
                  disabled={isGeneratingPdf}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <span>📕</span>
                  <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Kirim PDF ke WA'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. CUSTOMER RECEIPT VIEW */}
        {ticketType === 'customer' && (
          <div
            ref={receiptRef}
            className="p-5 bg-amber-50/90 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner max-h-[38vh] overflow-y-auto"
          >
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-900">
                KOPI NUSANTARA ROASTERY
              </h2>
              <div className="text-[10px] text-slate-700">{branchName}</div>
              <div className="text-[9px] text-slate-600">NPWP: 01.892.435.1-014.000</div>
            </div>

            <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Channel:</span>
                <span className="font-black bg-slate-900 text-white px-1.5 py-0.2 rounded text-[9px]">
                  [{orderChannel.replace('_', ' ')}]
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{new Date().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{cashierName} (POS-01)</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{customerName || 'Walk-in Guest'}{tableNumber ? ` (Meja ${tableNumber})` : ''}</span>
              </div>
            </div>

            <div className="py-2 border-b border-dashed border-slate-400 space-y-1.5">
              {items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-900">{item.productName}</div>
                  {item.notes && <div className="text-[9.5px] text-slate-600 italic"> Catatan: {item.notes}</div>}
                  <div className="flex justify-between text-[10px] text-slate-700">
                    <span>
                      {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="font-bold">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>Diskon:</span>
                  <span>- Rp {discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>PPN (11%):</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs font-black pt-1 border-t border-slate-300 text-slate-950">
                <span>TOTAL AKHIR:</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col items-center justify-center text-center space-y-1">
              {qrCodeDataUrl && (
                <div className="bg-white p-1 rounded border border-slate-300">
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-16 h-16 mx-auto" />
                </div>
              )}
              <div className="text-[9px] text-slate-600 font-bold whitespace-pre-line mt-1">
                {footerText}
              </div>
              <span className="text-[8px] text-slate-600 font-mono">*{orderNumber}*</span>
            </div>
          </div>
        )}

        {/* 2. KITCHEN ORDER TICKET VIEW */}
        {ticketType === 'kitchen' && (
          <div
            ref={kitchenRef}
            className="p-5 bg-slate-100 text-slate-900 font-mono text-xs leading-relaxed shadow-inner max-h-[38vh] overflow-y-auto border-2 border-slate-300 m-2 rounded-2xl"
          >
            <div className="text-center pb-2 border-b-2 border-dashed border-slate-800">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-900">
                🍳 TIKET DAPUR / BARISTA
              </h2>
              <div className="text-xs font-bold text-red-600 mt-1">
                MEJA: {tableNumber ? `MEJA #${tableNumber}` : 'TAKE AWAY / BUNGKUS'}
                MEJA: {tableNumber ? `MEJA #${tableNumber}` : 'TAKE AWAY / BUNGKUS'} • [{orderChannel.replace('_', ' ')}]
              </div>
              <div className="text-[10px] text-slate-600 font-mono">Order: {orderNumber}</div>
              <div className="text-[10px] text-slate-600">Waktu: {new Date().toLocaleTimeString('id-ID')} WIB</div>
            </div>

            <div className="py-3 space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="border-b border-dashed border-slate-300 pb-2">
                  <div className="flex justify-between items-start font-black text-sm">
                    <span>{item.productName}</span>
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-xs">
                      {item.quantity}x
                    </span>
                  </div>
                  {item.notes ? (
                    <div className="mt-1 bg-red-100 text-red-900 font-bold p-1.5 rounded text-[11px] border border-red-300">
                      ⚡ CATATAN: {item.notes}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic mt-0.5">Standar resep</div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-600 font-bold uppercase border-t-2 border-dashed border-slate-800">
              Segera Disiapkan untuk {customerName || 'Walk-in'}
            </div>
          </div>
        )}

        {/* EXPORT & PRINT BUTTONS */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2.5">
          {lastPrintStatus && (
            <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-mono">
              Status: {lastPrintStatus}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadTxt}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm"
            >
              <span>📄</span>
              <span>Unduh TXT ({ticketType === 'kitchen' ? 'Dapur' : 'Struk'})</span>
            </button>

            <button
              onClick={() => handleDownloadPdf()}
              disabled={isGeneratingPdf}
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
            >
              <span>📕</span>
              <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Unduh PDF (' + (ticketType === 'kitchen' ? 'Dapur' : 'Struk') + ')'}</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Selesai
            </button>

            <button
              onClick={() => handleManualPrint(ticketType)}
              disabled={isBluetoothPrinting}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-red-600/25 transition-all active:scale-95"
            >
              <span>🖨️</span>
              <span>{isBluetoothPrinting ? 'Mencetak...' : ticketType === 'kitchen' ? 'Cetak Tiket Dapur (58mm)' : 'Cetak Struk Konsumen'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
