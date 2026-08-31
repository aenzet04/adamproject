'use client';

import React from 'react';
import { useToastStore, ToastMessage } from '../../stores/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col space-y-2.5 pointer-events-none max-w-sm w-full font-sans">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';
        const isPayment = t.type === 'payment';
        const isSuccess = t.type === 'success';

        let containerStyle = 'bg-slate-900/95 border-slate-700 text-white shadow-slate-950/50';
        let iconBg = 'bg-slate-800 text-slate-300 border-slate-700';

        if (isError) {
          containerStyle =
            'bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-2 border-red-500 text-white shadow-2xl shadow-red-600/50 ring-2 ring-red-500/40 animate-pulse';
          iconBg = 'bg-red-600 text-white border-red-400';
        } else if (isWarning) {
          containerStyle =
            'bg-amber-950/95 border-2 border-amber-500 text-white shadow-2xl shadow-amber-600/30';
          iconBg = 'bg-amber-500 text-slate-950 border-amber-400 font-black';
        } else if (isPayment || isSuccess) {
          containerStyle =
            'bg-slate-900/95 border-2 border-emerald-500 text-white shadow-2xl shadow-emerald-950/50';
          iconBg = 'bg-emerald-600 text-white border-emerald-400';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-start space-x-3 transition-all animate-slideInRight ${containerStyle}`}
          >
            <span
              className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-bold flex-shrink-0 shadow ${iconBg}`}
            >
              {t.icon || (isError ? '🚨' : isWarning ? '⚠️' : '✓')}
            </span>
            <div className="flex-1 text-xs">
              <div className={`font-black text-sm ${isError ? 'text-red-200 uppercase tracking-wide' : 'text-white'}`}>
                {t.title}
              </div>
              {t.description && (
                <div
                  className={`text-xs mt-1 leading-snug font-medium ${
                    isError ? 'text-red-100 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {t.description}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white text-sm font-bold px-1.5 py-0.5 rounded-lg bg-black/30"
              title="Tutup Notifikasi"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
