'use client';

import React, { useState, useRef } from 'react';
import {
  useInventoryStore,
  VendorAgent,
  ProductCategory,
  InventoryItem,
  PurchaseInbound,
  PurchaseInboundItem,
} from '../../stores/useInventoryStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../../stores/useToastStore';

export const InventoryManagementView: React.FC = () => {
  const {
    categories,
    products,
    vendors,
    inbounds,
    transfers,
    addCategory,
    addProductWithStock,
    addVendor,
    addPurchaseInbound,
    addBatchPurchaseInbound,
    createStockTransfer,
  } = useInventoryStore();

  const { availableWarehouses } = useTenantStore();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'catalog' | 'restock' | 'inbound_history' | 'transfer' | 'vendors'>('catalog');
  const [restockFlowMode, setRestockFlowMode] = useState<'existing_quick' | 'category_first' | 'batch_inbound'>('existing_quick');
  const [velocityFilter, setVelocityFilter] = useState<'all' | 'fast_moving' | 'slow_moving' | 'dead_stock'>('all');

  // Selected Inbound Detail Modal State
  const [selectedInboundDetail, setSelectedInboundDetail] = useState<PurchaseInbound | null>(null);
  const [selectedVendorDetail, setSelectedVendorDetail] = useState<VendorAgent | null>(null);

  // MODE 1: EXISTING PRODUCT RESTOCK
  const [selectedExistingProdId, setSelectedExistingProdId] = useState(products[0]?.id || '');
  const [existingQty, setExistingQty] = useState<number>(20);
  const [existingUnitCost, setExistingUnitCost] = useState<number>(45000);
  const [existingVendorId, setExistingVendorId] = useState(vendors[0]?.id || '');
  const [existingWarehouseId, setExistingWarehouseId] = useState(availableWarehouses[0]?.id || 'wh-01');
  const [existingInvoiceNo, setExistingInvoiceNo] = useState(`INV-SUP-${Date.now().toString().slice(-4)}`);
  const [existingPhoto, setExistingPhoto] = useState<string>('');
  const [existingPdfName, setExistingPdfName] = useState<string>('');
  const [existingPdfData, setExistingPdfData] = useState<string>('');
  const [existingNotes, setExistingNotes] = useState('');

  // MODE 2: CATEGORY FIRST NEW PRODUCT
  const [newCatId, setNewCatId] = useState(categories[0]?.id || 'cat-01');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatCode, setNewCatCode] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdUom, setNewProdUom] = useState('PCS');
  const [newProdSellingPrice, setNewProdSellingPrice] = useState<number>(35000);
  const [newProdStandardCost, setNewProdStandardCost] = useState<number>(15000);
  const [newProdInitialStock, setNewProdInitialStock] = useState<number>(50);
  const [newProdMinStock, setNewProdMinStock] = useState<number>(10);
  const [newProdEmoji, setNewProdEmoji] = useState('📦');
  const [newProdWarehouseId, setNewProdWarehouseId] = useState('wh-01');
  const [newProdVendorId, setNewProdVendorId] = useState(vendors[0]?.id || '');
  const [newProdInvoiceNo, setNewProdInvoiceNo] = useState(`INV-INIT-${Date.now().toString().slice(-4)}`);

  // MODE 3: BATCH INBOUND ITEMS
  const [batchVendorId, setBatchVendorId] = useState(vendors[0]?.id || '');
  const [batchWarehouseId, setBatchWarehouseId] = useState('wh-01');
  const [batchInvoiceNo, setBatchInvoiceNo] = useState(`INV-BATCH-${Date.now().toString().slice(-4)}`);
  const [batchItems, setBatchItems] = useState<PurchaseInboundItem[]>([
    { productId: products[0]?.id || 'p-1', productName: products[0]?.name || 'Roasted Beans 250g', quantity: 10, unitCost: 45000, subtotalCost: 450000 },
  ]);

  // Transfer State
  const [transferType, setTransferType] = useState<'TRANSFER_BIASA' | 'TUKAR_GULING_BARTER'>('TRANSFER_BIASA');
  const [srcWarehouseId, setSrcWarehouseId] = useState('wh-01');
  const [tgtWarehouseId, setTgtWarehouseId] = useState('wh-02');
  const [transferProduct, setTransferProduct] = useState(products[0]?.name || 'Roasted Beans Aceh Gayo 250g');
  const [transferQty, setTransferQty] = useState<number>(10);
  const [exchangedProduct, setExchangedProduct] = useState(products[1]?.name || 'Cold Brew Bottle 250ml');
  const [exchangedQty, setExchangedQty] = useState<number>(10);
  const [transferNotes, setTransferNotes] = useState('');

  // Add Vendor State
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [vName, setVName] = useState('');
  const [vContact, setVContact] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vCategory, setVCategory] = useState<VendorAgent['category']>('Green Beans & Kopi');
  const [vTerms, setVTerms] = useState<VendorAgent['paymentTerms']>('TOP_14');
  const [vAddress, setVAddress] = useState('');

  // Add Warehouse & Trial Mode State
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] = useState(false);
  const [isWarehouseTrialMode, setIsWarehouseTrialMode] = useState(false);
  const [newWhName, setNewWhName] = useState('');
  const [newWhCode, setNewWhCode] = useState('');
  const [newWhBranchId, setNewWhBranchId] = useState('br-01');
  const [newWhCosting, setNewWhCosting] = useState<'moving_average' | 'fifo' | 'standard'>('moving_average');

  // Search & Filters in Catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setExistingPhoto(reader.result);
        toast.info('Foto Produk Diunggah', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExistingPdfName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setExistingPdfData(reader.result);
        toast.success('Faktur PDF Diunggah', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Mode 1: Quick Existing Restock
  const handleQuickRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedExistingProdId);
    if (!prod) return;

    const vendor = vendors.find((v) => v.id === existingVendorId);
    const wh = availableWarehouses.find((w) => w.id === existingWarehouseId) || { name: 'Gudang Utama Barista GI' };

    addPurchaseInbound({
      invoiceNumber: existingInvoiceNo,
      vendorId: existingVendorId,
      vendorName: vendor?.name || 'Supplier Utama',
      warehouseId: existingWarehouseId,
      warehouseName: wh.name,
      productId: prod.id,
      productName: prod.name,
      quantity: existingQty,
      unitCost: existingUnitCost,
      totalCost: existingQty * existingUnitCost,
      items: [{ productId: prod.id, productName: prod.name, quantity: existingQty, unitCost: existingUnitCost, subtotalCost: existingQty * existingUnitCost }],
      photoUrl: existingPhoto,
      invoicePdfName: existingPdfName,
      invoicePdfDataUrl: existingPdfData,
      notes: existingNotes,
    });

    toast.success('Stok Berhasil Masuk', `+${existingQty} ${prod.uom} ${prod.name}`);
    setActiveTab('inbound_history');
  };

  // Submit Mode 2: Category First New Product Creation
  const handleCategoryFirstSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCatId = newCatId;
    let finalCatName = categories.find((c) => c.id === newCatId)?.name || 'Kopi & Espresso';

    if (isCreatingNewCategory && newCatName) {
      const createdCat = addCategory({
        name: newCatName,
        code: newCatCode || `CAT-${Date.now().toString().slice(-3)}`,
        icon: newCatIcon || '📦',
      });
      finalCatId = createdCat.id;
      finalCatName = createdCat.name;
    }

    const autoSku = newProdSku || `SKU-${finalCatName.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const autoBarcode = newProdBarcode || `899${Date.now().toString().slice(-7)}`;

    const vendor = vendors.find((v) => v.id === newProdVendorId);
    const wh = availableWarehouses.find((w) => w.id === newProdWarehouseId) || { name: 'Gudang Utama Barista GI' };

    addProductWithStock(
      {
        categoryId: finalCatId,
        categoryName: finalCatName,
        name: newProdName,
        sku: autoSku,
        barcode: autoBarcode,
        uom: newProdUom,
        sellingPrice: newProdSellingPrice,
        standardCost: newProdStandardCost,
        stockOnHand: newProdInitialStock,
        minStockLevel: newProdMinStock,
        imageEmoji: newProdEmoji,
      },
      newProdInitialStock > 0
        ? {
            vendorId: newProdVendorId,
            vendorName: vendor?.name || 'Supplier Utama',
            warehouseId: newProdWarehouseId,
            warehouseName: wh.name,
            invoiceNumber: newProdInvoiceNo,
            notes: 'Pemasukan stok awal produk baru',
          }
        : undefined
    );

    toast.success('Produk & Stok Terdaftar', `${newProdName} (${finalCatName})`);
    setActiveTab('catalog');
    setNewProdName('');
    setIsCreatingNewCategory(false);
  };

  // Submit Mode 3: Batch Multi-Item Restock
  const handleBatchRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === batchVendorId);
    const wh = availableWarehouses.find((w) => w.id === batchWarehouseId) || { name: 'Gudang Utama Barista GI' };

    addBatchPurchaseInbound(
      batchInvoiceNo,
      batchVendorId,
      vendor?.name || 'Supplier Utama',
      batchWarehouseId,
      wh.name,
      batchItems,
      existingPdfName,
      existingPdfData,
      'Batch restock faktur multi-item'
    );

    toast.success('Batch Restock Berhasil', `${batchItems.length} barang masuk gudang.`);
    setActiveTab('inbound_history');
  };

  // Filtered Products for Catalog with Velocity
  const filteredCatalog = products.filter((p) => {
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.barcode.includes(catalogSearch);

    let matchesVelocity = true;
    if (velocityFilter === 'fast_moving') {
      matchesVelocity = p.stockOnHand >= 30;
    } else if (velocityFilter === 'slow_moving') {
      matchesVelocity = p.stockOnHand >= 10 && p.stockOnHand < 30;
    } else if (velocityFilter === 'dead_stock') {
      matchesVelocity = p.stockOnHand < 10 || p.stockOnHand <= p.minStockLevel;
    }

    return matchesCat && matchesSearch && matchesVelocity;
  });

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📦</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Manajemen Persediaan Gudang & Supply Chain (SCM)
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Multi-Warehouse Core
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Riwayat belanja multi-item per supplier/faktur, bukti belanja foto/PDF, 3 alur tambah barang, dan mutasi gudang.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              setIsWarehouseTrialMode(!isWarehouseTrialMode);
              if (!isWarehouseTrialMode) {
                toast.info('Mode Trial Gudang Diaktifkan', 'Simulasi 14 hari aktif. Eksplorasi multi-gudang tanpa merusak stok riil.');
              } else {
                toast.info('Mode Trial Gudang Dinonaktifkan', 'Kembali ke mode operasional live gudang.');
              }
            }}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-sm ${
              isWarehouseTrialMode
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-cyan-500/20 ring-1 ring-cyan-500'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>🧪</span>
            <span>Trial Gudang: {isWarehouseTrialMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddWarehouseModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2.5 rounded-2xl text-xs shadow-sm flex items-center space-x-1.5"
          >
            <span>🏭</span>
            <span>+ Gudang Baru</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('restock');
              setRestockFlowMode('existing_quick');
            }}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-red-600/20 active:scale-95 flex items-center space-x-1.5"
          >
            <span>+</span>
            <span>Tambah Barang / Stok Baru</span>
          </button>
        </div>
      </div>

      {/* WAREHOUSE TRIAL BANNER */}
      {isWarehouseTrialMode && (
        <div className="p-3.5 bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 rounded-2xl flex items-center justify-between text-xs text-cyan-300 shadow-md">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">🧪</span>
            <div>
              <div className="font-bold flex items-center space-x-1.5">
                <span>Mode Trial Gudang & Multi-Warehouse Sandbox (14 Hari Bebas Akses)</span>
                <span className="bg-cyan-400/20 text-cyan-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                  SIMULASI AKTIF
                </span>
              </div>
              <p className="text-[11px] text-cyan-400/80 mt-0.5">
                Anda dapat menambahkan gudang konsinyasi, melakukan restock dummy, transfer tukar guling, dan audit stok opname tanpa mempengaruhi saldo fisik outlet riil.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsWarehouseTrialMode(false)}
            className="text-cyan-400 hover:text-cyan-200 font-bold text-xs underline whitespace-nowrap ml-4"
          >
            Tutup Trial
          </button>
        </div>
      )}

      {/* 2. TABS SWITCHER */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            activeTab === 'catalog'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>📦</span>
          <span>Katalog Barang & Stok ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inbound_history')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            activeTab === 'inbound_history'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🧾</span>
          <span>Riwayat Belanja & Bukti Faktur ({inbounds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('restock')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            activeTab === 'restock'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>📥</span>
          <span>Tambah Stok Baru (3 Alur)</span>
        </button>

        <button
          onClick={() => setActiveTab('transfer')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            activeTab === 'transfer'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🔄</span>
          <span>Mutasi Gudang & Tukar Guling ({transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            activeTab === 'vendors'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🤝</span>
          <span>Direktori Vendor & Seller ({vendors.length})</span>
        </button>
      </div>

      {/* RBAC ROLE CHECK BANNER (KASIR & IT HANYA BISA BACA) */}
      {(currentUser.role === 'cashier' || (currentUser.role as string) === 'staff_it') && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
          <div className="flex items-center space-x-2">
            <span>🛡️</span>
            <span>
              <b>Mode Akses Terbatas (Role {currentUser.role.replace('_', ' ').toUpperCase()}):</b> Anda hanya memiliki izin membaca status persediaan. Penambahan barang, restock faktur, dan transfer antar gudang hanya dapat diubah oleh <b>Staf Gudang (SCM)</b> & <b>Manajer Cabang</b>.
            </span>
          </div>
          <span className="text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded font-mono font-bold">
            READ-ONLY
          </span>
        </div>
      )}

      {/* 3. TAB 1: CATALOG CONTENT */}
      {activeTab === 'catalog' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          {/* Search, Category & Velocity Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari nama produk, SKU, barcode..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500 w-full sm:w-60"
              />

              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
              >
                <option value="all">Semua Kategori ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              {/* STOCK VELOCITY SELECTOR (FAST / SLOW / DEAD STOCK) */}
              <div className="flex space-x-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
                {[
                  { id: 'all', label: 'Semua Stok' },
                  { id: 'fast_moving', label: '🔥 Fast Moving' },
                  { id: 'slow_moving', label: '⏳ Slow Moving' },
                  { id: 'dead_stock', label: '💀 Dead Stock / Kritis' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVelocityFilter(v.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      velocityFilter === v.id
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Total {filteredCatalog.length} SKU Terdaftar
            </div>
          </div>

          {/* Catalog Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="pb-3">Produk</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">SKU / Barcode</th>
                  <th className="pb-3 text-right">Harga Jual</th>
                  <th className="pb-3 text-right">HPP Standar</th>
                  <th className="pb-3 text-right">Margin Laba</th>
                  <th className="pb-3 text-center">Stok Gudang</th>
                  <th className="pb-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCatalog.map((p) => {
                  const marginPct =
                    p.sellingPrice > 0 ? Math.round(((p.sellingPrice - p.standardCost) / p.sellingPrice) * 100) : 0;
                  const isLow = p.stockOnHand <= p.minStockLevel;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 flex items-center space-x-2.5">
                        <span className="text-2xl">{p.imageEmoji}</span>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Satuan: {p.uom}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-400">
                          {p.categoryName}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-slate-500">
                        <div>SKU: {p.sku}</div>
                        <div>Barcode: {p.barcode}</div>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-red-600 dark:text-red-400">
                        Rp {p.sellingPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-right font-mono text-slate-500">
                        Rp {p.standardCost.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {marginPct}%
                      </td>
                      <td className="py-3 text-center font-mono">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                            isLow
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {p.stockOnHand} {p.uom} {isLow && '⚠️ Sisa Sedikit'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedExistingProdId(p.id);
                            setExistingUnitCost(p.standardCost);
                            setRestockFlowMode('existing_quick');
                            setActiveTab('restock');
                          }}
                          className="bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-xl font-bold text-xs"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB 2: INBOUND PURCHASE HISTORY & MULTI-ITEM PROOF DETAIL */}
      {activeTab === 'inbound_history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>🧾</span>
                <span>Riwayat Pembelian & Pemasukan Stok Terakhir dari Supplier</span>
              </h3>
              <p className="text-xs text-slate-400">
                Buka faktur untuk melihat daftar seluruh item belanja, waktu transaksi, dan bukti dokumen/foto fisik.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {inbounds.map((inb) => (
              <div
                key={inb.id}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-red-500/50 transition-all text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">
                      {inb.invoiceNumber}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      🏢 {inb.vendorName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    📦 <b>{inb.productName}</b> • Total Qty: <b>{inb.quantity} unit</b>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    📍 {inb.warehouseName} • Diterima: {new Date(inb.receivedAt).toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">Total Faktur:</span>
                    <span className="text-sm font-black text-red-600 dark:text-red-400">
                      Rp {inb.totalCost.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInboundDetail(inb)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-md shadow-red-600/20 active:scale-95 flex items-center space-x-1.5"
                  >
                    <span>🔍</span>
                    <span>Buka Rincian Belanja</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: RESTOCK & ADD PRODUCT (3 MODES) */}
      {activeTab === 'restock' && (
        <div className="space-y-4">
          {/* FLOW MODE SWITCHER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setRestockFlowMode('existing_quick')}
              className={`p-4 rounded-3xl border text-left space-y-1 transition-all ${
                restockFlowMode === 'existing_quick'
                  ? 'bg-red-50 dark:bg-red-950/50 border-red-500 shadow-md ring-1 ring-red-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚡</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  1. Tambah Stok Cepat dari Katalog
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilih barang yang sudah ada di sistem dan langsung masukkan jumlah restock & faktur.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRestockFlowMode('category_first')}
              className={`p-4 rounded-3xl border text-left space-y-1 transition-all ${
                restockFlowMode === 'category_first'
                  ? 'bg-red-50 dark:bg-red-950/50 border-red-500 shadow-md ring-1 ring-red-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">🥐</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  2. Buat Barang Baru (Pilih Kategori)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Alur ala Olsera: Pilih/buat kategori dulu, isi detail harga & HPP, lalu input stok awal.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRestockFlowMode('batch_inbound')}
              className={`p-4 rounded-3xl border text-left space-y-1 transition-all ${
                restockFlowMode === 'batch_inbound'
                  ? 'bg-red-50 dark:bg-red-950/50 border-red-500 shadow-md ring-1 ring-red-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">📋</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  3. Restock Masal (1 Faktur Multi-Item)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pemasukan beberapa jenis barang sekaligus dalam 1 nota/surat jalan supplier.
              </p>
            </button>
          </div>

          {/* FLOW FORM 1: QUICK RESTOCK EXISTING ITEM */}
          {restockFlowMode === 'existing_quick' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>⚡</span>
                <span>Pemasukan Stok Barang dari Katalog yang Sudah Terdaftar</span>
              </h3>

              <form onSubmit={handleQuickRestockSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Produk</label>
                    <select
                      value={selectedExistingProdId}
                      onChange={(e) => {
                        setSelectedExistingProdId(e.target.value);
                        const p = products.find((x) => x.id === e.target.value);
                        if (p) setExistingUnitCost(p.standardCost);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.imageEmoji} {p.name} (Stok Saat Ini: {p.stockOnHand} {p.uom})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Masuk (Qty)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={existingQty}
                      onChange={(e) => setExistingQty(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Beli / HPP Satuan (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={existingUnitCost}
                      onChange={(e) => setExistingUnitCost(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Nilai Pembelian (Rp)</label>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-black text-red-600 dark:text-red-400">
                      Rp {(existingQty * existingUnitCost).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor / Agen Supplier</label>
                    <select
                      value={existingVendorId}
                      onChange={(e) => setExistingVendorId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Cabang Tujuan</label>
                    <select
                      value={existingWarehouseId}
                      onChange={(e) => setExistingWarehouseId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      {availableWarehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor Faktur / Invoice</label>
                    <input
                      type="text"
                      required
                      value={existingInvoiceNo}
                      onChange={(e) => setExistingInvoiceNo(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Foto Fisik Barang:</span>
                      <span className="text-[10px] text-slate-400">
                        {existingPhoto ? '✓ Foto berhasil diunggah' : 'Upload foto saat unboxing barang'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 px-3 py-1.5 rounded-xl font-bold text-xs"
                    >
                      {existingPhoto ? 'Ganti Foto' : '📷 Upload Foto'}
                    </button>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Dokumen Faktur (PDF):</span>
                      <span className="text-[10px] text-slate-400">
                        {existingPdfName ? `📄 ${existingPdfName}` : 'Lampirkan PDF invoice supplier'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 px-3 py-1.5 rounded-xl font-bold text-xs"
                    >
                      {existingPdfName ? 'Ganti PDF' : '📄 Upload PDF'}
                    </button>
                    <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    Simpan & Tambah Stok Masuk
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FLOW FORM 2: CATEGORY-FIRST NEW PRODUCT CREATION */}
          {restockFlowMode === 'category_first' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>🥐</span>
                <span>Buat Barang Baru Mulai dari Kategori (Alur Olsera / Moka Modern)</span>
              </h3>

              <form onSubmit={handleCategoryFirstSubmit} className="space-y-4 text-xs">
                {/* STEP 1: CATEGORY SELECTION OR CREATION */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Langkah 1: Pilih atau Buat Kategori Produk
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewCategory(!isCreatingNewCategory)}
                      className="text-red-600 dark:text-red-400 font-bold hover:underline"
                    >
                      {isCreatingNewCategory ? '← Gunakan Kategori yang Ada' : '+ Buat Kategori Baru'}
                    </button>
                  </div>

                  {!isCreatingNewCategory ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewCatId(cat.id)}
                          className={`p-3 rounded-xl border text-center font-bold transition-all ${
                            newCatId === cat.id
                              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xl block mb-1">{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Nama Kategori Baru</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Aneka Jus & Smoothies"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Ikon / Emoji Kategori</label>
                        <input
                          type="text"
                          placeholder="🍹"
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-center text-base"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Kode Kategori</label>
                        <input
                          type="text"
                          placeholder="BEV-JUS"
                          value={newCatCode}
                          onChange={(e) => setNewCatCode(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP 2: PRODUCT IDENTITY & PRICING */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Langkah 2: Detail Identitas Barang & Penetapan Harga
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Produk Barang</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Mango Tango Smoothie"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Satuan Satuan (UOM)</label>
                      <select
                        value={newProdUom}
                        onChange={(e) => setNewProdUom(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                      >
                        <option value="CUP">CUP (Gelas)</option>
                        <option value="PCS">PCS (Pieces)</option>
                        <option value="PORTION">PORTION (Porsi)</option>
                        <option value="BOTTLE">BOTTLE (Botol)</option>
                        <option value="BAG">BAG (Bungkus 250g/1kg)</option>
                        <option value="KG">KG (Kilogram)</option>
                        <option value="LITER">LITER</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ikon / Emoji Produk</label>
                      <input
                        type="text"
                        placeholder="🥭"
                        value={newProdEmoji}
                        onChange={(e) => setNewProdEmoji(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-center text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Jual Konsumen (Rp)</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={newProdSellingPrice}
                        onChange={(e) => setNewProdSellingPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-red-600 dark:text-red-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">HPP Standar / Modal (Rp)</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={newProdStandardCost}
                        onChange={(e) => setNewProdStandardCost(parseInt(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estimasi Margin Laba</label>
                      <div className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {newProdSellingPrice > 0
                          ? `${Math.round(((newProdSellingPrice - newProdStandardCost) / newProdSellingPrice) * 100)}% (Rp ${(newProdSellingPrice - newProdStandardCost).toLocaleString('id-ID')})`
                          : '0%'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 3: INITIAL STOCK & WAREHOUSE ALLOCATION */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Langkah 3: Stok Awal & Alokasi Gudang Cabang
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stok Awal Masuk</label>
                      <input
                        type="number"
                        min={0}
                        value={newProdInitialStock}
                        onChange={(e) => setNewProdInitialStock(parseInt(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Batas Minimum Stok (Alert)</label>
                      <input
                        type="number"
                        min={1}
                        value={newProdMinStock}
                        onChange={(e) => setNewProdMinStock(parseInt(e.target.value) || 1)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Cabang</label>
                      <select
                        value={newProdWarehouseId}
                        onChange={(e) => setNewProdWarehouseId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                      >
                        {availableWarehouses.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor Pembelian</label>
                      <select
                        value={newProdVendorId}
                        onChange={(e) => setNewProdVendorId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                      >
                        {vendors.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    Simpan Produk & Masukkan ke Katalog
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FLOW FORM 3: BATCH MULTI-ITEM RESTOCK */}
          {restockFlowMode === 'batch_inbound' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>📋</span>
                <span>Restock Masal Multi-Item (1 Faktur Pembelian Supplier)</span>
              </h3>

              <form onSubmit={handleBatchRestockSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor Supplier</label>
                    <select
                      value={batchVendorId}
                      onChange={(e) => setBatchVendorId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Penerima</label>
                    <select
                      value={batchWarehouseId}
                      onChange={(e) => setBatchWarehouseId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      {availableWarehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. Faktur / Invoice</label>
                    <input
                      type="text"
                      required
                      value={batchInvoiceNo}
                      onChange={(e) => setBatchInvoiceNo(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Batch Items List */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Daftar Item dalam Faktur ({batchItems.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setBatchItems([
                          ...batchItems,
                          {
                            productId: products[0]?.id || 'p-1',
                            productName: products[0]?.name || 'Roasted Beans 250g',
                            quantity: 10,
                            unitCost: 45000,
                            subtotalCost: 450000,
                          },
                        ])
                      }
                      className="text-red-600 dark:text-red-400 font-bold hover:underline"
                    >
                      + Tambah Baris Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {batchItems.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="col-span-5">
                          <select
                            value={item.productId}
                            onChange={(e) => {
                              const found = products.find((p) => p.id === e.target.value);
                              const updated = [...batchItems];
                              updated[idx] = {
                                ...updated[idx],
                                productId: e.target.value,
                                productName: found ? found.name : item.productName,
                                unitCost: found ? found.standardCost : item.unitCost,
                                subtotalCost: (found ? found.standardCost : item.unitCost) * updated[idx].quantity,
                              };
                              setBatchItems(updated);
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold text-xs"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <input
                            type="number"
                            min={1}
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => {
                              const q = parseInt(e.target.value) || 1;
                              const updated = [...batchItems];
                              updated[idx] = {
                                ...updated[idx],
                                quantity: q,
                                subtotalCost: q * updated[idx].unitCost,
                              };
                              setBatchItems(updated);
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-mono font-bold text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <input
                            type="number"
                            min={0}
                            placeholder="HPP (Rp)"
                            value={item.unitCost}
                            onChange={(e) => {
                              const c = parseInt(e.target.value) || 0;
                              const updated = [...batchItems];
                              updated[idx] = {
                                ...updated[idx],
                                unitCost: c,
                                subtotalCost: updated[idx].quantity * c,
                              };
                              setBatchItems(updated);
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-mono font-bold text-xs"
                          />
                        </div>

                        <div className="col-span-2 text-right font-mono font-bold text-red-600 dark:text-red-400 text-xs">
                          Rp {item.subtotalCost.toLocaleString('id-ID')}
                        </div>

                        <div className="col-span-1 text-center">
                          {batchItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setBatchItems(batchItems.filter((_, i) => i !== idx))}
                              className="text-rose-500 font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center font-bold text-xs">
                    <span>Total Keseluruhan Faktur:</span>
                    <span className="font-mono text-base font-black text-red-600 dark:text-red-400">
                      Rp {batchItems.reduce((s, i) => s + i.subtotalCost, 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    Proses Restock Masal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: TRANSFER & INTER-WAREHOUSE BARTER */}
      {activeTab === 'transfer' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <span>🔄</span>
            <span>Mutasi Stok & Tukar Guling Antar Gudang Cabang (1 Brand)</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transfer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const src = availableWarehouses.find((w) => w.id === srcWarehouseId);
                const tgt = availableWarehouses.find((w) => w.id === tgtWarehouseId);

                createStockTransfer({
                  transferNumber: `TRF-${Date.now().toString().slice(-4)}`,
                  transferType,
                  sourceWarehouseId: srcWarehouseId,
                  sourceWarehouseName: src?.name || 'Gudang Asal',
                  targetWarehouseId: tgtWarehouseId,
                  targetWarehouseName: tgt?.name || 'Gudang Tujuan',
                  productId: 'prod-012',
                  productName: transferProduct,
                  quantity: transferQty,
                  exchangedProductId: transferType === 'TUKAR_GULING_BARTER' ? 'prod-006' : undefined,
                  exchangedProductName: transferType === 'TUKAR_GULING_BARTER' ? exchangedProduct : undefined,
                  exchangedQuantity: transferType === 'TUKAR_GULING_BARTER' ? exchangedQty : undefined,
                  status: 'COMPLETED',
                  notes: transferNotes,
                });

                toast.success('Mutasi Berhasil', `${transferProduct} dipindahkan ke ${tgt?.name}`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Mutasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferType('TRANSFER_BIASA')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      transferType === 'TRANSFER_BIASA'
                        ? 'bg-red-600 text-white border-red-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Transfer Stok Biasa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('TUKAR_GULING_BARTER')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      transferType === 'TUKAR_GULING_BARTER'
                        ? 'bg-red-600 text-white border-red-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🔄 Tukar Guling (Barter)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Asal</label>
                  <select
                    value={srcWarehouseId}
                    onChange={(e) => setSrcWarehouseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                  >
                    {availableWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang Tujuan</label>
                  <select
                    value={tgtWarehouseId}
                    onChange={(e) => setTgtWarehouseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                  >
                    {availableWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Produk yang Dikirim</label>
                  <input
                    type="text"
                    value={transferProduct}
                    onChange={(e) => setTransferProduct(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={transferQty}
                    onChange={(e) => setTransferQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              {transferType === 'TUKAR_GULING_BARTER' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 space-y-2">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">
                    🔄 Produk Pengganti Tukar Guling:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={exchangedProduct}
                        onChange={(e) => setExchangedProduct(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-1.5 font-semibold"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min={1}
                        value={exchangedQty}
                        onChange={(e) => setExchangedQty(parseInt(e.target.value) || 1)}
                        className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-1.5 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-2xl shadow-md"
              >
                Kirim Mutasi Stok
              </button>
            </form>

            {/* Transfer History */}
            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
                Riwayat Mutasi & Barter ({transfers.length})
              </span>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {transfers.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{t.transferNumber}</span>
                      <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <b>{t.quantity}x {t.productName}</b> dari <i>{t.sourceWarehouseName}</i> ➔ <i>{t.targetWarehouseName}</i>
                    </div>
                    {t.exchangedProductName && (
                      <div className="text-[10px] text-amber-600 font-mono">
                        🔄 Barter dengan: {t.exchangedQuantity}x {t.exchangedProductName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: VENDORS DIRECTORY & PURCHASE HISTORY */}
      {activeTab === 'vendors' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Direktori Vendor, Seller & Rekap Belanja Supplier
              </h3>
              <p className="text-xs text-slate-400">Manajemen kontrak supplier, kontak agen, dan riwayat belanja faktur.</p>
            </div>
            <button
              onClick={() => setIsAddVendorOpen(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md"
            >
              + Tambah Vendor Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vendors.map((v) => {
              const vendorInbounds = inbounds.filter((i) => i.vendorId === v.id || i.vendorName === v.name);

              return (
                <div
                  key={v.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{v.name}</h4>
                      <div className="text-[11px] text-slate-500">PIC: {v.contactPerson}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {v.paymentTerms}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono space-y-0.5">
                    <div>📱 {v.phone}</div>
                    {v.email && <div>✉️ {v.email}</div>}
                    {v.address && <div>📍 {v.address}</div>}
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Riwayat Transaksi:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">{vendorInbounds.length} Faktur Pembelian</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedVendorDetail(v)}
                      className="text-red-600 dark:text-red-400 font-bold hover:underline text-[11px]"
                    >
                      📋 Buka Riwayat Belanja
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://wa.me/62${v.phone.replace(/^0/, '')}?text=Halo%20${v.contactPerson}%20dari%20${v.name},%20kami%20ingin%20reorder%20stok.`, '_blank');
                      }}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline text-[11px]"
                    >
                      💬 Order via WA
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL INBOUND DETAIL (STOK TERAKHIR & BUKTI BELANJA) */}
      {selectedInboundDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🧾</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Rincian Belanja Faktur: {selectedInboundDetail.invoiceNumber}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Diterima pada {new Date(selectedInboundDetail.receivedAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedInboundDetail(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            {/* Vendor & Warehouse Info */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Vendor Supplier:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                  🏢 {selectedInboundDetail.vendorName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Gudang Penerima:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                  📍 {selectedInboundDetail.warehouseName}
                </span>
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                Daftar Barang yang Dibelanjakan
              </span>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 uppercase text-[9px]">
                    <tr>
                      <th className="p-2.5 font-sans">Nama Barang</th>
                      <th className="p-2.5 text-center">Jumlah</th>
                      <th className="p-2.5 text-right">Harga Beli Satuan</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                    {selectedInboundDetail.items && selectedInboundDetail.items.length > 0 ? (
                      selectedInboundDetail.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-sans font-bold text-slate-800 dark:text-slate-100">
                            {it.productName}
                          </td>
                          <td className="p-2.5 text-center">{it.quantity} unit</td>
                          <td className="p-2.5 text-right">Rp {it.unitCost.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-right font-bold text-red-600 dark:text-red-400">
                            Rp {it.subtotalCost.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-2.5 font-sans font-bold text-slate-800 dark:text-slate-100">
                          {selectedInboundDetail.productName}
                        </td>
                        <td className="p-2.5 text-center">{selectedInboundDetail.quantity} unit</td>
                        <td className="p-2.5 text-right">Rp {selectedInboundDetail.unitCost.toLocaleString('id-ID')}</td>
                        <td className="p-2.5 text-right font-bold text-red-600 dark:text-red-400">
                          Rp {selectedInboundDetail.totalCost.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800/50 flex justify-between items-center">
              <span className="font-bold text-red-900 dark:text-red-200 text-xs">Total Pembelian Faktur:</span>
              <span className="text-base font-black font-mono text-red-600 dark:text-red-400">
                Rp {selectedInboundDetail.totalCost.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Proof Section (Photo & PDF) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
                Bukti Belanja & Dokumen Lampiran
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">📷 Foto Fisik Barang:</span>
                  {selectedInboundDetail.photoUrl ? (
                    <img
                      src={selectedInboundDetail.photoUrl}
                      alt="Bukti fisik"
                      className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 text-[10px]">
                      Tidak ada lampiran foto
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">📄 Dokumen Faktur (PDF):</span>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-mono">
                      {selectedInboundDetail.invoicePdfName || 'Faktur_Pembelian_Supplier.pdf'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedInboundDetail.invoicePdfDataUrl) {
                        const win = window.open();
                        win?.document.write(`<iframe src="${selectedInboundDetail.invoicePdfDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                      } else {
                        toast.info('Pratinjau Dokumen', `Membuka lampiran arsip ${selectedInboundDetail.invoiceNumber}`);
                      }
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                  >
                    <span>👁️</span>
                    <span>Buka / Pratinjau Faktur PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedInboundDetail(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-5 py-2 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VENDOR PURCHASE HISTORY */}
      {selectedVendorDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Riwayat Belanja ke Vendor: {selectedVendorDetail.name}
                </h3>
                <p className="text-[10px] text-slate-400">
                  PIC: {selectedVendorDetail.contactPerson} • {selectedVendorDetail.phone}
                </p>
              </div>
              <button onClick={() => setSelectedVendorDetail(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {inbounds.filter((i) => i.vendorId === selectedVendorDetail.id || i.vendorName === selectedVendorDetail.name).length === 0 ? (
                <div className="p-8 text-center text-slate-400">Belum ada riwayat pembelian ke vendor ini.</div>
              ) : (
                inbounds
                  .filter((i) => i.vendorId === selectedVendorDetail.id || i.vendorName === selectedVendorDetail.name)
                  .map((inb) => (
                    <div
                      key={inb.id}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-red-600 dark:text-red-400 font-mono">{inb.invoiceNumber}</div>
                        <div className="text-slate-700 dark:text-slate-300 font-semibold">{inb.productName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(inb.receivedAt).toLocaleDateString('id-ID')} • {inb.warehouseName}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-xs">Rp {inb.totalCost.toLocaleString('id-ID')}</div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVendorDetail(null);
                            setSelectedInboundDetail(inb);
                          }}
                          className="text-red-600 dark:text-red-400 font-bold text-[10px] hover:underline"
                        >
                          Lihat Bukti Belanja ➔
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedVendorDetail(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-5 py-2 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD VENDOR */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Tambah Vendor / Supplier Baru</h3>
              <button onClick={() => setIsAddVendorOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addVendor({
                  name: vName,
                  contactPerson: vContact,
                  phone: vPhone,
                  category: vCategory,
                  paymentTerms: vTerms,
                  address: vAddress,
                });
                toast.success('Vendor Terdaftar', vName);
                setIsAddVendorOpen(false);
                setVName('');
                setVContact('');
                setVPhone('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Perusahaan / Toko</label>
                <input
                  type="text"
                  required
                  placeholder="PT Roastery Mandiri"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama PIC / Kontak</label>
                  <input
                    type="text"
                    required
                    placeholder="Bpk. Hendra"
                    value={vContact}
                    onChange={(e) => setVContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
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
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Pasokan</label>
                  <select
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
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
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold font-mono"
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
                <input
                  type="text"
                  placeholder="Jakarta / Bandung / Surabaya"
                  value={vAddress}
                  onChange={(e) => setVAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                  Simpan Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH GUDANG BARU */}
      {isAddWarehouseModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏭</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Tambah Gudang / Warehouse Baru
                </h3>
              </div>
              <button onClick={() => setIsAddWarehouseModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Gudang Baru Dibuat', `${newWhName} (${newWhCode})`);
                setIsAddWarehouseModalOpen(false);
                setNewWhName('');
                setNewWhCode('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Gudang:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gudang Transit Jakarta Barat"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kode Gudang:</label>
                  <input
                    type="text"
                    required
                    placeholder="WH-JKT-03"
                    value={newWhCode}
                    onChange={(e) => setNewWhCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Metode Biaya (Costing):</label>
                  <select
                    value={newWhCosting}
                    onChange={(e) => setNewWhCosting(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
                  >
                    <option value="moving_average">Moving Average (PSAK)</option>
                    <option value="fifo">FIFO (First In First Out)</option>
                    <option value="standard">Standard Cost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alokasi Cabang Terkait:</label>
                <select
                  value={newWhBranchId}
                  onChange={(e) => setNewWhBranchId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="br-01">Outlet Grand Indonesia (Jakarta Pusat)</option>
                  <option value="br-02">Outlet Senopati (Jakarta Selatan)</option>
                  <option value="br-03">Store Kelapa Gading (Jakarta Utara)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddWarehouseModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Buat Gudang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
