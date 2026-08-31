'use client';

import React, { useState } from 'react';
import { useToastStore } from '../../stores/useToastStore';

export const NotificationCenterPopover: React.FC = () => {
  const { notificationHistory, markAllAsRead, clearHistory } = useToastStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notificationHistory.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center"
        title="Pusat Notifikasi & Shift Alerts"
      >
        <span className="text-sm">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 text-xs space-y-3 font-sans">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">Pusat Notifikasi</span>
              {unreadCount > 0 && (
                <span className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-mono text-[9px] px-2 py-0.2 rounded-full font-bold">
                  {unreadCount} Baru
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-[10px]">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-red-600 dark:text-red-400 font-bold hover:underline"
                >
                  Tandai Dibaca
                </button>
              )}
              {notificationHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Bersihkan
                </button>
              )}
            </div>
          </div>

          {/* List Notifications */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {notificationHistory.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-1">
                <span className="text-2xl block">🔕</span>
                <p className="text-[11px]">Belum ada notifikasi baru.</p>
              </div>
            ) : (
              notificationHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all text-left flex items-start space-x-2.5 ${
                    !item.read
                      ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{item.icon || 'ℹ️'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 ml-2">{item.createdAt}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-[11px] font-semibold"
            >
              Tutup Panel Notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
