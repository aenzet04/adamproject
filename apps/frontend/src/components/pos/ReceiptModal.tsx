'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { usePrinterStore } from '../../stores/usePrinterStore';
import type { CartItem, PaymentAllocation } from '../../types';

interface ReceiptModalProps {
  orderNumber: string;
  customerName?: string;
  tableNumber?: string;
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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isBluetoothPrinting, setIsBluetoothPrinting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState<string>('');
  const [showWhatsappInput, setShowWhatsappInput] = useState<boolean>(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  const {
    autoPrintEnabled,
    connectedPrinterName,
    toggleAutoPrint,
    connectPrinter,
    printReceipt,
    lastPrintStatus,
  } = usePrinterStore();

  const invoiceUrl = `https://pos.adamcorp.id/e-invoice/${orderNumber}?verify=psak2026`;

  const getPrintData = () => ({
    orderNumber,
    storeName: 'KOPI NUSANTARA ROASTERY',
    branchName,
    cashierName,
    customerName,
    tableNumber,
    items: items.map((i) => ({
      name: i.productName,
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
      printReceipt(getPrintData()).finally(() => setIsBluetoothPrinting(false));
    }
  }, [invoiceUrl, autoPrintEnabled, connectedPrinterName]);

  const handleManualBluetoothPrint = async () => {
    setIsBluetoothPrinting(true);
    try {
      await printReceipt(getPrintData());
    } finally {
      setIsBluetoothPrinting(false);
    }
  };

  /**
   * 1. FITUR UNDUH FILE TEKS (.TXT)
   */
  const handleDownloadTxt = () => {
    const W = 32;
    const formatRow = (left: string, right: string) => {
      const space = Math.max(1, W - left.length - right.length);
      return left + ' '.repeat(space) + right;
    };

    let txt = '';
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
    txt += '   Terima Kasih Atas Kunjungan Anda   \n';
    txt += `     *${orderNumber}*\n`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `struk-${orderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * 2. FITUR UNDUH DOKUMEN RESMI PDF (.PDF)
   */
  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await (html2canvas as any)(receiptRef.current, {
        scale: 2,
        backgroundColor: '#fffdfa',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      // 58mm thermal aspect ratio in mm (width: 58mm, auto height)
      const pdfWidth = 58;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`struk-${orderNumber}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Gagal membuat file PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /**
   * Normalisasi WhatsApp
   */
  const formatWhatsappNumber = (input: string): string => {
    let clean = input.replace(/\D/g, '');
    if (clean.startsWith('08')) clean = '628' + clean.substring(2);
    else if (clean.startsWith('8')) clean = '628' + clean.substring(1);
    return clean;
  };

  const handleSendWhatsapp = () => {
    const normalized = formatWhatsappNumber(whatsappPhone);
    if (!normalized || normalized.length < 10) {
      alert('Mohon masukkan nomor WhatsApp yang valid (contoh: 081234567890)');
      return;
    }

    let msg = `🧾 *STRUK PEMBELIAN RESMI*\n`;
    msg += `🏪 *KOPI NUSANTARA ROASTERY*\n`;
    msg += `📍 ${branchName}\n`;
    msg += `--------------------------------------------\n`;
    msg += `📄 *No. Nota* : ${orderNumber}\n`;
    msg += `📅 *Waktu*    : ${new Date().toLocaleString('id-ID')} WIB\n`;
    msg += `👤 *Kasir*    : ${cashierName}\n`;
    msg += `👥 *Tamu*     : ${customerName || 'Walk-in'}${tableNumber ? ` (Meja ${tableNumber})` : ''}\n`;
    msg += `--------------------------------------------\n`;
    msg += `*RINCIAN PESANAN:*\n`;

    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productName}*\n`;
      msg += `   ${item.quantity} x Rp ${item.unitPrice.toLocaleString('id-ID')} = *Rp ${item.subtotal.toLocaleString('id-ID')}*\n`;
    });

    msg += `--------------------------------------------\n`;
    msg += `💰 *TOTAL AKHIR : Rp ${grandTotal.toLocaleString('id-ID')} (LUNAS)*\n`;
    msg += `--------------------------------------------\n`;
    msg += `🔗 *Lihat E-Struk / E-Faktur:* ${invoiceUrl}\n\n`;
    msg += `_Terima kasih atas kunjungan Anda!_`;

    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col my-auto transition-colors">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 text-lg">🧾</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Struk Konsumen Resmi</h3>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Format Thermal 58mm & E-Invoice</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Bluetooth Device Banner Bar */}
        <div className="bg-slate-100/70 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 text-sm">📶</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              {connectedPrinterName ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Terhubung: {connectedPrinterName}</span>
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
                className="w-3.5 h-3.5 accent-emerald-500 rounded"
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

        {/* WHATSAPP SENDER DRAWER */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 border-b border-emerald-100 dark:border-emerald-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm">💬</span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Kirim Struk ke WhatsApp Konsumen</span>
            </div>
            <button
              onClick={() => setShowWhatsappInput(!showWhatsappInput)}
              className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              {showWhatsappInput ? 'Tutup' : 'Input No. WA'}
            </button>
          </div>

          {showWhatsappInput && (
            <div className="mt-2.5 space-y-2">
              <div className="flex space-x-2">
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890 (otomatis +62)"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendWhatsapp();
                  }}
                  className="flex-1 bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-600/50 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-emerald-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                />
                <button
                  onClick={handleSendWhatsapp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                  <span>📲</span>
                  <span>Kirim WA</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Thermal Receipt Paper Style (Ref captured for PDF generation) */}
        <div
          ref={receiptRef}
          className="p-5 bg-amber-50/90 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner max-h-[46vh] overflow-y-auto print:max-h-none print:p-0"
        >
          <div className="text-center pb-3 border-b border-dashed border-slate-400">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-900">
              KOPI NUSANTARA ROASTERY
            </h2>
            <div className="text-[10px] text-slate-700">{branchName}</div>
            <div className="text-[9px] text-slate-600">NPWP: 01.892.435.1-014.000</div>
          </div>

          <div className="py-2.5 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span className="font-bold">{orderNumber}</span>
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

          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1.5">
            {items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-bold text-slate-900">{item.productName}</div>
                <div className="flex justify-between text-[10px] text-slate-700">
                  <span>
                    {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                    {item.discountAmount > 0 && ` (-${item.discountAmount})`}
                  </span>
                  <span className="font-bold">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
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
            {rounding !== 0 && (
              <div className="flex justify-between">
                <span>Pembulatan:</span>
                <span>Rp {rounding.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-black pt-1 border-t border-slate-300 text-slate-950">
              <span>TOTAL AKHIR:</span>
              <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
            {payments.map((p, i) => (
              <div key={i} className="flex justify-between">
                <span className="uppercase font-semibold">{p.paymentMethod.replace('_', ' ')}:</span>
                <span>
                  Rp {p.amount.toLocaleString('id-ID')}
                  {p.changeGiven > 0 && ` (Kembali: Rp ${p.changeGiven.toLocaleString('id-ID')})`}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 flex flex-col items-center justify-center text-center space-y-2">
            {qrCodeDataUrl ? (
              <div className="bg-white p-1.5 rounded-lg border border-slate-300 shadow-sm">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 mx-auto" />
                <div className="text-[7.5px] font-sans font-bold text-slate-600 mt-0.5 uppercase">
                  Scan QR E-Faktur
                </div>
              </div>
            ) : null}

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center space-x-[2px] h-6 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full bg-slate-900 ${
                      i % 3 === 0 ? 'w-[2.5px]' : i % 2 === 0 ? 'w-[1.2px]' : 'w-[0.8px]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[8.5px] tracking-widest text-slate-700 font-mono mt-0.5">
                *{orderNumber}*
              </span>
            </div>
          </div>
        </div>

        {/* EXPORT OPTIONS: 1 TXT & 1 PDF + BLUETOOTH */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2.5">
          {lastPrintStatus && (
            <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-mono">
              Status: {lastPrintStatus}
            </div>
          )}

          {/* Download 1 TXT & 1 PDF Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadTxt}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm"
            >
              <span>📄</span>
              <span>Unduh Struk (.TXT)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>📕</span>
              <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Unduh Dokumen (.PDF)'}</span>
            </button>
          </div>

          {/* Primary Action Row */}
          <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Selesai
            </button>

            <button
              onClick={handleManualBluetoothPrint}
              disabled={isBluetoothPrinting}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <span>🖨️</span>
              <span>{isBluetoothPrinting ? 'Mencetak...' : 'Cetak Bluetooth 58mm'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
