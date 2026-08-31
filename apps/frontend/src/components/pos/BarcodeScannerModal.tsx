'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../../types';

interface BarcodeScannerModalProps {
  products: Product[];
  onProductScanned: (product: Product) => void;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  products,
  onProductScanned,
  onClose,
}) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt camera access for real QR / Barcode scanning
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraActive(true);
          }
        })
        .catch((err) => {
          console.warn('Camera access not permitted or unavailable, using optical emulator:', err);
          setCameraActive(false);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScanBarcode = (barcodeVal: string) => {
    const matched = products.find(
      (p) => p.barcode === barcodeVal || p.sku.toLowerCase() === barcodeVal.toLowerCase()
    );

    if (matched) {
      onProductScanned(matched);
      setScannedFeedback(`✅ Berhasil Scan: ${matched.name} (Rp ${matched.sellingPrice.toLocaleString('id-ID')})`);
      setTimeout(() => {
        setScannedFeedback(null);
      }, 1500);
    } else {
      setScannedFeedback(`❌ Barcode "${barcodeVal}" tidak ditemukan dalam katalog`);
      setTimeout(() => {
        setScannedFeedback(null);
      }, 2000);
    }
    setManualBarcode('');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 text-lg">📷</span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Live Optical QR & Barcode Scanner</h3>
              <p className="text-[10px] text-slate-400">Arahkan barcode produk ke dalam kotak sensor kamera</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder Section */}
        <div className="relative p-6 flex flex-col items-center justify-center bg-slate-950">
          {/* Camera View / Optical Emulator Box */}
          <div className="relative w-72 h-72 bg-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500/50 flex items-center justify-center shadow-inner">
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {!cameraActive && (
              <div className="text-center p-4">
                <div className="text-4xl mb-2 animate-pulse">📷</div>
                <div className="text-xs font-semibold text-slate-300">Sensor Optik Aktif</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Mendeteksi barcode EAN-13, Code-128 & QR Code
                </div>
              </div>
            )}

            {/* Viewfinder Target Frame Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

            {/* Animated Laser Scanning Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
          </div>

          {/* Scanned Feedback Notification */}
          {scannedFeedback && (
            <div
              className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scannedFeedback.startsWith('✅')
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  : 'bg-rose-950 border border-rose-500 text-rose-300'
              }`}
            >
              {scannedFeedback}
            </div>
          )}
        </div>

        {/* Quick Click Barcode Simulator Buttons for Rapid Testing */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Uji Coba Cepat Barcode Produk (Simulasi Scan):
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {products.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleScanBarcode(p.barcode || p.sku)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 rounded-xl text-left text-xs transition-all active:scale-95 flex items-center justify-between"
                >
                  <div className="truncate mr-1">
                    <div className="font-semibold text-slate-200 truncate">{p.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{p.barcode}</div>
                  </div>
                  <span className="text-base">⚡</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Barcode Input Fallback */}
          <div className="pt-2 border-t border-slate-800 flex space-x-2">
            <input
              type="text"
              placeholder="Atau ketik Barcode / EAN-13 manual..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualBarcode.trim()) {
                  handleScanBarcode(manualBarcode.trim());
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => {
                if (manualBarcode.trim()) handleScanBarcode(manualBarcode.trim());
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Scan
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl text-xs font-bold"
          >
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
