'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInternalChatStore, ChatMessage } from '../../stores/useInternalChatStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useStaffStore, BrandEmployee } from '../../stores/useStaffStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { EnterpriseEmojiPicker } from './EnterpriseEmojiPicker';
import { toast } from '../../stores/useToastStore';

export const RealtimeTeamChatView: React.FC = () => {
  const { currentBrand, currentBranch } = useTenantStore();
  const { currentUser } = useAuthStore();
  const { employees } = useStaffStore();
  const { isModuleUnlocked, unlockModule } = useModuleLicenseStore();
  const isChatAddonActive = isModuleUnlocked('chat');
  const {
    messages,
    sendMessage,
    createPoll,
    votePoll,
    togglePinMessage,
    addReaction,
    happeningNowStatuses,
    setHappeningNow,
  } = useInternalChatStore();

  const [activeChannel, setActiveChannel] = useState<'brand' | 'branch' | 'direct'>('brand');
  const [directRecipient, setDirectRecipient] = useState<BrandEmployee | null>(null);

  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string>('');

  // Modals & Popovers
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Happening Now Editor State
  const [isHappeningNowEditing, setIsHappeningNowEditing] = useState(false);
  const [happeningNowDraft, setHappeningNowDraft] = useState('');

  // Mention Autocomplete State
  const [isMentionOpen, setIsMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const brandId = currentBrand?.id || 'b-01';
  const branchId = currentBranch?.id || 'br-01';
  const currentHappeningNow = happeningNowStatuses[brandId];

  const isExecutive =
    (currentUser.role as string) === 'owner' ||
    (currentUser.role as string) === 'general_manager' ||
    (currentUser.role as string) === 'super_user';

  // Filter messages based on active channel & brand isolation
  const channelMessages = messages.filter((m) => {
    if (m.brandId !== brandId) return false;

    if (activeChannel === 'brand') {
      return m.scope === 'brand';
    }
    if (activeChannel === 'branch') {
      return m.scope === 'branch' && m.branchId === branchId;
    }
    if (activeChannel === 'direct' && directRecipient) {
      return (
        m.scope === 'direct' &&
        ((m.senderId === currentUser.id && m.recipientId === directRecipient.id) ||
          (m.senderId === directRecipient.id && m.recipientId === currentUser.id))
      );
    }
    return false;
  });

  const pinnedMessage = channelMessages.find((m) => m.isPinned);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    const lastWord = val.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setIsMentionOpen(true);
      setMentionFilter(lastWord.substring(1).toLowerCase());
    } else {
      setIsMentionOpen(false);
    }
  };

  const handleSelectMention = (emp: BrandEmployee) => {
    const username = `@${emp.name.toLowerCase().replace(/\s+/g, '.')}`;
    const words = inputText.split(' ');
    words.pop();
    words.push(username);
    setInputText(words.join(' ') + ' ');
    setIsMentionOpen(false);
  };

  const handleStartDirectChat = (emp: BrandEmployee) => {
    setDirectRecipient(emp);
    setActiveChannel('direct');
    toast.info('Buka Chat Pribadi', `Percakapan langsung dengan ${emp.name} (${emp.roleTitle})`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImage(reader.result);
        toast.info('Gambar Dilampirkan', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    const mentionsFound = inputText.match(/@[\w.]+/g) || [];

    sendMessage({
      brandId,
      branchId: activeChannel === 'branch' ? branchId : undefined,
      recipientId: activeChannel === 'direct' && directRecipient ? directRecipient.id : undefined,
      scope: activeChannel,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderUsername: `@${currentUser.name.toLowerCase().replace(/\s+/g, '.')}`,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      text: inputText.trim() || 'Mengirim gambar lampiran',
      mediaUrl: attachedImage || undefined,
      mediaType: attachedImage ? 'image' : undefined,
      fileName: attachedFileName || undefined,
      mentions: mentionsFound,
    });

    setInputText('');
    setAttachedImage(null);
    setAttachedFileName('');
    setIsMentionOpen(false);
  };

  const handleCreatePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOpts = pollOptions.filter((o) => o.trim().length > 0);
    if (!pollQuestion.trim() || validOpts.length < 2) {
      toast.warning('Data Polling Belum Lengkap', 'Pertanyaan dan minimal 2 opsi wajib diisi.');
      return;
    }

    createPoll({
      brandId,
      branchId: activeChannel === 'branch' ? branchId : undefined,
      scope: activeChannel === 'direct' ? 'brand' : activeChannel,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderUsername: `@${currentUser.name.toLowerCase().replace(/\s+/g, '.')}`,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      question: pollQuestion,
      options: validOpts,
    });

    setIsCreatePollOpen(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleSaveHappeningNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!happeningNowDraft.trim()) return;

    setHappeningNow(brandId, happeningNowDraft.trim(), `${currentUser.name} (${currentUser.role})`);
    setIsHappeningNowEditing(false);
  };

  const filteredEmployeesForMention = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(mentionFilter) ||
      emp.roleTitle.toLowerCase().includes(mentionFilter)
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-hidden relative">
      {/* 1. LEFT SIDEBAR CHANNELS & MEMBERS (ALA TELEGRAM/WHATSAPP) */}
      <aside className="w-80 md:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💬</span>
            <div>
              <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Modula Realtime Team Chat
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                {currentBrand?.name || 'Kopi Nusantara'} • Live Enterprise Sync
              </p>
            </div>
          </div>

          {/* CHANNELS SWITCHER */}
          <div className="space-y-1.5 pt-1">
            {/* CHANNEL 1: BRAND HEADQUARTERS */}
            <button
              type="button"
              onClick={() => {
                setActiveChannel('brand');
                setDirectRecipient(null);
              }}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                activeChannel === 'brand'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-sm ring-1 ring-red-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-600/30 flex-shrink-0">
                🏢
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                    Brand HQ Team Chat
                  </span>
                  <span className="text-[9px] bg-red-600 text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
                    ALL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  Seluruh staf & manajer {currentBrand?.name}
                </p>
              </div>
            </button>

            {/* CHANNEL 2: BRANCH LOCAL CHAT */}
            <button
              type="button"
              onClick={() => {
                setActiveChannel('branch');
                setDirectRecipient(null);
              }}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                activeChannel === 'branch'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-sm ring-1 ring-red-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/30 flex-shrink-0">
                📍
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                    {currentBranch?.name || 'Outlet Grand Indonesia'}
                  </span>
                  <span className="text-[9px] bg-blue-600 text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
                    CABANG
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  Khusus tim kasir, barista & staf {currentBranch?.code || 'GI-01'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* TEAM DIRECTORY / ONLINE MEMBERS LIST & DIRECT CHAT */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <span>Direct Chat / Anggota ({employees.length})</span>
            <span className="text-emerald-500">● Live</span>
          </div>

          <div className="space-y-1.5">
            {employees.map((emp) => {
              const isSelected = activeChannel === 'direct' && directRecipient?.id === emp.id;

              return (
                <div
                  key={emp.id}
                  onClick={() => handleStartDirectChat(emp)}
                  className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate flex items-center space-x-1">
                        <span>{emp.name}</span>
                        {emp.role === 'owner' && <span>👑</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {emp.roleTitle} • {emp.branchName.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 hover:text-red-500 font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    DM
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CHAT WINDOW */}
      <main className="flex-1 flex flex-col justify-between bg-slate-100 dark:bg-slate-950 relative">
        {/* HAPPENING NOW BROADCAST BEACON (TOP BAR) */}
        {currentHappeningNow && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white px-6 py-2 flex items-center justify-between text-xs shadow-md">
            <div className="flex items-center space-x-2 truncate">
              <span className="animate-bounce">⚡</span>
              <span className="font-bold font-mono text-[10px] bg-black/30 px-2 py-0.5 rounded-full uppercase">
                HAPPENING NOW
              </span>
              <span className="font-medium truncate">{currentHappeningNow.text}</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono flex-shrink-0">
              <span className="opacity-80">oleh {currentHappeningNow.updatedBy}</span>
              {isExecutive && (
                <button
                  type="button"
                  onClick={() => {
                    setHappeningNowDraft(currentHappeningNow.text);
                    setIsHappeningNowEditing(true);
                  }}
                  className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-bold"
                >
                  ✏️ Ubah Status
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top Chat Room Header */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {activeChannel === 'brand' ? '🏢' : activeChannel === 'branch' ? '📍' : '🔒'}
            </span>
            <div>
              <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>
                  {activeChannel === 'brand'
                    ? `Saluran Brand Utama (${currentBrand?.name || 'Kopi Nusantara'})`
                    : activeChannel === 'branch'
                    ? `Saluran Khusus Outlet (${currentBranch?.name || 'Outlet Grand Indonesia'})`
                    : `Direct Chat: ${directRecipient?.name} (${directRecipient?.roleTitle})`}
                </span>
                {activeChannel === 'direct' && (
                  <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono px-2 py-0.2 rounded-full font-bold">
                    PERSONAL DM
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {activeChannel === 'brand'
                  ? 'Komunikasi Terbuka Seluruh Cabang & Holding'
                  : activeChannel === 'branch'
                  ? 'Internal Tim Operasional Cabang Aktif'
                  : 'Percakapan Pribadi Terisolasi & Terenkripsi'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isExecutive && !currentHappeningNow && (
              <button
                type="button"
                onClick={() => {
                  setHappeningNowDraft('🔥 Promo Spesial / Status Operasional Hari Ini');
                  setIsHappeningNowEditing(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>⚡</span>
                <span>Buat Happening Now</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCreatePollOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Buat Polling Suara"
            >
              <span>📊</span>
              <span>Buat Polling</span>
            </button>
          </div>
        </header>

        {/* PINNED MESSAGE BANNER */}
        {pinnedMessage && (
          <div className="bg-red-50 dark:bg-red-950/60 border-b border-red-200 dark:border-red-900/60 px-6 py-2 flex items-center justify-between text-xs text-red-900 dark:text-red-200 font-medium">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-base flex-shrink-0">📌</span>
              <span className="font-bold font-mono text-[10px] bg-red-200 dark:bg-red-900 px-1.5 py-0.2 rounded">
                PINNED
              </span>
              <span className="truncate">{pinnedMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => togglePinMessage(pinnedMessage.id)}
              className="text-red-500 hover:text-red-700 font-bold ml-2 text-xs"
              title="Lepas Pin"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. MESSAGE STREAM VIEW */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {channelMessages.length === 0 && (
            <div className="text-center p-12 space-y-3">
              <span className="text-4xl">💬</span>
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                Belum ada pesan di percakapan ini
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Kirim pesan pertama, bagikan foto dokumen, polling suara, atau mention rekan kerja Anda.
              </p>
            </div>
          )}

          {channelMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Profile Photo */}
                <img
                  src={
                    msg.senderAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={msg.senderName}
                  className="w-9 h-9 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0 mt-1"
                />

                {/* Message Bubble Container */}
                <div
                  className={`max-w-lg rounded-3xl p-4 shadow-sm space-y-2 relative group transition-all ${
                    isMe
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex justify-between items-center gap-3 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className={`font-bold ${isMe ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {msg.senderName}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isMe
                            ? 'bg-red-700 text-red-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {msg.senderRole.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className={`text-[9px] font-mono ${isMe ? 'text-red-200' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* Quick Reaction Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReactionMsgId(msg.id);
                          setIsEmojiPickerOpen(true);
                        }}
                        className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1 ${
                          isMe ? 'text-red-200 hover:text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Beri Reaksi Emoticon"
                      >
                        🐷+
                      </button>

                      {/* Pin Button */}
                      <button
                        type="button"
                        onClick={() => togglePinMessage(msg.id)}
                        className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1 ${
                          isMe ? 'text-red-200 hover:text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title={msg.isPinned ? 'Lepas Pin' : 'Sematkan Pesan'}
                      >
                        📌
                      </button>
                    </div>
                  </div>

                  {/* Attached Image */}
                  {msg.mediaUrl && msg.mediaType === 'image' && (
                    <div className="rounded-2xl overflow-hidden border border-black/10 max-h-64 cursor-pointer">
                      <img src={msg.mediaUrl} alt="Attachment" className="w-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  )}

                  {/* Text Message with Mention Highlighting */}
                  <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">
                    {msg.text.split(' ').map((word, i) => {
                      if (word.startsWith('@')) {
                        return (
                          <span
                            key={i}
                            className={`font-bold underline cursor-pointer mr-1 ${
                              isMe ? 'text-amber-200' : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {word}{' '}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </p>

                  {/* LIVE INTERACTIVE POLLING WIDGET */}
                  {msg.poll && (
                    <div className="p-3 bg-black/10 dark:bg-slate-950/60 rounded-2xl border border-white/10 dark:border-slate-800 space-y-2.5">
                      <div className="font-bold text-xs">{msg.poll.question}</div>
                      <div className="space-y-1.5">
                        {msg.poll.options.map((opt) => {
                          const hasVoted = opt.votes.includes(currentUser.id);
                          const total = msg.poll?.totalVotes || 1;
                          const pct = Math.round((opt.votes.length / (msg.poll?.totalVotes || 1)) * 100);

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => votePoll(msg.id, opt.id, currentUser.id)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all relative overflow-hidden border ${
                                hasVoted
                                  ? 'border-red-400 bg-red-500/20 font-bold'
                                  : 'border-slate-300 dark:border-slate-700 bg-white/10 hover:bg-white/20'
                              }`}
                            >
                              <div
                                className="absolute top-0 bottom-0 left-0 bg-red-500/30 rounded-xl transition-all"
                                style={{ width: `${pct}%` }}
                              />
                              <div className="relative z-10 flex justify-between items-center">
                                <span>
                                  {hasVoted ? '✓ ' : ''}
                                  {opt.text}
                                </span>
                                <span className="font-mono text-[10px] font-bold">
                                  {opt.votes.length} suara ({pct}%)
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono text-right">
                        Total {msg.poll.totalVotes} Suara Masuk
                      </div>
                    </div>
                  )}

                  {/* EMOJI REACTIONS ROW */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.reactions.map((r, idx) => {
                        const isReacted = r.userIds.includes(currentUser.id);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => addReaction(msg.id, r.emoji, currentUser.id)}
                            className={`px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 transition-all border ${
                              isReacted
                                ? 'bg-red-500/30 border-red-400 font-bold'
                                : 'bg-black/10 dark:bg-white/10 border-transparent hover:border-slate-400'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[10px] font-mono">{r.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* 4. MENTION AUTOCOMPLETE POPUP */}
        {isMentionOpen && (
          <div className="absolute bottom-20 left-6 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 max-w-sm w-full max-h-48 overflow-y-auto text-xs space-y-1">
            <div className="text-[10px] text-slate-400 font-mono px-2 py-1 uppercase font-bold">
              Pilih Karyawan untuk Mention:
            </div>
            {filteredEmployeesForMention.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectMention(emp)}
                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2 cursor-pointer"
              >
                <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-lg object-cover" />
                <div className="flex-1 truncate">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                    @{emp.name.toLowerCase().replace(/\s+/g, '.')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. ATTACHMENT PREVIEW BAR */}
        {attachedImage && (
          <div className="px-6 py-2 bg-slate-200 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <img src={attachedImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate">
                {attachedFileName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAttachedImage(null);
                setAttachedFileName('');
              }}
              className="text-rose-500 font-bold hover:underline"
            >
              Hapus Lampiran
            </button>
          </div>
        )}

        {/* 6. INPUT BAR (ALA TELEGRAM / WHATSAPP + EMOJI PICKER) */}
        <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
          {/* EMOJI PICKER POPUP */}
          {isEmojiPickerOpen && (
            <div className="absolute bottom-16 left-4 z-40">
              <EnterpriseEmojiPicker
                onSelectEmoji={(emoji) => {
                  if (activeReactionMsgId) {
                    addReaction(activeReactionMsgId, emoji, currentUser.id);
                    setActiveReactionMsgId(null);
                  } else {
                    setInputText((prev) => `${prev}${emoji} `);
                  }
                  setIsEmojiPickerOpen(false);
                }}
                onClose={() => {
                  setIsEmojiPickerOpen(false);
                  setActiveReactionMsgId(null);
                }}
              />
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2.5 rounded-2xl text-base transition-all active:scale-95"
              title="Lampirkan Foto / Gambar"
            >
              📸
            </button>

            {/* EMOJI BUTTON (PIGGY / CORPORATE) */}
            <button
              type="button"
              onClick={() => {
                setActiveReactionMsgId(null);
                setIsEmojiPickerOpen(!isEmojiPickerOpen);
              }}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2.5 rounded-2xl text-base transition-all active:scale-95"
              title="Emoji Lucu & Babi Korporat"
            >
              🐷
            </button>

            <button
              type="button"
              onClick={() => setIsCreatePollOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2.5 rounded-2xl text-base transition-all active:scale-95"
              title="Buat Polling"
            >
              📊
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              placeholder={
                activeChannel === 'direct'
                  ? `Kirim pesan pribadi ke ${directRecipient?.name}...`
                  : `Ketik pesan di ${activeChannel === 'brand' ? 'Brand HQ' : currentBranch?.name}... (Ketik @ untuk mention)`
              }
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachedImage}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/30 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <span>Kirim</span>
              <span>🚀</span>
            </button>
          </form>
        </footer>
      </main>

      {/* 7. HAPPENING NOW EDIT MODAL */}
      {isHappeningNowEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚡</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Update Status 'Happening Now' Brand
                </h3>
              </div>
              <button onClick={() => setIsHappeningNowEditing(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveHappeningNow} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pesan Status Live (Tampil di atas seluruh chat karyawan):
                </label>
                <textarea
                  rows={3}
                  required
                  value={happeningNowDraft}
                  onChange={(e) => setHappeningNowDraft(e.target.value)}
                  placeholder="Contoh: 🔥 Promo Beli 1 Gratis 1 Hari Ini s/d Jam 22:00 WIB!"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHappeningNowEditing(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Publikasikan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. CREATE POLL MODAL */}
      {isCreatePollOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📊</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Buat Polling Tim Realtime
                </h3>
              </div>
              <button onClick={() => setIsCreatePollOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreatePollSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pertanyaan Polling:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Shift Lembur Lebaran"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Opsi Pilihan:
                </label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    required
                    placeholder={`Opsi ${idx + 1}...`}
                    value={opt}
                    onChange={(e) => {
                      const copy = [...pollOptions];
                      copy[idx] = e.target.value;
                      setPollOptions(copy);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5"
                  />
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="text-red-600 font-bold hover:underline text-[11px]"
                  >
                    + Tambah Opsi Lain
                  </button>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatePollOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Kirim Polling ke Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
