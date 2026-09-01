'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePosCartStore } from '../../stores/usePosCartStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { usePrinterStore } from '../../stores/usePrinterStore';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useShiftStore } from '../../stores/useShiftStore';
import { useCartViewStore } from '../../stores/useCartViewStore';
import { toast } from '../../stores/useToastStore';
import { submitPosCheckoutLive } from '../../lib/api';
import { ReceiptModal } from './ReceiptModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { SplitBillModal } from './SplitBillModal';
import { ShiftManagementModal } from '../shifts/ShiftManagementModal';
import { TableManagementModal } from './TableManagementModal';
import { CartDisplayOptionsModal } from './CartDisplayOptionsModal';
import { PosCustomerSearchModal } from './PosCustomerSearchModal';
import { CashierPinChangeModal } from '../auth/CashierPinChangeModal';
import { useAuthStore } from '../../stores/useAuthStore';
import { useStaffStore } from '../../stores/useStaffStore';
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
    orderChannel,
    setOrderChannel,
    discountMode,
    discountValue,
    taxMode,
    taxValue,
    addItem,
    updateQuantity,
    setCustomerInfo,
    setDiscount,
    setTax,
    getSubtotal,
    getTotalDiscount,
    getTaxAmount,
    getServiceChargeAmount,
    getRoundingAmount,
    getGrandTotal,
    clearCart,
    heldOrders,
    payments,
    addPayment,
    removePayment,
    getTotalPaid,
    getRemainingBalance,
  } = usePosCartStore();

  const { currentBranch } = useTenantStore();
  const { connectedPrinterName, isConnecting, connectPrinter } = usePrinterStore();
  const { customers, addCustomer, recordPurchase } = useCustomerStore();
  const { isShiftOpen } = useShiftStore();
  const { layoutStyle, density, alwaysShowNotes, showSkuBarcode, showCogsMargin } = useCartViewStore();

  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isCustomerSearchModalOpen, setIsCustomerSearchModalOpen] = useState(false);
  const [isPinChangeModalOpen, setIsPinChangeModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCartOptionsOpen, setIsCartOptionsOpen] = useState(false);

  const { currentUser } = useAuthStore();
  const { employees } = useStaffStore();
  const currentEmployee = employees.find((e) => e.id === currentUser.id || e.email === currentUser.email);

  useEffect(() => {
    if (currentUser.role === 'cashier' && currentEmployee?.isDefaultPin) {
      setIsPinChangeModalOpen(true);
    }
  }, [currentUser, currentEmployee]);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'edc_bca' | 'customer_credit' | 'transfer_bank'>('cash');
  const [tenderAmount, setTenderAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  const [lastCompletedOrder, setLastCompletedOrder] = useState<{
    orderNumber: string;
    customerName?: string;
    tableNumber?: string;
    orderChannel?: string;
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

  // Keyboard Shortcuts: F2 for Barcode, F3 for Customer CRM, F4 for Shift, F8 for Table Hold, F9 for Payment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F3') {
        e.preventDefault();
        setIsCustomerSearchModalOpen(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        setIsShiftModalOpen(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        setIsTableModalOpen(true);
      } else if (e.key === 'F9' && items.length > 0) {
        e.preventDefault();
        handleOpenPayment();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items]);

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
      orderChannel,
      items: itemsWithNotes,
      subtotalAmount: getSubtotal(),
      discountAmount: getTotalDiscount(),
      taxRate: taxValue,
      taxAmount: getTaxAmount(),
      serviceChargeAmount: getServiceChargeAmount(),
      roundingAmount: getRoundingAmount(),
      grandTotal: getGrandTotal(),
      payments,
    };

    const backendResult = await submitPosCheckoutLive(payload);
    const orderNo = backendResult?.order?.order_number || `ORD-MODULA-${Date.now().toString().slice(-6)}`;

    const matchedCustomer = customers.find((c) => c.name === customerName);
    if (matchedCustomer) {
      recordPurchase(matchedCustomer.id, grandTotal, Math.floor(grandTotal / 10000));
    }

    setLastCompletedOrder({
      orderNumber: orderNo,
      customerName,
      tableNumber,
      orderChannel,
      items: itemsWithNotes,
      subtotal: getSubtotal(),
      discount: getTotalDiscount(),
      tax: getTaxAmount(),
      serviceCharge: getServiceChargeAmount(),
      rounding: getRoundingAmount(),
      grandTotal: getGrandTotal(),
      payments: [...payments],
    });

    toast.payment(orderNo, grandTotal);

    setIsProcessing(false);
    setIsPaymentModalOpen(false);
    clearCart();
    setItemNotes({});
    setIsReceiptOpen(true);
  };

  const handleSplitBillCompleted = () => {
    setIsSplitBillOpen(false);
    handleFinalizeCheckout();
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* MOBILE TOP TAB SWITCHER (ONLY ON SMALL SCREENS) */}
      <div className="md:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 gap-2">
        <button
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileTab === 'catalog'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          📦 Katalog Produk ({filteredProducts.length})
        </button>
        <button
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            mobileTab === 'cart'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>🛒 Keranjang ({items.length})</span>
          {items.length > 0 && (
            <span className="font-mono text-[10px] bg-red-800 text-white px-1.5 py-0.2 rounded-full">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          )}
        </button>
      </div>

      {/* LEFT SECTION: CATALOG & BARCODE */}
      <div
        className={`flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 p-3 md:p-4 overflow-hidden ${
          mobileTab === 'cart' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* SALES CHANNEL SELECTOR BAR (DINE IN, TAKE AWAY, GRABFOOD, GOFOOD, SHOPEEFOOD, MAXIM) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mr-1">
            Channel:
          </span>
          {[
            { id: 'DINE_IN', label: '🍽️ Dine In', color: 'border-slate-300 dark:border-slate-700' },
            { id: 'TAKE_AWAY', label: '🥡 Take Away', color: 'border-slate-300 dark:border-slate-700' },
            { id: 'GRABFOOD', label: '🟢 GrabFood', color: 'border-emerald-500/50' },
            { id: 'GOFOOD', label: '🔴 GoFood', color: 'border-rose-500/50' },
            { id: 'SHOPEEFOOD', label: '🟠 ShopeeFood', color: 'border-amber-500/50' },
            { id: 'MAXIM', label: '🟡 Maxim', color: 'border-yellow-500/50' },
          ].map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                setOrderChannel(ch.id as any);
                toast.info('Channel Penjualan', `Mode pesanan diubah ke ${ch.label}`);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                orderChannel === ch.id
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                  : `bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 ${ch.color}`
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Top Search, Shortcut F3 Customer, Shift Button [F4], Table Hold [F8], Scanner & Bluetooth Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-[180px]">
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Cari Produk / Scan Barcode [F2]..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
            />
            <span className="absolute right-3 top-2 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">
              ⌨️ F2
            </span>
          </div>

          {/* Quick Add Customer Shortcut Button (F3) */}
          <button
            onClick={() => setIsQuickAddCustomerOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
            title="Tambah / Cari Pelanggan Cepat [F3]"
          >
            <span>👤</span>
            <span>+ Member [F3]</span>
          </button>

          {/* Table Management & Hold Order Button [F8] */}
          <button
            onClick={() => setIsTableModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-white px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            title="Manajemen Meja & Hold Bill [F8]"
          >
            <span>🍽️</span>
            <span>Meja ({heldOrders.length}) [F8]</span>
          </button>

          {/* Shift Open/Close Button [F4] */}
          <button
            onClick={() => setIsShiftModalOpen(true)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 border shadow-sm transition-all active:scale-95 ${
              isShiftOpen
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}
            title="Manajemen Shift Kasir [F4]"
          >
            <span>⏱️</span>
            <span>{isShiftOpen ? 'Shift Buka [F4]' : 'Shift Tutup [F4]'}</span>
          </button>

          {/* Optical Scanner Button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
          >
            <span>📷</span>
            <span className="hidden sm:inline">Scan</span>
          </button>

          {/* Direct Bluetooth 58mm Printer Button */}
          <button
            onClick={() => connectPrinter()}
            disabled={isConnecting}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 border transition-all shadow-sm ${
              connectedPrinterName
                ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/60'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-red-500">📶</span>
            <span>{connectedPrinterName ? `BT: ${connectedPrinterName.substring(0, 8)}` : 'BT 58mm'}</span>
          </button>
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
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3 pr-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addItem(product)}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 rounded-3xl p-3 md:p-3.5 flex flex-col justify-between text-left transition-all duration-150 active:scale-95 group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-2xl mb-1">{product.imageEmoji}</span>
                  <span className="text-[9px] md:text-[10px] font-bold bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-2 py-0.5 rounded-full">
                    Stok: {product.stockOnHand}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {product.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-baseline">
                <span className="text-xs md:text-sm font-black text-red-600 dark:text-red-400 font-mono">
                  Rp {product.sellingPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                  + Tambah
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION: CART WITH MULTIPLE RICH LAYOUT OPTIONS */}
      <div
        className={`w-full md:w-96 lg:w-[440px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg ${
          mobileTab === 'catalog' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Customer, Table Number & Cart Display Layout Options Button */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsCustomerSearchModalOpen(true)}
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-red-500 rounded-2xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-between text-left shadow-sm group transition-all"
              title="Cari atau Daftarkan Konsumen CRM (Shortcut F3)"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span className="text-base">👤</span>
                <span className="font-bold text-xs truncate">
                  {customerName || 'Pilih Member CRM / Tamu [F3]'}
                </span>
              </div>
              <span className="text-[10px] text-red-600 dark:text-red-400 font-mono font-bold group-hover:underline">
                Cari ➔
              </span>
            </button>

            <input
              type="text"
              placeholder="Meja #"
              value={tableNumber}
              onChange={(e) => setCustomerInfo(customerName, e.target.value, selectedMemberId, selectedMember?.tier)}
              className="w-20 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none font-mono font-bold text-center shadow-sm"
            />

            {/* Cart Display Options Switcher Button */}
            <button
              onClick={() => setIsCartOptionsOpen(true)}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold shadow-sm transition-all"
              title="Pilihan Tampilan Cart (Cards, Table List, Grid, KDS, Accounting)"
            >
              🎨
            </button>
          </div>

          {selectedMember && (
            <div className="bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-800/40 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="bg-red-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                  {selectedMember.tier}
                </span>
                <span className="font-bold text-red-900 dark:text-red-200">{selectedMember.name}</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                ⭐ {selectedMember.points} Pts
              </div>
            </div>
          )}
        </div>

        {/* CART ITEM LIST - MULTIPLE LAYOUT RENDERERS */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <span className="text-3xl mb-2">🛒</span>
              <span className="font-semibold">Keranjang Belanja Kosong</span>
              <span className="text-[10px] mt-1">Pilih item dari katalog atau scan barcode [F2]</span>
            </div>
          ) : (
            <>
              {/* 1. MODERN SLEEK CARDS (LAYOUT = 'card') */}
              {layoutStyle === 'card' &&
                items.map((item) => (
                  <div
                    key={item.productId}
                    className={`bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl ${
                      density === 'touch_large' ? 'p-3.5 space-y-2' : density === 'compact' ? 'p-2 space-y-1' : 'p-2.5 space-y-1.5'
                    } shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-2">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.productName}</div>
                        {showSkuBarcode && <div className="text-[9px] font-mono text-slate-400">{item.sku}</div>}
                        <div className="text-[10px] text-slate-500 font-mono">
                          Rp {item.unitPrice.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`${
                            density === 'touch_large' ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'
                          } rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold`}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`${
                            density === 'touch_large' ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'
                          } rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold`}
                        >
                          +
                        </button>
                      </div>

                      <div className="w-24 text-right">
                        <div className="text-xs font-bold font-mono">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {alwaysShowNotes && (
                      <input
                        type="text"
                        placeholder="🍳 Catatan dapur (e.g. Less sugar)..."
                        value={itemNotes[item.productId] || ''}
                        onChange={(e) => setItemNotes({ ...itemNotes, [item.productId]: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    )}
                  </div>
                ))}

              {/* 2. COMPACT TABLE LIST (LAYOUT = 'compact_list' - SUPERMARKET STYLE) */}
              {layoutStyle === 'compact_list' && (
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 text-[10px] uppercase">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Harga</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                      {items.map((item) => (
                        <tr key={item.productId} className="hover:bg-slate-100 dark:hover:bg-slate-900">
                          <td className="p-2 font-sans font-bold text-slate-800 dark:text-slate-200">
                            <div>{item.productName}</div>
                            {itemNotes[item.productId] && (
                              <div className="text-[9px] text-amber-600 italic font-mono">
                                🍳 {itemNotes[item.productId]}
                              </div>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded text-[9px] font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded text-[9px] font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-2 text-right text-slate-500">
                            {item.unitPrice.toLocaleString('id-ID')}
                          </td>
                          <td className="p-2 text-right font-bold text-red-600 dark:text-red-400">
                            {item.subtotal.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. VISUAL THUMBNAIL GRID (LAYOUT = 'visual_grid') */}
              {layoutStyle === 'visual_grid' && (
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl flex flex-col justify-between space-y-1.5 shadow-sm"
                    >
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                        {item.productName}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span>@{item.unitPrice.toLocaleString('id-ID')}</span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. KITCHEN / BARISTA KDS TICKET VIEW (LAYOUT = 'kitchen_kds') */}
              {layoutStyle === 'kitchen_kds' &&
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/60 rounded-2xl space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span className="bg-amber-500 text-white font-mono px-2 py-0.5 rounded-lg text-xs">
                          {item.quantity}x
                        </span>
                        <span>{item.productName}</span>
                      </div>
                      <span className="font-mono font-bold">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200 dark:border-amber-900/50">
                      <input
                        type="text"
                        placeholder="📝 Instruksi Dapur: Less sugar, extra shot, no ice..."
                        value={itemNotes[item.productId] || ''}
                        onChange={(e) => setItemNotes({ ...itemNotes, [item.productId]: e.target.value })}
                        className="w-full bg-transparent font-bold text-amber-800 dark:text-amber-300 text-[11px] focus:outline-none placeholder-amber-400/80"
                      />
                    </div>
                  </div>
                ))}

              {/* 5. ACCOUNTING & TAX DETAILED VIEW (LAYOUT = 'accounting_detail') */}
              {layoutStyle === 'accounting_detail' &&
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1"
                  >
                    <div className="flex justify-between font-bold font-sans text-slate-800 dark:text-slate-100">
                      <span>{item.productName}</span>
                      <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                      <div>SKU: {item.sku || 'N/A'}</div>
                      <div>Qty: {item.quantity}x @ Rp {item.unitPrice.toLocaleString('id-ID')}</div>
                      <div>PPN/PB1 (11%): Rp {Math.round(item.subtotal * 0.11).toLocaleString('id-ID')}</div>
                      {showCogsMargin && item.unitCogs && (
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Margin: Rp {(item.subtotal - item.quantity * item.unitCogs).toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>

        {/* CALCULATION SUMMARY WITH FLEXIBLE DISCOUNT & TAX CONTROLS */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono">Rp {getSubtotal().toLocaleString('id-ID')}</span>
          </div>

          {/* DYNAMIC DISCOUNT INPUT (% OR RP) */}
          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">Diskon Transaksi:</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setDiscount('nominal', discountValue)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    discountMode === 'nominal' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  Rp
                </button>
                <button
                  type="button"
                  onClick={() => setDiscount('percent', discountValue)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    discountMode === 'percent' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  %
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                value={discountValue}
                onChange={(e) => setDiscount(discountMode, parseFloat(e.target.value) || 0)}
                placeholder={discountMode === 'percent' ? 'Contoh: 10 (%)' : 'Contoh: 15000 (Rp)'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-rose-600 focus:outline-none"
              />
              <span className="text-[11px] font-mono font-bold text-rose-600 whitespace-nowrap">
                - Rp {getTotalDiscount().toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* DYNAMIC TAX INPUT (% OR RP) */}
          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">Pajak (PPN/PB1):</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setTax('percent', taxValue)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    taxMode === 'percent' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => setTax('nominal', taxValue)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    taxMode === 'nominal' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  Rp
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                value={taxValue}
                onChange={(e) => setTax(taxMode, parseFloat(e.target.value) || 0)}
                placeholder={taxMode === 'percent' ? 'Contoh: 11 (%)' : 'Nominal Pajak (Rp)'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold focus:outline-none"
              />
              <span className="text-[11px] font-mono font-bold whitespace-nowrap">
                + Rp {getTaxAmount().toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {getRoundingAmount() !== 0 && (
            <div className="flex justify-between text-slate-500">
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
            className="w-full bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 py-2 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>✂️</span>
            <span>Split Bill 3 Mode (Manual Input)</span>
          </button>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-2xl font-bold text-xs shadow-sm active:scale-95"
            >
              Hold Table [F8]
            </button>
            <button
              onClick={() => {
                clearCart();
                toast.info('Batal', 'Keranjang dibersihkan.');
              }}
              disabled={items.length === 0}
              className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 py-2 rounded-2xl font-bold text-xs"
            >
              Batal
            </button>
            <button
              onClick={handleOpenPayment}
              disabled={items.length === 0}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 rounded-2xl text-xs shadow-lg shadow-red-600/20"
            >
              Bayar [F9]
            </button>
          </div>
        </div>
      </div>

      {/* CART DISPLAY OPTIONS MODAL */}
      {isCartOptionsOpen && (
        <CartDisplayOptionsModal onClose={() => setIsCartOptionsOpen(false)} />
      )}

      {/* TABLE & HOLD ORDER MANAGEMENT MODAL [F8] */}
      {isTableModalOpen && (
        <TableManagementModal
          onClose={() => setIsTableModalOpen(false)}
          onOpenPaymentForHeld={handleOpenPayment}
        />
      )}

      {/* SHIFT MANAGEMENT MODAL [F4] */}
      {isShiftModalOpen && (
        <ShiftManagementModal onClose={() => setIsShiftModalOpen(false)} />
      )}

      {/* PAYMENT MODAL */}
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
                  <span className="text-[11px] text-slate-500 font-semibold">Sisa Tagihan:</span>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    Rp {remaining.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-semibold">Total Terbayar:</span>
                  <div className="text-xl font-black text-red-600 dark:text-red-400 font-mono">
                    Rp {getTotalPaid().toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* QUICK DUAL SPLIT PRESET BUTTONS */}
              {remaining > 0 && payments.length === 0 && (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const half = Math.round(grandTotal / 2);
                      const rem = grandTotal - half;
                      addPayment({ chartOfAccountId: 'acc-cash', paymentMethod: 'cash', amount: half, changeGiven: 0 });
                      addPayment({ chartOfAccountId: 'acc-qris', paymentMethod: 'qris', amount: rem, changeGiven: 0, referenceNumber: `QRIS-${Date.now().toString().slice(-6)}` });
                      toast.success('Dual Payment Diatur', `50% Tunai (Rp ${half.toLocaleString('id-ID')}) + 50% QRIS (Rp ${rem.toLocaleString('id-ID')})`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-[11px] font-bold text-red-700 dark:text-red-300 hover:bg-red-100"
                  >
                    ⚡ Dual: 50% Tunai + 50% QRIS
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const half = Math.round(grandTotal / 2);
                      const rem = grandTotal - half;
                      addPayment({ chartOfAccountId: 'acc-cash', paymentMethod: 'cash', amount: half, changeGiven: 0 });
                      addPayment({ chartOfAccountId: 'acc-edc_bca', paymentMethod: 'edc_bca', amount: rem, changeGiven: 0, referenceNumber: `EDC-${Date.now().toString().slice(-6)}` });
                      toast.success('Dual Payment Diatur', `50% Tunai (Rp ${half.toLocaleString('id-ID')}) + 50% EDC BCA (Rp ${rem.toLocaleString('id-ID')})`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100"
                  >
                    ⚡ Dual: 50% Tunai + 50% EDC BCA
                  </button>
                </div>
              )}

              {/* PAYMENT METHOD SELECTOR WITH DISABLED STATE FOR ALREADY SELECTED METHOD */}
              <div className="grid grid-cols-5 gap-1.5">
                {(['cash', 'qris', 'edc_bca', 'transfer_bank', 'customer_credit'] as const).map((m) => {
                  const isAlreadyUsed = payments.some((p) => p.paymentMethod === m);
                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={isAlreadyUsed}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-1 rounded-2xl text-[10px] font-bold uppercase border transition-all truncate ${
                        isAlreadyUsed
                          ? 'bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-40 cursor-not-allowed line-through'
                          : paymentMethod === m
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-400'
                      }`}
                      title={isAlreadyUsed ? `${m} sudah dipilih pada alokasi sebelumnya` : m}
                    >
                      {m.replace('_', ' ')}
                    </button>
                  );
                })}
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
                  <span className="text-[11px] text-slate-500 font-semibold">Rincian Pembayaran Masuk:</span>
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
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
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
            toast.cart(scannedProduct.name);
          }}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {isReceiptOpen && lastCompletedOrder && (
        <ReceiptModal
          orderNumber={lastCompletedOrder.orderNumber}
          customerName={lastCompletedOrder.customerName}
          tableNumber={lastCompletedOrder.tableNumber}
          orderChannel={lastCompletedOrder.orderChannel}
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

      {isCustomerSearchModalOpen && (
        <PosCustomerSearchModal
          onSelectCustomer={(cName, cPhone) => {
            setCustomerInfo(cName, tableNumber);
            setIsCustomerSearchModalOpen(false);
          }}
          onClose={() => setIsCustomerSearchModalOpen(false)}
        />
      )}

      {isPinChangeModalOpen && (
        <CashierPinChangeModal onClose={() => setIsPinChangeModalOpen(false)} />
      )}
    </div>
  );
};
