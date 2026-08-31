import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from './useToastStore';

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
  scope: 'brand' | 'branch';
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
    timestamp: '2026-08-31T10:30:00Z',
  },
];

interface InternalChatState {
  messages: ChatMessage[];
  inspectionSessions: TicketInspectionSession[];

  sendMessage: (params: {
    brandId: string;
    branchId?: string;
    scope: 'brand' | 'branch';
    senderId: string;
    senderName: string;
    senderUsername: string;
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
    scope: 'brand' | 'branch';
    senderId: string;
    senderName: string;
    senderUsername: string;
    senderRole: string;
    senderAvatar?: string;
    question: string;
    options: string[];
  }) => ChatMessage;

  votePoll: (messageId: string, optionId: string, userId: string) => void;
  togglePinMessage: (messageId: string) => void;
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

      sendMessage: (params) => {
        const newMsg: ChatMessage = {
          id: `msg-${Date.now().toString().slice(-6)}`,
          brandId: params.brandId,
          branchId: params.branchId,
          scope: params.scope,
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername,
          senderRole: params.senderRole,
          senderAvatar: params.senderAvatar,
          text: params.text,
          mediaUrl: params.mediaUrl,
          mediaType: params.mediaType,
          fileName: params.fileName,
          mentions: params.mentions,
          ticketId: params.ticketId,
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
          scope: params.scope,
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername,
          senderRole: params.senderRole,
          senderAvatar: params.senderAvatar,
          text: `📊 Polling: ${params.question}`,
          poll,
          timestamp: new Date().toISOString(),
        };

        set({ messages: [...get().messages, newMsg] });
        toast.success('Polling Dibuat', params.question);
        return newMsg;
      },

      votePoll: (messageId, optionId, userId) => {
        const updated = get().messages.map((m) => {
          if (m.id !== messageId || !m.poll) return m;

          // Remove user previous vote from all options
          const cleanOptions = m.poll.options.map((opt) => ({
            ...opt,
            votes: opt.votes.filter((uid) => uid !== userId),
          }));

          // Add user vote to selected option
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
