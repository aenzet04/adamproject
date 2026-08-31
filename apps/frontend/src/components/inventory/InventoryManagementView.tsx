'use client';

import React, { useState, useRef } from 'react';
import { useInventoryStore, VendorAgent } from '../../stores/useInventoryStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { toast } from '../../stores/useToastStore';

export const InventoryManagementView: React.FC = () => {
  const { vendors, inbounds, transfers, addVendor, addPurchaseInbound, createStockTransfer } = useInventoryStore();
  const { availableWarehouses } = useTenantStore();

  const [activeTab, setActiveTab] = useState<'stock' | 'restock' | 'transfer' | 'vendors'>('restock');

  // Restock Form State
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [warehouseId, setWarehouseId] = useState(availableWarehouses[0]?.id || 'wh-01');
  const [productName, setProductName] = useState('Roasted Beans Aceh Gayo 250g');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-SUP-${Date.now().toString().slice(-4)}`);
  const [quantity, setQuantity] = useState<number>(20);
  const [unitCost, setUnitCost] = useState<number>(45000);
  const [productPhoto, setProductPhoto] = useState<string>('');
  const [invoicePdfName, setInvoicePdfName] = useState<string>('');
  const [invoicePdfDataUrl, setInvoicePdfDataUrl] = useState<string>('');
  const [restockNotes, setRestockNotes] = useState('');

  // Transfer Form State
  const [transferType, setTransferType] = useState<'TRANSFER_BIASA' | 'TUKAR_GULING_BARTER'>('TRANSFER_BIASA');
  const [srcWarehouseId, setSrcWarehouseId] = useState('wh-01');
  const [tgtWarehouseId, setTgtWarehouseId] = useState('wh-02');
  const [transferProduct, setTransferProduct] = useState('Roasted Beans Aceh Gayo 250g');
  const [transferQty, setTransferQty] = useState<number>(10);
  const [exchangedProduct, setExchangedProduct] = useState('Cold Brew Bottle 250ml');
  const [exchangedQty, setExchangedQty] = useState<number>(10);
  const [transferNotes, setTransferNotes] = useState('');

  // Add Vendor Form State
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [vName, setVName] = useState('');
  const [vContact, setVContact] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vCategory, setVCategory] = useState<VendorAgent['category']>('Green Beans & Kopi');
  const [vTerms, setVTerms] = useState<VendorAgent['paymentTerms']>('TOP_14');
  const [vAddress, setVAddress] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductPhoto(reader.result);
        toast.info('Foto Produk Diunggah', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF Upload
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInvoicePdfName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setInvoicePdfDataUrl(reader.result);
        toast.success('Faktur PDF Diunggah', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === vendorId);
    const wh = availableWarehouses.find((w) => w.id === warehouseId) || { name: 'Gudang Utama Barista GI' };

    const totalCost = quantity * unitCost;

    addPurchaseInbound({
      invoiceNumber,
      vendorId,
      vendorName: vendor?.name || 'Supplier Utama',
      warehouseId,
      warehouseName: wh.name,
      productId: 'prod-012',
      productName,
      quantity,
      unitCost,
      totalCost,
      photoUrl: productPhoto,
      invoicePdfName,
      invoicePdfDataUrl,
      notes: restockNotes,
    });

    toast.success('Stok Berhasil Ditambahkan', `${quantity}x ${productName} masuk ke ${wh.name} (Total: Rp ${totalCost.toLocaleString('id-ID')})`);

    setInvoiceNumber(`INV-SUP-${Date.now().toString().slice(-4)}`);
    setProductPhoto('');
    setInvoicePdfName('');
    setInvoicePdfDataUrl('');
    setRestockNotes('');
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (srcWarehouseId === tgtWarehouseId) {
      toast.warning('Gudang Sama', 'Pilih gudang asal dan gudang tujuan yang berbeda.');
      return;
    }

    const srcWh = availableWarehouses.find((w) => w.id === srcWarehouseId) || { name: 'Gudang Utama GI' };
    const tgtWh = availableWarehouses.find((w) => w.id === tgtWarehouseId) || { name: 'Gudang Outlet Senopati' };

    createStockTransfer({
      transferNumber: `TRF-${Date.now().toString().slice(-6)}`,
      transferType,
      sourceWarehouseId: srcWarehouseId,
      sourceWarehouseName: srcWh.name,
      targetWarehouseId: tgtWarehouseId,
      targetWarehouseName: tgtWh.name,
      productId: 'prod-012',
      productName: transferProduct,
      quantity: transferQty,
      exchangedProductId: transferType === 'TUKAR_GULING_BARTER' ? 'prod-006' : undefined,
      exchangedProductName: transferType === 'TUKAR_GULING_BARTER' ? exchangedProduct : undefined,
      exchangedQuantity: transferType === 'TUKAR_GULING_BARTER' ? exchangedQty : undefined,
      status: 'COMPLETED',
      notes: transferNotes,
    });

    toast.success(
      transferType === 'TUKAR_GULING_BARTER' ? 'Tukar Guling Berhasil' : 'Mutasi Stok Berhasil',
      `${srcWh.name} ➔ ${tgtWh.name}`
    );

    setTransferNotes('');
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || !vContact || !vPhone) {
      toast.error('Data Belum Lengkap', 'Nama vendor, kontak, dan nomor telepon wajib diisi.');
      return;
    }

    addVendor({
      name: vName,
      contactPerson: vContact,
      phone: vPhone,
      category: vCategory,
      paymentTerms: vTerms,
      address: vAddress,
    });

    toast.success('Vendor Baru Terdaftar', `${vName} (${vCategory})`);
    setIsAddVendorOpen(false);
    setVName('');
    setVContact('');
    setVPhone('');
    setVAddress('');
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📦</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Gudang, Tambah Stok, Tukar Guling & Vendor SCM
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Multi-Warehouse SCM
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Restock barang dengan upload foto & invoice PDF, mutasi tukar guling antar outlet, dan database vendor/agen.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-200 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800 flex space-x-1">
          <button
            onClick={() => setActiveTab('restock')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'restock'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>➕</span>
            <span>Tambah Stok & Invoice PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'transfer'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🔄</span>
            <span>Pindah Stok & Tukar Guling</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'vendors'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🏢</span>
            <span>Manajemen Vendor / Agen</span>
          </button>
        </div>
      </div>

      {/* 1. RESTOCK INBOUND TAB (UPLOAD FOTO + PDF INVOICE) */}
      {activeTab === 'restock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Restock Form */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-lg">🛒</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Form Belanja Stok Baru & Restock Inbound
              </h3>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor / Agen Suplier</label>
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Tujuan Masuk</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    {availableWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. Invoice / Faktur</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-red-600 dark:text-red-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Produk / Bahan</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kuantitas Masuk (Qty)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Beli Satuan (Rp HPP)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={unitCost}
                    onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-red-600 dark:text-red-400"
                  />
                </div>
              </div>

              {/* PHOTO UPLOAD & PDF INVOICE ATTACHMENTS */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Photo Upload Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">📷 Foto Produk Fisik:</span>
                  {productPhoto ? (
                    <div className="relative group">
                      <img
                        src={productPhoto}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-xl border border-slate-300 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all text-[11px]"
                    >
                      <span>📁 Klik Upload Foto</span>
                    </button>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                {/* PDF Invoice Upload Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">📄 File Faktur PDF Supplier:</span>
                  {invoicePdfName ? (
                    <div className="h-24 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-2.5 flex flex-col justify-between text-[11px]">
                      <div className="font-bold text-red-900 dark:text-red-200 truncate">
                        📕 {invoicePdfName}
                      </div>
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="text-[10px] text-red-600 dark:text-red-400 font-bold hover:underline"
                      >
                        Ganti File PDF
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all text-[11px]"
                    >
                      <span>📕 Klik Upload PDF Invoice</span>
                    </button>
                  )}
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Inbound</label>
                <input
                  type="text"
                  placeholder="Contoh: Batch pengiriman roasting minggu ke-1 September"
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <div className="font-mono">
                  <span className="text-[10px] text-slate-400 block">Total Nilai Restock:</span>
                  <span className="text-sm font-black text-red-600 dark:text-red-400">
                    Rp {(quantity * unitCost).toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md shadow-red-600/20 transition-all active:scale-95"
                >
                  Simpan & Tambah Stok Masuk
                </button>
              </div>
            </form>
          </div>

          {/* Inbound History Log */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Riwayat Pembelian & Faktur Masuk ({inbounds.length})
            </h3>

            {inbounds.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <span className="text-3xl mb-2 block">📋</span>
                Belum ada transaksi belanja stok baru hari ini. Silakan input form di sebelah kiri.
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {inbounds.map((inb) => (
                  <div
                    key={inb.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      {inb.photoUrl ? (
                        <img
                          src={inb.photoUrl}
                          alt={inb.productName}
                          className="w-12 h-12 object-cover rounded-xl border border-red-500/40"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">
                          📦
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-red-600 dark:text-red-400">
                            {inb.invoiceNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {inb.productName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {inb.quantity}x @ Rp {inb.unitCost.toLocaleString('id-ID')} ➔ {inb.warehouseName}
                        </div>
                        <div className="text-[10px] text-slate-400">Vendor: {inb.vendorName}</div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs font-black font-mono text-red-600 dark:text-red-400">
                        Rp {inb.totalCost.toLocaleString('id-ID')}
                      </div>
                      {inb.invoicePdfDataUrl && (
                        <a
                          href={inb.invoicePdfDataUrl}
                          download={inb.invoicePdfName || 'faktur-supplier.pdf'}
                          className="text-[10px] text-red-500 hover:underline font-bold inline-block"
                        >
                          📥 Unduh PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TRANSFER & TUKAR GULING TAB */}
      {activeTab === 'transfer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-lg">🔄</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Mutasi & Tukar Guling Antar Gudang
              </h3>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3.5 text-xs">
              {/* Transfer Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferType('TRANSFER_BIASA')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    transferType === 'TRANSFER_BIASA'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pindah Stok Biasa
                </button>
                <button
                  type="button"
                  onClick={() => setTransferType('TUKAR_GULING_BARTER')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    transferType === 'TUKAR_GULING_BARTER'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Tukar Guling (Barter)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Asal (Pengirim)</label>
                  <select
                    value={srcWarehouseId}
                    onChange={(e) => setSrcWarehouseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    {availableWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Tujuan (Penerima)</label>
                  <select
                    value={tgtWarehouseId}
                    onChange={(e) => setTgtWarehouseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    {availableWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Barang yang Dikirim (Asal ➔ Tujuan):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={transferProduct}
                    onChange={(e) => setTransferProduct(e.target.value)}
                    placeholder="Nama Barang"
                    className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-semibold"
                  />
                  <input
                    type="number"
                    required
                    min={1}
                    value={transferQty}
                    onChange={(e) => setTransferQty(parseInt(e.target.value) || 0)}
                    placeholder="Qty"
                    className="col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-mono font-bold text-center"
                  />
                </div>
              </div>

              {/* Tukar Guling Return Item */}
              {transferType === 'TUKAR_GULING_BARTER' && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800/40 space-y-2">
                  <span className="font-bold text-red-900 dark:text-red-200 block">
                    🔄 Barang Pengganti / Tukar Guling (Tujuan ➔ Asal):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={exchangedProduct}
                      onChange={(e) => setExchangedProduct(e.target.value)}
                      placeholder="Nama Barang Ditukar"
                      className="col-span-2 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-700 rounded-xl px-2.5 py-1.5 font-semibold"
                    />
                    <input
                      type="number"
                      required
                      min={1}
                      value={exchangedQty}
                      onChange={(e) => setExchangedQty(parseInt(e.target.value) || 0)}
                      placeholder="Qty"
                      className="col-span-1 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-700 rounded-xl px-2.5 py-1.5 font-mono font-bold text-center"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Mutasi</label>
                <input
                  type="text"
                  placeholder="Alasan pemindahan / tukar guling persediaan..."
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-red-600/20 transition-all active:scale-95"
              >
                {transferType === 'TUKAR_GULING_BARTER' ? 'Eksekusi Tukar Guling' : 'Eksekusi Pindah Stok'}
              </button>
            </form>
          </div>

          {/* Transfer History Log */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Riwayat Mutasi & Tukar Guling Antar Outlet ({transfers.length})
            </h3>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {transfers.map((tr) => (
                <div
                  key={tr.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                        {tr.transferNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          tr.transferType === 'TUKAR_GULING_BARTER'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {tr.transferType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(tr.transferredAt).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-100">
                      {tr.sourceWarehouseName} ➔ {tr.targetWarehouseName}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Barang: <b>{tr.quantity}x {tr.productName}</b>
                    </div>
                    {tr.exchangedProductName && (
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">
                        🔄 Ditukar dengan: <b>{tr.exchangedQuantity}x {tr.exchangedProductName}</b>
                      </div>
                    )}
                    {tr.notes && (
                      <div className="text-[10px] text-slate-400 italic">Catatan: {tr.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VENDORS & AGENTS TAB */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Direktori Vendor, Roastery & Agen Pasokan ({vendors.length})
            </h3>

            <button
              onClick={() => setIsAddVendorOpen(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20"
            >
              <span>+</span>
              <span>Tambah Vendor Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                      {v.category}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {v.paymentTerms}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">{v.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">Kontak: {v.contactPerson}</div>
                  <div className="text-[11px] text-red-600 dark:text-red-400 font-mono mt-1">{v.phone}</div>
                  {v.address && <div className="text-[10px] text-slate-400 mt-1">{v.address}</div>}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-slate-400">Total Belanja:</div>
                    <div className="text-xs font-black font-mono text-slate-800 dark:text-slate-200">
                      Rp {v.totalPurchases.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      let clean = v.phone.replace(/\D/g, '');
                      if (clean.startsWith('08')) clean = '628' + clean.substring(2);
                      window.open(`https://wa.me/${clean}?text=Halo%20${encodeURIComponent(v.name)},%20kami%20ingin%20repeat%20order%20stok.`, '_blank');
                    }}
                    className="text-[10px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 px-2.5 py-1 rounded-xl font-bold"
                  >
                    💬 Chat WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pendaftaran Vendor / Agen Baru
              </h3>
              <button onClick={() => setIsAddVendorOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Perusahaan / Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Toraja Specialty Coffee"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Sales / PIC</label>
                  <input
                    type="text"
                    required
                    placeholder="Bpk. Hendra"
                    value={vContact}
                    onChange={(e) => setVContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Pasokan</label>
                  <select
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="Green Beans & Kopi">Green Beans & Kopi</option>
                    <option value="Dairy & Susu">Dairy & Susu</option>
                    <option value="Sirup & Flavor">Sirup & Flavor</option>
                    <option value="Packaging & Cup">Packaging & Cup</option>
                    <option value="Pastry & Bakery">Pastry & Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Termin Pembayaran</label>
                  <select
                    value={vTerms}
                    onChange={(e) => setVTerms(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="CASH">CASH (Langsung)</option>
                    <option value="TOP_14">TOP 14 Hari</option>
                    <option value="TOP_30">TOP 30 Hari</option>
                    <option value="TOP_60">TOP 60 Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Gudang / Kantor</label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap supplier..."
                  value={vAddress}
                  onChange={(e) => setVAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Simpan Vendor Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
