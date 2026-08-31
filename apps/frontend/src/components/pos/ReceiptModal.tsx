'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
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
  const [whatsappPhone, setWhatsappPhone] = useState<string>('');
  const [showWhatsappInput, setShowWhatsappInput] = useState<boolean>(false);

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
   * Normalisasi nomor telepon dari 08xxx atau 8xxx ke format WhatsApp 628xxx secara otomatis
   */
  const formatWhatsappNumber = (input: string): string => {
    let clean = input.replace(/\D/g, ''); // Hapus karakter non-angka
    if (clean.startsWith('08')) {
      clean = '628' + clean.substring(2);
    } else if (clean.startsWith('8')) {
      clean = '628' + clean.substring(1);
    } else if (clean.startsWith('6208')) {
      clean = '628' + clean.substring(4);
    }
    return clean;
  };

  /**
   * Susun Laporan Struk WhatsApp Lengkap, Rapi & Sangat Informatif
   */
  const buildInformativeWhatsappMessage = (): string => {
    const divider = '--------------------------------------------';
    const doubleDivider = '============================================';
    const dateStr = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let msg = `🧾 *STRUK PEMBELIAN RESMI*\n`;
    msg += `🏪 *KOPI NUSANTARA ROASTERY*\n`;
    msg += `📍 ${branchName}\n`;
    msg += `NPWP: 01.892.435.1-014.000\n`;
    msg += `${divider}\n`;
    msg += `📄 *No. Nota*    : ${orderNumber}\n`;
    msg += `📅 *Waktu*       : ${dateStr} WIB\n`;
    msg += `👤 *Kasir*       : ${cashierName} (POS-01)\n`;
    msg += `👥 *Pelanggan*   : ${customerName || 'Walk-in Guest'}${tableNumber ? ` (Meja ${tableNumber})` : ''}\n`;
    msg += `${divider}\n`;
    msg += `*RINCIAN PESANAN:*\n`;

    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productName}*\n`;
      msg += `   ${item.quantity} x Rp ${item.unitPrice.toLocaleString('id-ID')} = *Rp ${item.subtotal.toLocaleString('id-ID')}*\n`;
      if (item.discountAmount > 0) {
        msg += `   _(Diskon Item: -Rp ${item.discountAmount.toLocaleString('id-ID')})_\n`;
      }
    });

    msg += `${divider}\n`;
    msg += `Subtotal          : Rp ${subtotal.toLocaleString('id-ID')}\n`;
    if (discount > 0) {
      msg += `Potongan Diskon   : -Rp ${discount.toLocaleString('id-ID')}\n`;
    }
    msg += `PPN (11%)         : Rp ${tax.toLocaleString('id-ID')}\n`;
    if (serviceCharge > 0) {
      msg += `Service Charge    : Rp ${serviceCharge.toLocaleString('id-ID')}\n`;
    }
    if (rounding !== 0) {
      msg += `Pembulatan        : Rp ${rounding.toLocaleString('id-ID')}\n`;
    }
    msg += `${doubleDivider}\n`;
    msg += `💰 *TOTAL AKHIR   : Rp ${grandTotal.toLocaleString('id-ID')}*\n`;
    msg += `${doubleDivider}\n`;

    msg += `*RINCIAN PEMBAYARAN:*\n`;
    payments.forEach((p) => {
      msg += `• ${p.paymentMethod.toUpperCase().replace('_', ' ')} : Rp ${p.amount.toLocaleString('id-ID')}`;
      if (p.changeGiven > 0) {
        msg += ` _(Kembali: Rp ${p.changeGiven.toLocaleString('id-ID')})_`;
      }
      msg += ` *(LUNAS)*\n`;
    });

    msg += `${divider}\n`;
    msg += `🔗 *Cek & Unduh E-Faktur / E-Struk Digital:*\n`;
    msg += `${invoiceUrl}\n\n`;
    msg += `_Terima kasih atas kunjungan Anda! Selamat menikmati hidangan kami._\n`;
    msg += `_Barang yang sudah dibeli dapat ditukar maks. 1x24 jam dengan menunjukkan pesan struk ini._`;

    return msg;
  };

  const handleSendWhatsapp = () => {
    const normalized = formatWhatsappNumber(whatsappPhone);
    if (!normalized || normalized.length < 10) {
      alert('Mohon masukkan nomor WhatsApp yang valid (contoh: 081234567890)');
      return;
    }

    const message = buildInformativeWhatsappMessage();
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${normalized}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 text-base">🧾</span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Struk / Nota Resmi Konsumen</h3>
              <div className="text-[10px] text-slate-400">Format Kertas Thermal 58mm & E-Invoice WhatsApp</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Bluetooth Device Banner Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400 text-sm">📶</span>
            <span className="text-[11px] text-slate-300">
              {connectedPrinterName ? (
                <span className="text-emerald-400 font-bold">Terhubung: {connectedPrinterName}</span>
              ) : (
                <span className="text-slate-400">Bluetooth Printer Belum Terhubung</span>
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
              <span className="text-[10px] text-slate-400 font-semibold">Cetak Otomatis</span>
            </label>

            {!connectedPrinterName && (
              <button
                onClick={() => connectPrinter()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
              >
                + Hubungkan BT
              </button>
            )}
          </div>
        </div>

        {/* WHATSAPP SENDER DRAWER */}
        <div className="bg-emerald-950/40 p-3 border-b border-emerald-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 text-sm">💬</span>
              <span className="text-xs font-bold text-emerald-300">Kirim E-Struk ke WhatsApp Konsumen</span>
            </div>
            <button
              onClick={() => setShowWhatsappInput(!showWhatsappInput)}
              className="text-[10px] text-emerald-400 font-bold hover:underline"
            >
              {showWhatsappInput ? 'Tutup' : 'Buka Input WA'}
            </button>
          </div>

          {showWhatsappInput && (
            <div className="mt-2.5 space-y-2">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890 (otomatis dikonversi)"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendWhatsapp();
                    }}
                    className="w-full bg-slate-950 border border-emerald-600/50 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <button
                  onClick={handleSendWhatsapp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95 whitespace-nowrap"
                >
                  <span>📲</span>
                  <span>Kirim WA</span>
                </button>
              </div>
              <div className="text-[10px] text-emerald-400/80">
                ✨ Ketik langsung nomor lokal seperti <b>0812...</b> (tanpa repot mengetik +628).
              </div>
            </div>
          )}
        </div>

        {/* Thermal Receipt Paper Style (58mm preview) */}
        <div className="p-5 bg-amber-50/95 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner max-h-[50vh] overflow-y-auto print:max-h-none print:p-0">
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
            {serviceCharge > 0 && (
              <div className="flex justify-between">
                <span>Service Charge:</span>
                <span>Rp {serviceCharge.toLocaleString('id-ID')}</span>
              </div>
            )}
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
              <div className="bg-white p-1.5 rounded-lg border border-slate-300">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 mx-auto" />
                <div className="text-[7.5px] font-sans font-bold text-slate-600 mt-0.5 uppercase">
                  Scan QR untuk E-Faktur
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

        {/* Modal Actions */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-col space-y-2">
          {lastPrintStatus && (
            <div className="text-[10px] text-center text-slate-400 font-mono">
              Status: {lastPrintStatus}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Selesai
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowWhatsappInput(true)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                <span>💬</span>
                <span>Kirim WA</span>
              </button>

              <button
                onClick={handleManualBluetoothPrint}
                disabled={isBluetoothPrinting}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-blue-950 transition-all"
              >
                <span>🖨️</span>
                <span>{isBluetoothPrinting ? 'Mencetak...' : 'Cetak BT 58mm'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
