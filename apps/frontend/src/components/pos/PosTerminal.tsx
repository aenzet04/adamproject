'use client';

import React, { useState, useRef } from 'react';
import { usePosCartStore } from '../../stores/usePosCartStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { usePrinterStore } from '../../stores/usePrinterStore';
import { useDensityStore } from '../../stores/useDensityStore';
import { submitPosCheckoutLive } from '../../lib/api';
import { ReceiptModal } from './ReceiptModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { SplitBillModal } from './SplitBillModal';
import type { Product, PaymentAllocation } from '../../types';

interface CategorizedProduct extends Product {
  category: 'coffee' | 'food' | 'beverage' | 'merchandise';
  imageEmoji: string;
}

const EXTENDED_PRODUCTS: CategorizedProduct[] = [
  {
    id: 'prod-001',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'coffee',
    imageEmoji: '☕',
    name: 'Espresso Single Origin Gayo',
    sku: 'BEV-ESP-01',
    barcode: '8991001001',
    productType: 'inventory',
    uomBase: 'CUP',
    sellingPrice: 28000,
    standardCost: 8500,
    trackInventory: true,
    isActive: true,
    stockOnHand: 145,
    averageCost: 8200,
  },
  {
    id: 'prod-002',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'coffee',
    imageEmoji: '🧊',
    name: 'Iced Caramel Macchiato',
    sku: 'BEV-ICM-02',
    barcode: '8991001002',
    productType: 'inventory',
    uomBase: 'CUP',
    sellingPrice: 42000,
    standardCost: 14000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 88,
    averageCost: 13500,
  },
  {
    id: 'prod-005',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'coffee',
    imageEmoji: '🥥',
    name: 'Kopi Aren Nusantara Latte',
    sku: 'BEV-KAL-05',
    barcode: '8991001005',
    productType: 'inventory',
    uomBase: 'CUP',
    sellingPrice: 35000,
    standardCost: 11000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 120,
    averageCost: 10800,
  },
  {
    id: 'prod-006',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'coffee',
    imageEmoji: '🍾',
    name: 'Cold Brew Bottle 250ml',
    sku: 'BEV-CBB-06',
    barcode: '8991001006',
    productType: 'inventory',
    uomBase: 'BOTTLE',
    sellingPrice: 38000,
    standardCost: 12500,
    trackInventory: true,
    isActive: true,
    stockOnHand: 65,
    averageCost: 12100,
  },
  {
    id: 'prod-003',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'food',
    imageEmoji: '🥐',
    name: 'Croissant Butter Paris',
    sku: 'BAK-CRP-03',
    barcode: '8991001003',
    productType: 'inventory',
    uomBase: 'PCS',
    sellingPrice: 32000,
    standardCost: 12000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 24,
    averageCost: 11800,
  },
  {
    id: 'prod-004',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'food',
    imageEmoji: '🍛',
    name: 'Nasi Goreng Wagyu Spesial',
    sku: 'FNB-NGW-04',
    barcode: '8991001004',
    productType: 'inventory',
    uomBase: 'PORTION',
    sellingPrice: 68000,
    standardCost: 28000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 40,
    averageCost: 27500,
  },
  {
    id: 'prod-007',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'food',
    imageEmoji: '🍝',
    name: 'Beef Lasagna Al Forno',
    sku: 'FNB-BLF-07',
    barcode: '8991001007',
    productType: 'inventory',
    uomBase: 'PORTION',
    sellingPrice: 58000,
    standardCost: 24000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 18,
    averageCost: 23500,
  },
  {
    id: 'prod-008',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'food',
    imageEmoji: '🍟',
    name: 'Truffle Parmesan Fries',
    sku: 'SNK-TPF-08',
    barcode: '8991001008',
    productType: 'inventory',
    uomBase: 'PORTION',
    sellingPrice: 36000,
    standardCost: 13000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 55,
    averageCost: 12500,
  },
  {
    id: 'prod-009',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'beverage',
    imageEmoji: '🍵',
    name: 'Japanese Uji Matcha Latte',
    sku: 'BEV-JML-09',
    barcode: '8991001009',
    productType: 'inventory',
    uomBase: 'CUP',
    sellingPrice: 40000,
    standardCost: 15000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 72,
    averageCost: 14600,
  },
  {
    id: 'prod-010',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'beverage',
    imageEmoji: '🍋',
    name: 'Sparkling Yuzu Lemonade',
    sku: 'BEV-SYL-10',
    barcode: '8991001010',
    productType: 'inventory',
    uomBase: 'CUP',
    sellingPrice: 34000,
    standardCost: 11000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 90,
    averageCost: 10500,
  },
  {
    id: 'prod-011',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'beverage',
    imageEmoji: '🧋',
    name: 'Earl Grey Milk Tea with Boba',
    sku: 'BEV-EGM-11',
    barcode: '8991001011',
    productType: 'inventory',
    uomBase: 'CUP',
    sellingPrice: 38000,
    standardCost: 13500,
    trackInventory: true,
    isActive: true,
    stockOnHand: 60,
    averageCost: 13200,
  },
  {
    id: 'prod-012',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'merchandise',
    imageEmoji: '🫘',
    name: 'Roasted Beans Aceh Gayo 250g',
    sku: 'RET-RBG-12',
    barcode: '8991001012',
    productType: 'inventory',
    uomBase: 'BAG',
    sellingPrice: 95000,
    standardCost: 45000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 35,
    averageCost: 44000,
  },
  {
    id: 'prod-013',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'merchandise',
    imageEmoji: '🥤',
    name: 'Stainless Tumbler 500ml Emerald',
    sku: 'RET-STE-13',
    barcode: '8991001013',
    productType: 'inventory',
    uomBase: 'PCS',
    sellingPrice: 185000,
    standardCost: 85000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 15,
    averageCost: 82000,
  },
  {
    id: 'prod-014',
    tenantId: 'tenant-1',
    brandId: 'brand-1',
    category: 'merchandise',
    imageEmoji: '🛍️',
    name: 'Canvas Tote Bag Nusantara Edition',
    sku: 'RET-TBN-14',
    barcode: '8991001014',
    productType: 'inventory',
    uomBase: 'PCS',
    sellingPrice: 75000,
    standardCost: 28000,
    trackInventory: true,
    isActive: true,
    stockOnHand: 42,
    averageCost: 27000,
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Semua Produk', icon: '⚡' },
  { id: 'coffee', name: 'Kopi & Espresso', icon: '☕' },
  { id: 'food', name: 'Makanan & Pastry', icon: '🍽️' },
  { id: 'beverage', name: 'Teh & Non-Coffee', icon: '🍵' },
  { id: 'merchandise', name: 'Retail & Merch', icon: '🛍️' },
] as const;

export const PosTerminal: React.FC = () => {
  const {
    items,
    customerName,
    tableNumber,
    addItem,
    updateQuantity,
    setCustomerInfo,
    getSubtotal,
    getTotalDiscount,
    getTaxAmount,
    getServiceChargeAmount,
    getRoundingAmount,
    getGrandTotal,
    clearCart,
    holdOrder,
    heldOrders,
    restoreHeldOrder,
    payments,
    addPayment,
    removePayment,
    getTotalPaid,
    getRemainingBalance,
  } = usePosCartStore();

  const { currentBranch } = useTenantStore();
  const { connectedPrinterName, isConnecting, connectPrinter, autoPrintEnabled } = usePrinterStore();
  const { viewMode } = useDensityStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'edc_bca' | 'customer_credit'>('cash');
  const [tenderAmount, setTenderAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  const [lastCompletedOrder, setLastCompletedOrder] = useState<{
    orderNumber: string;
    customerName?: string;
    tableNumber?: string;
    items: typeof items;
    subtotal: number;
    discount: number;
    tax: number;
    serviceCharge: number;
    rounding: number;
    grandTotal: number;
    payments: typeof payments;
  } | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = EXTENDED_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const grandTotal = getGrandTotal();
  const remaining = getRemainingBalance();

  const handleOpenPayment = () => {
    setTenderAmount(remaining.toString());
    setIsPaymentModalOpen(true);
  };

  const handleAddPaymentAllocation = () => {
    const amountNum = parseFloat(tenderAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    let changeGiven = 0;
    if (paymentMethod === 'cash' && amountNum > remaining) {
      changeGiven = amountNum - remaining;
    }

    const newPayment: PaymentAllocation = {
      chartOfAccountId: `acc-${paymentMethod}`,
      paymentMethod,
      amount: amountNum,
      changeGiven,
      referenceNumber: paymentMethod !== 'cash' ? `REF-${Date.now().toString().slice(-6)}` : undefined,
    };

    addPayment(newPayment);
    setTenderAmount('0');
  };

  const handleFinalizeCheckout = async () => {
    setIsProcessing(true);

    const itemsWithNotes = items.map((it) => ({
      ...it,
      notes: itemNotes[it.productId] || it.notes,
    }));

    const payload = {
      customerName,
      tableNumber,
      items: itemsWithNotes,
      subtotalAmount: getSubtotal(),
      discountAmount: getTotalDiscount(),
      taxRate: 11.0,
      taxAmount: getTaxAmount(),
      serviceChargeAmount: getServiceChargeAmount(),
      roundingAmount: getRoundingAmount(),
      grandTotal: getGrandTotal(),
      payments,
    };

    const backendResult = await submitPosCheckoutLive(payload);
    const orderNo = backendResult?.order?.order_number || `ORD-RAILS-${Date.now().toString().slice(-6)}`;

    setLastCompletedOrder({
      orderNumber: orderNo,
      customerName,
      tableNumber,
      items: itemsWithNotes,
      subtotal: getSubtotal(),
      discount: getTotalDiscount(),
      tax: getTaxAmount(),
      serviceCharge: getServiceChargeAmount(),
      rounding: getRoundingAmount(),
      grandTotal: getGrandTotal(),
      payments: [...payments],
    });

    setIsProcessing(false);
    setIsPaymentModalOpen(false);
    clearCart();
    setItemNotes({});
    setIsReceiptOpen(true);
  };

  const handleSplitBillCompleted = (splitResults: any[]) => {
    setIsSplitBillOpen(false);
    alert(`Split Bill Berhasil Diselesaikan untuk ${splitResults.length} Konsumen!`);
    handleFinalizeCheckout();
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* LEFT SECTION: CATALOG & BARCODE */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 p-4 overflow-hidden">
        {/* Top Search, Scanner, & Bluetooth Indicator Bar */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative flex-1">
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Cari Produk / Scan Barcode [F2]..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all"
            />
            <span className="absolute right-3 top-2 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">
              ⌨️ F2
            </span>
          </div>

          {/* Backend Status Live Badge */}
          <span className="inline-flex items-center px-3 py-2 rounded-2xl text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-red-600 dark:text-red-400 shadow-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse" />
            Backend: Ruby 3001
          </span>

          {/* Optical Barcode Scanner Button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
          >
            <span>📷</span>
            <span>Scan Barcode</span>
          </button>

          {/* Direct Bluetooth 58mm Printer Button */}
          <button
            onClick={() => connectPrinter()}
            disabled={isConnecting}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 border transition-all shadow-sm ${
              connectedPrinterName
                ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/60'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-red-500">📶</span>
            <span>{connectedPrinterName ? `BT: ${connectedPrinterName.substring(0, 10)}` : 'Hubungkan BT'}</span>
            {autoPrintEnabled && connectedPrinterName && (
              <span className="text-[9px] bg-red-600 text-white px-1 rounded-full font-mono">Auto</span>
            )}
          </button>

          {heldOrders.length > 0 && (
            <button
              onClick={() => restoreHeldOrder(heldOrders[0].id)}
              className="bg-amber-50 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 px-3 py-2 rounded-2xl text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-600/30 shadow-sm"
            >
              Tersimpan ({heldOrders.length})
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? EXTENDED_PRODUCTS.length
                : EXTENDED_PRODUCTS.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 border shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white border-red-500 shadow-red-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-red-800 text-red-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pr-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addItem(product)}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 rounded-3xl p-3.5 flex flex-col justify-between text-left transition-all duration-150 active:scale-95 group relative shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-2xl mb-1">{product.imageEmoji}</span>
                  <span className="text-[10px] font-bold bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-2 py-0.5 rounded-full">
                    Stok: {product.stockOnHand}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {product.name}
                </h4>

                {viewMode === 'detailed' && (
                  <div className="mt-1 space-y-0.5 border-t border-slate-100 dark:border-slate-800 pt-1">
                    <div className="text-[9px] text-slate-400 font-mono">SKU: {product.sku}</div>
                    <div className="text-[9px] text-slate-400 font-mono">Barcode: {product.barcode}</div>
                    <div className="text-[9px] text-red-600 dark:text-red-400 font-mono">
                      Std Cost: Rp {product.standardCost.toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-baseline">
                <span className="text-sm font-black text-red-600 dark:text-red-400 font-mono">
                  Rp {product.sellingPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                  + Tambah
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION: CART */}
      <div className="w-96 lg:w-[420px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 bg-slate-50/70 dark:bg-slate-900">
          <input
            type="text"
            placeholder="Pelanggan (Walk-in)"
            value={customerName}
            onChange={(e) => setCustomerInfo(e.target.value, tableNumber)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none shadow-sm"
          />
          <input
            type="text"
            placeholder="No. Meja (F&B)"
            value={tableNumber}
            onChange={(e) => setCustomerInfo(customerName, e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Cart Item List with Kitchen Notes Input */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
              <span className="text-3xl mb-2">🛒</span>
              <span className="font-semibold text-slate-600 dark:text-slate-400">Keranjang Belanja Kosong</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Pilih item dari katalog atau scan barcode</span>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.productName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold transition-all"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold transition-all"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Optional Kitchen Note input per item */}
                <input
                  type="text"
                  placeholder="🍳 Catatan dapur (e.g. Less sugar, extra ice, pedas sedang)..."
                  value={itemNotes[item.productId] || ''}
                  onChange={(e) => setItemNotes({ ...itemNotes, [item.productId]: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-[10px] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            ))
          )}
        </div>

        {/* Calculation Summary & Split Bill Action */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono">Rp {getSubtotal().toLocaleString('id-ID')}</span>
          </div>
          {getTotalDiscount() > 0 && (
            <div className="flex justify-between text-rose-500 font-semibold">
              <span>Diskon</span>
              <span className="font-mono">- Rp {getTotalDiscount().toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>PPN (11%)</span>
            <span className="font-mono">Rp {getTaxAmount().toLocaleString('id-ID')}</span>
          </div>
          {getRoundingAmount() !== 0 && (
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Pembulatan</span>
              <span className="font-mono">Rp {getRoundingAmount().toLocaleString('id-ID')}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Total Tagihan</span>
            <span className="text-xl font-black text-red-600 dark:text-red-400 font-mono">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={() => setIsSplitBillOpen(true)}
            disabled={items.length === 0}
            className="w-full bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 py-2 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-95 mt-1"
          >
            <span>✂️</span>
            <span>Split Bill (Pisah Pembayaran 3 Mode)</span>
          </button>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={holdOrder}
              disabled={items.length === 0}
              className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-sm"
            >
              Hold Bill
            </button>
            <button
              onClick={clearCart}
              disabled={items.length === 0}
              className="bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 disabled:opacity-50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-sm"
            >
              Batal
            </button>
            <button
              onClick={handleOpenPayment}
              disabled={items.length === 0}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/20 transition-all"
            >
              Bayar [F9]
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-colors">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Multi-Payment Settlement</h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Sisa Tagihan:</span>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    Rp {remaining.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Total Terbayar:</span>
                  <div className="text-xl font-black text-red-600 dark:text-red-400 font-mono">
                    Rp {getTotalPaid().toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(['cash', 'qris', 'edc_bca', 'customer_credit'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 px-2 rounded-2xl text-xs font-bold uppercase border transition-all ${
                      paymentMethod === m
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-bold">Nominal Pembayaran (Rp)</label>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="number"
                    value={tenderAmount}
                    onChange={(e) => setTenderAmount(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-red-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={handleAddPaymentAllocation}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-2xl text-xs font-bold shadow-sm"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {payments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Rincian Pembayaran Masuk:</span>
                  {payments.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs"
                    >
                      <span className="font-bold uppercase text-slate-700 dark:text-slate-300">{p.paymentMethod}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                          Rp {p.amount.toLocaleString('id-ID')}
                          {p.changeGiven > 0 && ` (Kembali: Rp ${p.changeGiven.toLocaleString('id-ID')})`}
                        </span>
                        <button
                          onClick={() => removePayment(idx)}
                          className="text-rose-500 hover:text-rose-700 ml-2 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Kembali
              </button>
              <button
                onClick={handleFinalizeCheckout}
                disabled={remaining > 0 || isProcessing}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-red-600/20"
              >
                {isProcessing ? 'Menjurnal & Memproses...' : 'Selesaikan Transaksi (Live Rails)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSplitBillOpen && (
        <SplitBillModal
          items={items}
          grandTotal={grandTotal}
          subtotal={getSubtotal()}
          tax={getTaxAmount()}
          discount={getTotalDiscount()}
          rounding={getRoundingAmount()}
          onClose={() => setIsSplitBillOpen(false)}
          onCompleteSplit={handleSplitBillCompleted}
        />
      )}

      {isScannerOpen && (
        <BarcodeScannerModal
          products={EXTENDED_PRODUCTS}
          onProductScanned={(scannedProduct) => {
            addItem(scannedProduct);
          }}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {isReceiptOpen && lastCompletedOrder && (
        <ReceiptModal
          orderNumber={lastCompletedOrder.orderNumber}
          customerName={lastCompletedOrder.customerName}
          tableNumber={lastCompletedOrder.tableNumber}
          items={lastCompletedOrder.items}
          subtotal={lastCompletedOrder.subtotal}
          discount={lastCompletedOrder.discount}
          tax={lastCompletedOrder.tax}
          serviceCharge={lastCompletedOrder.serviceCharge}
          rounding={lastCompletedOrder.rounding}
          grandTotal={lastCompletedOrder.grandTotal}
          payments={lastCompletedOrder.payments}
          cashierName="Siti Rahma"
          branchName={currentBranch?.name || 'Outlet Grand Indonesia'}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </div>
  );
};
