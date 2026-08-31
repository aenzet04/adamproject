'use client';

import React from 'react';
import { useToastStore } from '../../stores/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-slate-900/95 dark:bg-slate-900/95 text-white border border-red-500/40 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl shadow-red-950/40 flex items-start space-x-3 animate-slideInRight transition-all"
        >
          <span className="w-7 h-7 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-sm font-bold flex-shrink-0 text-red-400">
            {t.icon || '✓'}
          </span>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-100">{t.title}</div>
            {t.description && (
              <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{t.description}</div>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
