import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from './useToastStore';

export interface ChatMessage {
  id: string;
  brandId: string; // strict multi-tenant isolation
  senderId: string;
  senderName: string;
  senderRole: 'cashier' | 'admin_brand' | 'owner' | 'super_user';
  senderAvatar?: string;
  text: string;
  ticketId?: string; // for superuser-owner inspection rooms
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
    brandId: 'b-01', // Kopi Nusantara Roastery
    senderId: 'usr-cashier-01',
    senderName: 'Siti Rahma',
    senderRole: 'cashier',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    text: 'Selamat pagi Pak Owner & Pak Admin, stok Cold Brew di GI tinggal 8 botol, perlu restock siang ini.',
    timestamp: '2026-09-01T02:10:00Z',
  },
  {
    id: 'msg-02',
    brandId: 'b-01',
    senderId: 'usr-admin-01',
    senderName: 'Budi Santoso (Admin Brand)',
    senderRole: 'admin_brand',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'Siap mbak Siti, sudah saya buatkan mutasi stok 10 botol dari Gudang Senopati.',
    timestamp: '2026-09-01T02:15:00Z',
  },
  {
    id: 'msg-03',
    brandId: 'b-01',
    senderId: 'usr-owner-01',
    senderName: 'Parikesit (Owner Brand)',
    senderRole: 'owner',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    text: 'Mantap tim, jangan lupa ingatkan pelanggan untuk kumpulkan poin CRM ya.',
    timestamp: '2026-09-01T02:20:00Z',
  },
  {
    id: 'msg-04',
    brandId: 'b-02', // Nusantara Retail Mart (Different Brand Isolated)
    senderId: 'usr-admin-02',
    senderName: 'Dewi Lestari (Admin Retail)',
    senderRole: 'admin_brand',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'Laporan barang retail cabang Kelapa Gading sudah di-update.',
    timestamp: '2026-09-01T02:25:00Z',
  },
];

interface InternalChatState {
  messages: ChatMessage[];
  inspectionSessions: TicketInspectionSession[];
  
  sendMessage: (params: {
    brandId: string;
    senderId: string;
    senderName: string;
    senderRole: 'cashier' | 'admin_brand' | 'owner' | 'super_user';
    senderAvatar?: string;
    text: string;
    ticketId?: string;
  }) => ChatMessage;

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

      sendMessage: ({ brandId, senderId, senderName, senderRole, senderAvatar, text, ticketId }) => {
        const newMsg: ChatMessage = {
          id: `msg-${Date.now().toString().slice(-6)}`,
          brandId,
          senderId,
          senderName,
          senderRole,
          senderAvatar,
          text,
          ticketId,
          timestamp: new Date().toISOString(),
        };

        set({ messages: [...get().messages, newMsg] });

        // Play chime sound and notification
        toast.info(`Pesan dari ${senderName} (${senderRole.replace('_', ' ')})`, text);

        return newMsg;
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
