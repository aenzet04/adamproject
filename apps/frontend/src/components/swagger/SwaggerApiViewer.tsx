'use client';

import React, { useState } from 'react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  tag: string;
  description: string;
  defaultPayload?: string;
  responseExample: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'health-check',
    method: 'GET',
    path: '/api/v1/health',
    tag: 'Core Tenancy & Health',
    summary: 'System Health & Tenancy Status',
    description: 'Memeriksa status aktif server Ruby API, koneksi database MySQL 8 / MariaDB (InnoDB), dan tenant yang sedang aktif.',
    responseExample: JSON.stringify(
      {
        status: 'online',
        engine: 'Ruby Enterprise Backend API',
        database: 'MySQL 8.0 / MariaDB (InnoDB Strict Mode)',
        active_tenancy: 'PT Multi Industri Nusantara',
        modules: ['pos_engine', 'finance_engine', 'inventory_engine', 'hr_engine', 'audit_engine'],
        timestamp: '2026-09-01T04:30:00Z',
      },
      null,
      2
    ),
  },
  {
    id: 'pos-checkout',
    method: 'POST',
    path: '/api/v1/pos/checkout',
    tag: 'POS & General Ledger',
    summary: 'Live POS Checkout & Auto Double-Entry Posting',
    description: 'Memproses transaksi penjualan POS, memotong stok real-time, dan menjurnal otomatis ke General Ledger (Buku Besar).',
    defaultPayload: JSON.stringify(
      {
        customerName: 'Bpk. Hendra Gunawan',
        tableNumber: '08',
        items: [
          {
            productId: 'prod-001',
            productName: 'Espresso Single Origin Gayo',
            quantity: 2,
            unitPrice: 28000,
            discountAmount: 0,
          },
          {
            productId: 'prod-003',
            productName: 'Croissant Butter Paris',
            quantity: 1,
            unitPrice: 32000,
            discountAmount: 0,
          },
        ],
        subtotalAmount: 88000,
        discountAmount: 0,
        taxRate: 11.0,
        serviceChargeAmount: 0,
        roundingAmount: 320,
        grandTotal: 98000,
        payments: [
          {
            paymentMethod: 'qris',
            amount: 98000,
            changeGiven: 0,
            referenceNumber: 'QRIS-RRN-992144',
          },
        ],
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        message: 'Order processed & Double-Entry Journal posted automatically',
        order: {
          order_number: 'ORD-RAILS-20260901-44B1',
          subtotal: 88000,
          tax: 9680,
          grand_total: 98000,
          completed_at: '2026-09-01T04:30:00Z',
          customer_name: 'Bpk. Hendra Gunawan',
        },
        general_ledger_journal: {
          entry_number: 'JRN-POS-20260901-E8A1',
          status: 'posted',
          total_debit: 128800,
          total_credit: 128800,
          lines: [
            { account: '1101-01 (Kas/Bank QRIS)', debit: 98000, credit: 0.0 },
            { account: '4101-01 (Pendapatan Penjualan)', debit: 0.0, credit: 88000 },
            { account: '2103-01 (Hutang PPN Keluaran 11%)', debit: 0.0, credit: 9680 },
            { account: '5101-01 (Beban HPP / COGS)', debit: 30800, credit: 0.0 },
            { account: '1104-01 (Persediaan Barang Dagang)', debit: 0.0, credit: 30800 },
          ],
        },
      },
      null,
      2
    ),
  },
  {
    id: 'financial-reports',
    method: 'GET',
    path: '/api/v1/finance/reports/profit_loss',
    tag: 'Finance & Accounting',
    summary: 'Executive Profit & Loss Statement (PSAK / IFRS)',
    description: 'Mengambil data konsolidasi Laba Rugi real-time berdasarkan transaksi jurnal Double-Entry yang terposting.',
    responseExample: JSON.stringify(
      {
        periodStart: '2026-08-01',
        periodEnd: '2026-08-31',
        revenues: [
          { code: '4101-01', name: 'Pendapatan Penjualan F&B', amount: 345200000 },
          { code: '4101-02', name: 'Pendapatan Penjualan Retail', amount: 84500000 },
        ],
        totalRevenue: 446960000,
        cogs: [{ code: '5101-01', name: 'Beban Pokok Penjualan (HPP)', amount: 180330000 }],
        grossProfit: 266630000,
        totalOperatingExpense: 134400000,
        netIncome: 132230000,
      },
      null,
      2
    ),
  },
  {
    id: 'dead-stock-analyzer',
    method: 'GET',
    path: '/api/v1/inventory/dead_stock?days=60',
    tag: 'Inventory & SCM',
    summary: 'Dead Stock Analyzer (N Days Inactive)',
    description: 'Menganalisis persediaan yang tidak bergerak dalam N hari terakhir dan nilai modal kerja tertahan.',
    responseExample: JSON.stringify(
      {
        threshold_days: 60,
        dead_stock_items: [
          {
            sku: 'RET-MDV-18',
            name: 'Manual Drip V60 Glass Server',
            quantity_on_hand: 25,
            average_cost: 140000,
            tied_up_capital: 3500000,
            days_inactive: 72.4,
          },
        ],
      },
      null,
      2
    ),
  },
];

export const SwaggerApiViewer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultPayload || '');
  const [liveResponse, setLiveResponse] = useState<{
    status: number;
    timeMs: number;
    data: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultPayload || '');
    setLiveResponse(null);
  };

  const handleExecuteLiveTest = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    const targetUrl = `http://localhost:3001${selectedEndpoint.path.split('?')[0]}`;

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'tenant-1',
        },
      };

      if (selectedEndpoint.method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(targetUrl, options);
      const json = await res.json();
      const endTime = performance.now();

      setLiveResponse({
        status: res.status,
        timeMs: Math.round(endTime - startTime),
        data: json,
      });
    } catch (err: any) {
      const endTime = performance.now();
      setLiveResponse({
        status: 500,
        timeMs: Math.round(endTime - startTime),
        data: {
          error: 'Connection to Live Ruby API failed or server offline on port 3001',
          details: err.message,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-slate-100">Swagger / OpenAPI 3.0 Live Console</h2>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              v1.0.0 OAS3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dokumentasi & Testing REST API Backend Ruby on Rails 8 secara Live dengan integrasi Database MySQL / MariaDB.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Target Server:</span>
          <code className="text-xs bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-1 rounded font-mono">
            http://localhost:3001
          </code>
        </div>
      </div>

      {/* Main Grid: Endpoints List & Interactive Inspector */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Endpoint Explorer */}
        <div className="col-span-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Endpoints Tersedia ({ENDPOINTS.length})
          </div>

          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`text-[10px] font-black font-mono px-2 py-0.5 rounded uppercase ${
                      ep.method === 'GET'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200 truncate">{ep.path}</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{ep.summary}</div>
              </button>
            );
          })}

          {/* Usage Guide Card */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300 mt-4">
            <div className="font-bold text-emerald-400 flex items-center space-x-1.5">
              <span>📖</span>
              <span>Panduan Pengetesan API:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
              <li>Pilih salah satu endpoint di atas.</li>
              <li>Edit payload JSON pada tab <b>Request Body</b> (untuk POST).</li>
              <li>Klik tombol <b>▶ Send Request (Execute)</b>.</li>
              <li>Response status code, waktu eksekusi (ms), dan body JSON akan tampil secara live.</li>
            </ol>
          </div>
        </div>

        {/* Right: Interactive Console */}
        <div className="col-span-8 space-y-4">
          {/* Endpoint Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <span
                  className={`text-xs font-black font-mono px-2.5 py-1 rounded uppercase ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="text-base font-mono font-bold text-slate-100">
                  {selectedEndpoint.path}
                </span>
              </div>

              <button
                onClick={handleExecuteLiveTest}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <span>{isLoading ? '⏳' : '▶'}</span>
                <span>{isLoading ? 'Mengirim...' : 'Send Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">{selectedEndpoint.description}</p>

            {/* Request Body (If POST) */}
            {selectedEndpoint.method === 'POST' && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-300">Request Body (application/json)</span>
                  <button
                    onClick={() => setRequestBody(selectedEndpoint.defaultPayload || '')}
                    className="text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    Reset Payload
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Response Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300">Live Response Inspector</span>
                {liveResponse && (
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        liveResponse.status < 300
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      HTTP {liveResponse.status}
                    </span>
                    <span className="text-slate-400">{liveResponse.timeMs} ms</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-80">
                {liveResponse ? (
                  <pre className="text-slate-200">
                    {JSON.stringify(liveResponse.data, null, 2)}
                  </pre>
                ) : (
                  <div>
                    <div className="text-[10px] text-slate-500 mb-1">// Contoh Skema Respons (Expected 200 OK):</div>
                    <pre className="text-slate-500">{selectedEndpoint.responseExample}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
