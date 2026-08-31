'use client';

import React, { useRef } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { toast } from '../../stores/useToastStore';

export const OnboardingWizardModal: React.FC = () => {
  const {
    isOnboardingOpen,
    currentStep,
    isAiGenerating,
    brandName,
    businessSector,
    tagline,
    description,
    logoUrl,
    bannerUrl,
    socialLinks,
    branches,
    employees,
    closeOnboarding,
    setStep,
    updateBrand,
    generateBrandAiSuggestion,
    addBranch,
    updateBranch,
    removeBranch,
    addEmployee,
    updateEmployee,
    removeEmployee,
    completeOnboarding,
  } = useOnboardingStore();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!isOnboardingOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateBrand({ logoUrl: reader.result });
        toast.success('Logo Diperbarui', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateBrand({ bannerUrl: reader.result });
        toast.success('Banner Header Diperbarui', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const SECTORS = [
    { id: 'fnb', label: '☕ F&B / Kafe, Resto & Kuliner', icon: '☕' },
    { id: 'retail', label: '🛒 Retail / Minimarket & Toko Kelontong', icon: '🛒' },
    { id: 'fashion', label: '👗 Fashion & Apparel / Butik', icon: '👗' },
    { id: 'barbershop', label: '✂️ Barbershop, Salon & Grooming', icon: '✂️' },
    { id: 'clinic', label: '💊 Apotek & Klinik Kesehatan', icon: '💊' },
    { id: 'services', label: '🚚 Ekspedisi & Jasa Layanan', icon: '🚚' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* TOP BAR / STEPPER HEADER */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-red-600/30">
              M
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">First-Time Setup Wizard</h3>
              <p className="text-[10px] text-slate-400 font-mono">Modula Enterprise Initial Seeding Core</p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep === s
                    ? 'bg-red-600 text-white ring-2 ring-red-500/40 ring-offset-2 ring-offset-slate-950'
                    : currentStep > s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* STEPPER LABELS */}
        <div className="grid grid-cols-4 bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-bold text-center py-2 px-4">
          <div className={currentStep === 1 ? 'text-red-400' : 'text-slate-500'}>1. Identitas Brand</div>
          <div className={currentStep === 2 ? 'text-red-400' : 'text-slate-500'}>2. Setup Cabang</div>
          <div className={currentStep === 3 ? 'text-red-400' : 'text-slate-500'}>3. Karyawan & Kasir</div>
          <div className={currentStep === 4 ? 'text-red-400' : 'text-slate-500'}>4. Peluncuran</div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200 flex-1">
          {/* STEP 1: BRAND IDENTITY & AI SUGGESTION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Header Banner Preview ala YouTube / Thread */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 h-36 sm:h-44 group">
                <img
                  src={bannerUrl}
                  alt="Banner Header"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-end space-x-3">
                    <div className="relative">
                      <img
                        src={logoUrl}
                        alt="Logo Brand"
                        className="w-16 h-16 rounded-2xl border-2 border-red-500 object-cover shadow-lg bg-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-lg text-[10px] shadow"
                        title="Upload Logo Baru"
                      >
                        📷
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white truncate">{brandName || 'Nama Brand Bisnis'}</div>
                      <div className="text-[11px] text-red-400 italic truncate font-serif">"{tagline}"</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="bg-slate-800/80 hover:bg-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 backdrop-blur-xs"
                    >
                      🖼️ Ganti Banner (16:9)
                    </button>
                  </div>
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </div>

              {/* Form Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Brand Bisnis</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kopi Nusantara Roastery"
                    value={brandName}
                    onChange={(e) => updateBrand({ brandName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sektor Bisnis</label>
                  <select
                    value={businessSector}
                    onChange={(e) => updateBrand({ businessSector: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {SECTORS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI MAGIC SUGGESTION BUTTON */}
              <div className="p-3 bg-gradient-to-r from-red-950/40 via-rose-950/20 to-slate-900 rounded-2xl border border-red-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="font-bold text-red-400 flex items-center space-x-1.5">
                    <span>✨</span>
                    <span>AI Brand Generator (Magic Auto-Fill)</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Generate tagline menjual, deskripsi bisnis, dan kategori produk sesuai sektor.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isAiGenerating}
                  onClick={generateBrandAiSuggestion}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-red-600/20 active:scale-95 flex items-center space-x-1.5 whitespace-nowrap"
                >
                  <span>{isAiGenerating ? '⏳ Mengenerate...' : '✨ Generate via AI'}</span>
                </button>
              </div>

              {/* Tagline & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Tagline / Slogan Brand</label>
                  <input
                    type="text"
                    placeholder="Tagline menarik yang memikat pelanggan"
                    value={tagline}
                    onChange={(e) => updateBrand({ tagline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white font-serif italic focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Deskripsi Singkat Bisnis</label>
                  <textarea
                    rows={2}
                    placeholder="Profil singkat mengenai brand Anda..."
                    value={description}
                    onChange={(e) => updateBrand({ description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
                  Media Sosial & Komunikasi Bisnis
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Instagram (@brand)"
                    value={socialLinks.instagram}
                    onChange={(e) => updateBrand({ socialLinks: { ...socialLinks, instagram: e.target.value } })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="TikTok (@brand)"
                    value={socialLinks.tiktok}
                    onChange={(e) => updateBrand({ socialLinks: { ...socialLinks, tiktok: e.target.value } })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp Business"
                    value={socialLinks.whatsapp}
                    onChange={(e) => updateBrand({ socialLinks: { ...socialLinks, whatsapp: e.target.value } })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Website (https://...)"
                    value={socialLinks.website}
                    onChange={(e) => updateBrand({ socialLinks: { ...socialLinks, website: e.target.value } })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SETUP CABANG & GUDANG */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Setup Cabang / Outlet ({branches.length})</h4>
                  <p className="text-[11px] text-slate-400">
                    Tambahkan cabang awal Anda. Setiap cabang otomatis disiapkan gudang persediaan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addBranch}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-md text-xs"
                >
                  + Tambah Cabang Lainnya
                </button>
              </div>

              <div className="space-y-3">
                {branches.map((b, idx) => (
                  <div
                    key={b.id}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 relative group"
                  >
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-red-600/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded-lg text-[10px]">
                          CABANG #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-xs">{b.name || 'Cabang Baru'}</span>
                      </div>
                      {branches.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBranch(b.id)}
                          className="text-rose-500 hover:text-rose-400 font-bold text-xs"
                        >
                          Hapus ✕
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Nama Cabang / Outlet</label>
                        <input
                          type="text"
                          required
                          placeholder="Outlet Flagship Grand Indonesia"
                          value={b.name}
                          onChange={(e) => updateBranch(b.id, { name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Kode Cabang (Singkat)</label>
                        <input
                          type="text"
                          required
                          placeholder="GI-01"
                          value={b.code}
                          onChange={(e) => updateBranch(b.id, { code: e.target.value.toUpperCase() })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Kota / Provinsi</label>
                        <input
                          type="text"
                          placeholder="Jakarta Pusat"
                          value={b.city}
                          onChange={(e) => updateBranch(b.id, { city: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Alamat Lengkap Outlet</label>
                        <input
                          type="text"
                          placeholder="Jl. M.H. Thamrin No. 1, West Mall Lantai 3A"
                          value={b.address}
                          onChange={(e) => updateBranch(b.id, { address: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Jam Operasional</label>
                        <input
                          type="text"
                          placeholder="08:00 - 22:00 WIB"
                          value={b.operatingHours}
                          onChange={(e) => updateBranch(b.id, { operatingHours: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SETUP KARYAWAN & PIN KASIR */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Setup Karyawan & PIN Kasir POS ({employees.length})</h4>
                  <p className="text-[11px] text-slate-400">
                    Tambahkan staf awal dengan PIN 4-digit untuk login instan di aplikasi kasir.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addEmployee}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-md text-xs"
                >
                  + Tambah Karyawan
                </button>
              </div>

              <div className="space-y-3">
                {employees.map((emp, idx) => (
                  <div
                    key={emp.id}
                    className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        KARYAWAN #{idx + 1}
                      </span>
                      {employees.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmployee(emp.id)}
                          className="text-rose-500 font-bold text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          placeholder="Siti Rahma"
                          value={emp.name}
                          onChange={(e) => updateEmployee(emp.id, { name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">WhatsApp / Email</label>
                        <input
                          type="text"
                          placeholder="0812998877"
                          value={emp.phone || emp.email}
                          onChange={(e) => updateEmployee(emp.id, { phone: e.target.value, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Posisi / Role</label>
                        <select
                          value={emp.role}
                          onChange={(e) => {
                            const r = e.target.value as any;
                            updateEmployee(emp.id, {
                              role: r,
                              roleTitle:
                                r === 'branch_manager'
                                  ? 'Manajer Cabang'
                                  : r === 'warehouse_staff'
                                  ? 'Staf Gudang & SCM'
                                  : 'Kasir Frontliner',
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                        >
                          <option value="cashier">🛒 Kasir POS</option>
                          <option value="branch_manager">🏢 Manajer Cabang</option>
                          <option value="warehouse_staff">📦 Staf Gudang & SCM</option>
                          <option value="staff">☕ Staf Kitchen/Barista</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">PIN Kasir (4-6 Digit)</label>
                        <input
                          type="password"
                          maxLength={6}
                          placeholder="1234"
                          value={emp.posPin}
                          onChange={(e) => updateEmployee(emp.id, { posPin: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono text-center tracking-widest font-black"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & LAUNCH */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-tr from-red-950/50 to-slate-950 rounded-2xl border border-red-800/50 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-12 h-12 rounded-xl object-cover border border-red-500 shadow"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{brandName}</h4>
                    <p className="text-[11px] text-red-400 italic font-serif">"{tagline}"</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 border-t border-slate-800 pt-2">
                  {description}
                </p>
              </div>

              {/* Summary Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Sektor Bisnis:</span>
                  <span className="font-bold text-white text-xs uppercase">{businessSector}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Cabang Siap:</span>
                  <span className="font-bold text-emerald-400 text-xs">{branches.length} Outlet</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Karyawan Terdaftar:</span>
                  <span className="font-bold text-red-400 text-xs">{employees.length} Orang</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
                  Daftar Cabang yang Akan Diluncurkan:
                </span>
                <div className="space-y-1">
                  {branches.map((b) => (
                    <div key={b.id} className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
                      <span>• <b>{b.name}</b> ({b.code})</span>
                      <span className="text-slate-500">{b.operatingHours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setStep((currentStep - 1) as any)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
            >
              ← Kembali
            </button>
          ) : (
            <button
              type="button"
              onClick={closeOnboarding}
              className="text-slate-500 hover:text-slate-400 text-xs font-semibold"
            >
              Lewati Setup
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !brandName.trim()) {
                  toast.error('Validasi Gagal', 'Nama brand wajib diisi.');
                  return;
                }
                setStep((currentStep + 1) as any);
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-red-600/20 active:scale-95"
            >
              Lanjut ke Langkah {currentStep + 1} ➔
            </button>
          ) : (
            <button
              type="button"
              onClick={completeOnboarding}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-6 py-2.5 rounded-2xl text-xs shadow-xl shadow-red-600/40 active:scale-95 flex items-center space-x-2"
            >
              <span>🚀 Simpan & Luncurkan Bisnis Saya</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
