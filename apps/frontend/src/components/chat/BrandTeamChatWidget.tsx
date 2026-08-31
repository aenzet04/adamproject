'use client';

import React, { useState } from 'react';
import { useInternalChatStore } from '../../stores/useInternalChatStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../../stores/useToastStore';

export const BrandTeamChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { messages, sendMessage, isSuperUserAuthorizedForBrand } = useInternalChatStore();
  const { currentBrand } = useTenantStore();
  const { currentUser } = useAuthStore();

  const brandId = currentBrand?.id || 'b-01';
  const brandName = currentBrand?.name || 'Kopi Nusantara Roastery';

  // Strict Multi-Tenant Brand Isolation Filter
  const isSuperUser = currentUser.role === 'super_user';
  const isSuperUserAuthorized = isSuperUserAuthorizedForBrand(brandId);

  const brandMessages = messages.filter((m) => m.brandId === brandId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isSuperUser && !isSuperUserAuthorized) {
      toast.error('Akses Dibatasi', 'Super User wajib membuat / memuat tiket izin inspeksi sebelum mengirim pesan.');
      return;
    }

    sendMessage({
      brandId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      text: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Trigger Floating Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl border border-slate-700 flex items-center space-x-2 transition-all active:scale-95 group"
        >
          <span className="text-lg">💬</span>
          <span className="text-xs font-bold pr-1 hidden sm:inline">
            Team Chat ({brandName.split(' ')[0]})
          </span>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </button>
      ) : (
        /* Floating Chat Box */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-80 sm:w-96 shadow-2xl overflow-hidden flex flex-col h-[480px] transition-all">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-base">💬</span>
              <div>
                <h4 className="text-xs font-bold truncate max-w-[200px]">{brandName}</h4>
                <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Kasir ↔ Admin ↔ Owner (Internal)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Super User Guard Notice */}
          {isSuperUser && (
            <div className="p-2 bg-purple-950 text-purple-200 text-[10px] border-b border-purple-800 flex justify-between items-center">
              <span>🛡️ Mode Super User: {isSuperUserAuthorized ? 'Tiket Aktif (#TCK-001)' : 'Izin Diperlukan'}</span>
            </div>
          )}

          {/* Chat Messages List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-slate-50 dark:bg-slate-950">
            {brandMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                <span className="text-2xl mb-1">💬</span>
                <span>Belum ada obrolan di brand ini.</span>
                <span className="text-[10px] mt-1">Mulai koordinasi operasional hari ini.</span>
              </div>
            ) : (
              brandMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        {msg.senderName} ({msg.senderRole.replace('_', ' ')})
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-2xl max-w-[85%] text-xs shadow-sm ${
                        isMe
                          ? 'bg-red-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex space-x-2">
            <input
              type="text"
              placeholder={`Ketik pesan ke tim ${brandName.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-2 rounded-2xl text-xs transition-all shadow-md shadow-red-600/20 active:scale-95"
            >
              Kirim
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
