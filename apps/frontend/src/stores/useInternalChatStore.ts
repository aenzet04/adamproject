import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from './useToastStore';

export interface ChatReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface ChatPollOption {
  id: string;
  text: string;
  votes: string[]; // array of userIds
}

export interface ChatPoll {
  id: string;
  question: string;
  options: ChatPollOption[];
  createdBy: string;
  totalVotes: number;
}

export interface ChatMessage {
  id: string;
  brandId: string; // multi-tenant brand isolation
  branchId?: string; // optional: if branch-scoped
  recipientId?: string; // optional: if direct personal chat
  scope: 'brand' | 'branch' | 'direct';
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderRole: string;
  senderAvatar?: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'file';
  fileName?: string;
  isPinned?: boolean;
  poll?: ChatPoll;
  reactions?: ChatReaction[];
  mentions?: string[];
  ticketId?: string;
  timestamp: string;
}

export interface TicketInspectionSession {
  ticketId: string;
  brandId: string;
  brandName: string;
  superUserId: string;
  ownerId: string;
  authorizedUntil: string;
  reason: string;
  isActive: boolean;
}

export interface HappeningNowStatus {
  brandId: string;
  text: string;
  updatedAt: string;
  updatedBy: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    brandId: 'b-01',
    scope: 'brand',
    senderId: 'usr-owner-01',
    senderName: 'Parikesit (Owner)',
    senderUsername: '@parikesit.owner',
    senderRole: 'owner',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    text: '📌 PENGUMUMAN PENTING: Seluruh cabang diwajibkan menggunakan fitur Stok Opname fisik setiap hari Minggu sore.',
    isPinned: true,
    reactions: [
      { emoji: '🔥', count: 4, userIds: ['usr-cashier-01', 'usr-barista-01', 'usr-gm-01'] },
      { emoji: '🙏', count: 3, userIds: ['usr-cashier-01', 'usr-owner-01'] },
      { emoji: '🐷', count: 2, userIds: ['usr-barista-01'] },
    ],
    timestamp: '2026-08-31T08:00:00Z',
  },
  {
    id: 'msg-02',
    brandId: 'b-01',
    branchId: 'br-01',
    scope: 'branch',
    senderId: 'usr-cashier-01',
    senderName: 'Siti Rahma (Kasir GI)',
    senderUsername: '@siti.cashier',
    senderRole: 'cashier',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    text: 'Halo tim Barista GI @andi.barista, stok Fresh Milk Greenfield sisa 4 kotak, tolong restock dari gudang ya!',
    mentions: ['@andi.barista'],
    reactions: [{ emoji: '☕', count: 2, userIds: ['usr-barista-01'] }],
    timestamp: '2026-08-31T09:15:00Z',
  },
  {
    id: 'msg-03',
    brandId: 'b-01',
    branchId: 'br-01',
    scope: 'branch',
    senderId: 'usr-barista-01',
    senderName: 'Andi Saputra (Barista GI)',
    senderUsername: '@andi.barista',
    senderRole: 'staff',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    text: 'Siap mbak @siti.cashier! Sudah saya ambilkan 1 karton dari Gudang Utama Barista GI.',
    mediaUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    fileName: 'bukti_ambil_susu.jpg',
    mentions: ['@siti.cashier'],
    reactions: [{ emoji: '✨', count: 3, userIds: ['usr-cashier-01', 'usr-owner-01'] }],
    timestamp: '2026-08-31T09:18:00Z',
  },
  {
    id: 'msg-04',
    brandId: 'b-01',
    scope: 'brand',
    senderId: 'usr-gm-01',
    senderName: 'Bambang Supriyadi (GM)',
    senderUsername: '@bambang.gm',
    senderRole: 'general_manager',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    text: 'Mohon voting menu seasonal untuk promo akhir bulan:',
    poll: {
      id: 'poll-01',
      question: 'Varian Menu Seasonal Mana yang Paling Menjual?',
      options: [
        { id: 'opt-1', text: '🥥 Iced Coconut Aren Espresso', votes: ['usr-owner-01', 'usr-cashier-01'] },
        { id: 'opt-2', text: '🥑 Avocado Espresso Float', votes: ['usr-barista-01'] },
        { id: 'opt-3', text: '🍵 Strawberry Matcha Cheese Foam', votes: [] },
      ],
      createdBy: 'Bambang Supriyadi (GM)',
      totalVotes: 3,
    },
    reactions: [{ emoji: '🚀', count: 5, userIds: ['usr-owner-01', 'usr-cashier-01'] }],
    timestamp: '2026-08-31T10:30:00Z',
  },
  {
    id: 'msg-05',
    brandId: 'b-01',
    recipientId: 'usr-cashier-01',
    scope: 'direct',
    senderId: 'usr-owner-01',
    senderName: 'Parikesit (Owner)',
    senderUsername: '@parikesit.owner',
    senderRole: 'owner',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    text: 'Halo Siti, performa kasir kamu minggu ini tertinggi se-brand! Pertahankan ya, nanti ada bonus insentif dari manajemen.',
    timestamp: '2026-08-31T11:00:00Z',
  },
];

interface InternalChatState {
  messages: ChatMessage[];
  inspectionSessions: TicketInspectionSession[];
  happeningNowStatuses: Record<string, HappeningNowStatus>;

  sendMessage: (params: {
    brandId: string;
    branchId?: string;
    recipientId?: string;
    scope?: 'brand' | 'branch' | 'direct';
    senderId: string;
    senderName: string;
    senderUsername?: string;
    senderRole: string;
    senderAvatar?: string;
    text: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'file';
    fileName?: string;
    mentions?: string[];
    ticketId?: string;
  }) => ChatMessage;

  createPoll: (params: {
    brandId: string;
    branchId?: string;
    scope?: 'brand' | 'branch';
    senderId: string;
    senderName: string;
    senderUsername?: string;
    senderRole: string;
    senderAvatar?: string;
    question: string;
    options: string[];
  }) => ChatMessage;

  votePoll: (messageId: string, optionId: string, userId: string) => void;
  togglePinMessage: (messageId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  setHappeningNow: (brandId: string, text: string, updatedBy: string) => void;
  authorizeSuperUserTicket: (params: {
    ticketId: string;
    brandId: string;
    brandName: string;
    superUserId: string;
    ownerId: string;
    reason: string;
  }) => TicketInspectionSession;
  isSuperUserAuthorizedForBrand: (brandId: string) => boolean;
}

export const useInternalChatStore = create<InternalChatState>()(
  persist(
    (set, get) => ({
      messages: INITIAL_MESSAGES,
      inspectionSessions: [
        {
          ticketId: 'TCK-20260901-001',
          brandId: 'b-01',
          brandName: 'Kopi Nusantara Roastery',
          superUserId: 'usr-superuser-01',
          ownerId: 'usr-owner-01',
          authorizedUntil: '2026-09-02T23:59:59Z',
          reason: 'Diagnostik sinkronisasi saldo GL Akuntansi',
          isActive: true,
        },
      ],
      happeningNowStatuses: {
        'b-01': {
          brandId: 'b-01',
          text: '🔥 HAPPENING NOW: Grand Opening Promo Beli 1 Gratis 1 di Seluruh Cabang s/d Pukul 22:00 WIB!',
          updatedAt: '2026-08-31T08:00:00Z',
          updatedBy: 'Parikesit (Owner)',
        },
      },

      sendMessage: (params) => {
        const newMsg: ChatMessage = {
          id: `msg-${Date.now().toString().slice(-6)}`,
          brandId: params.brandId,
          branchId: params.branchId,
          recipientId: params.recipientId,
          scope: params.scope || 'brand',
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername || `@${params.senderName.toLowerCase().replace(/\s+/g, '.')}`,
          senderRole: params.senderRole,
          senderAvatar: params.senderAvatar,
          text: params.text,
          mediaUrl: params.mediaUrl,
          mediaType: params.mediaType,
          fileName: params.fileName,
          mentions: params.mentions,
          ticketId: params.ticketId,
          reactions: [],
          timestamp: new Date().toISOString(),
        };

        set({ messages: [...get().messages, newMsg] });
        toast.info(`Pesan dari ${params.senderName}`, params.text.substring(0, 50));
        return newMsg;
      },

      createPoll: (params) => {
        const pollId = `poll-${Date.now().toString().slice(-4)}`;
        const poll: ChatPoll = {
          id: pollId,
          question: params.question,
          options: params.options.map((opt, idx) => ({
            id: `opt-${idx + 1}`,
            text: opt,
            votes: [],
          })),
          createdBy: params.senderName,
          totalVotes: 0,
        };

        const newMsg: ChatMessage = {
          id: `msg-${Date.now().toString().slice(-6)}`,
          brandId: params.brandId,
          branchId: params.branchId,
          scope: params.scope || 'brand',
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername || `@${params.senderName.toLowerCase().replace(/\s+/g, '.')}`,
          senderRole: params.senderRole,
          senderAvatar: params.senderAvatar,
          text: `📊 Polling: ${params.question}`,
          poll,
          reactions: [],
          timestamp: new Date().toISOString(),
        };

        set({ messages: [...get().messages, newMsg] });
        toast.success('Polling Dibuat', params.question);
        return newMsg;
      },

      votePoll: (messageId, optionId, userId) => {
        const updated = get().messages.map((m) => {
          if (m.id !== messageId || !m.poll) return m;

          const cleanOptions = m.poll.options.map((opt) => ({
            ...opt,
            votes: opt.votes.filter((uid) => uid !== userId),
          }));

          const targetOpt = cleanOptions.find((opt) => opt.id === optionId);
          if (targetOpt) {
            targetOpt.votes.push(userId);
          }

          const total = cleanOptions.reduce((sum, opt) => sum + opt.votes.length, 0);

          return {
            ...m,
            poll: {
              ...m.poll,
              options: cleanOptions,
              totalVotes: total,
            },
          };
        });

        set({ messages: updated });
        toast.success('Suara Terekam', 'Pilihan polling berhasil di-update.');
      },

      togglePinMessage: (messageId) => {
        const updated = get().messages.map((m) =>
          m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
        );
        set({ messages: updated });
        toast.info('Status Pin Berubah', 'Pesan disematkan / dilepas.');
      },

      addReaction: (messageId, emoji, userId) => {
        const updated = get().messages.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = m.reactions ? [...m.reactions] : [];
          const existing = currentReactions.find((r) => r.emoji === emoji);

          if (existing) {
            if (existing.userIds.includes(userId)) {
              existing.userIds = existing.userIds.filter((uid) => uid !== userId);
              existing.count = existing.userIds.length;
            } else {
              existing.userIds.push(userId);
              existing.count = existing.userIds.length;
            }
          } else {
            currentReactions.push({
              emoji,
              count: 1,
              userIds: [userId],
            });
          }

          return {
            ...m,
            reactions: currentReactions.filter((r) => r.count > 0),
          };
        });

        set({ messages: updated });
      },

      setHappeningNow: (brandId, text, updatedBy) => {
        const current = { ...get().happeningNowStatuses };
        current[brandId] = {
          brandId,
          text,
          updatedAt: new Date().toISOString(),
          updatedBy,
        };
        set({ happeningNowStatuses: current });
        toast.success('Status Happening Now Diperbarui', text);
      },

      authorizeSuperUserTicket: ({ ticketId, brandId, brandName, superUserId, ownerId, reason }) => {
        const session: TicketInspectionSession = {
          ticketId,
          brandId,
          brandName,
          superUserId,
          ownerId,
          authorizedUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          reason,
          isActive: true,
        };

        set({
          inspectionSessions: [session, ...get().inspectionSessions.filter((s) => s.ticketId !== ticketId)],
        });

        toast.success(
          'Izin Tiket Diberikan',
          `Super User diizinkan menginspeksi data brand ${brandName} (Tiket #${ticketId})`
        );

        return session;
      },

      isSuperUserAuthorizedForBrand: (brandId: string) => {
        const active = get().inspectionSessions.find(
          (s) => s.brandId === brandId && s.isActive && new Date(s.authorizedUntil) > new Date()
        );
        return Boolean(active);
      },
    }),
    {
      name: 'modula_internal_chat_store',
    }
  )
);
