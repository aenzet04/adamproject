'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePosCartStore } from '../../stores/usePosCartStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { usePrinterStore } from '../../stores/usePrinterStore';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useShiftStore } from '../../stores/useShiftStore';
import { toast } from '../../stores/useToastStore';
import { submitPosCheckoutLive } from '../../lib/api';
import { ReceiptModal } from './ReceiptModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { SplitBillModal } from './SplitBillModal';
import { ShiftManagementModal } from '../shifts/ShiftManagementModal';
import { TableManagementModal } from './TableManagementModal';
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
    holdCurrentOrder,
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

  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isQuickAddCustomerOpen, setIsQuickAddCustomerOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'edc_bca' | 'customer_credit'>('cash');
  const [tenderAmount, setTenderAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  // Quick Customer Form
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('');

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

  // Keyboard Shortcuts: F2 for Barcode, F3 for Customer, F4 for Shift, F8 for Table Hold, F9 for Payment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F3') {
        e.preventDefault();
        setIsQuickAddCustomerOpen(true);
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

    if (selectedMemberId) {
      recordPurchase(selectedMemberId, grandTotal);
    }

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

  const handleQuickCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCustName || !quickCustPhone) return;

    const newCust = addCustomer({
      name: quickCustName,
      phone: quickCustPhone,
      branchId: currentBranch?.id || 'br-01',
      branchName: currentBranch?.name || 'Outlet Grand Indonesia',
      tier: 'Bronze',
    });

    setSelectedMemberId(newCust.id);
    setCustomerInfo(newCust.name, tableNumber, newCust.id, newCust.tier);
    toast.success('Member Terdaftar (Shortcut F3)', `${newCust.name} siap ditransaksikan.`);
    setIsQuickAddCustomerOpen(false);
    setQuickCustName('');
    setQuickCustPhone('');
  };

  const selectedMember = customers.find((c) => c.id === selectedMemberId);

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
              onClick={() => {
                addItem(product);
                toast.cart(product.name);
              }}
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

      {/* RIGHT SECTION: CART & CUSTOMER CRM */}
      <div
        className={`w-full md:w-96 lg:w-[430px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg ${
          mobileTab === 'catalog' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Customer & Table Number Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedMemberId(id);
                  const member = customers.find((c) => c.id === id);
                  if (member) {
                    setCustomerInfo(member.name, tableNumber, member.id, member.tier);
                    toast.info('Member Terpilih', `${member.name} (${member.tier})`);
                  } else {
                    setCustomerInfo('', tableNumber);
                  }
                }}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="">👤 Cari Member [F3]...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tier} - {c.points} Pts) - {c.phone}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Meja #"
              value={tableNumber}
              onChange={(e) => setCustomerInfo(customerName, e.target.value, selectedMemberId, selectedMember?.tier)}
              className="w-24 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none font-mono font-bold text-center shadow-sm"
            />
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

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <span className="text-3xl mb-2">🛒</span>
              <span className="font-semibold">Keranjang Belanja Kosong</span>
              <span className="text-[10px] mt-1">Pilih item dari katalog atau scan barcode</span>
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
                    <div className="text-[10px] text-slate-500 font-mono">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold"
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

                <input
                  type="text"
                  placeholder="🍳 Catatan dapur (e.g. Less sugar, pedas sedang)..."
                  value={itemNotes[item.productId] || ''}
                  onChange={(e) => setItemNotes({ ...itemNotes, [item.productId]: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            ))
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

      {/* QUICK ADD CUSTOMER SHORTCUT MODAL (F3) */}
      {isQuickAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 font-bold">⌨️ [F3]</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Tambah Member Cepat Kasir
                </h3>
              </div>
              <button onClick={() => setIsQuickAddCustomerOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleQuickCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Irwan"
                  value={quickCustName}
                  onChange={(e) => setQuickCustName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp (081...)</label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={quickCustPhone}
                  onChange={(e) => setQuickCustPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddCustomerOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Simpan & Pilih Member
                </button>
              </div>
            </form>
          </div>
        </div>
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

              <div className="grid grid-cols-4 gap-2">
                {(['cash', 'qris', 'edc_bca', 'customer_credit'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 px-2 rounded-2xl text-xs font-bold uppercase border transition-all ${
                      paymentMethod === m
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
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
