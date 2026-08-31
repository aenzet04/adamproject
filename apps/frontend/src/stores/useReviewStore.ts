import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerReview } from '../types';

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    customerName: 'Dian Permata',
    rating: 5,
    menuItemId: 'prod-005',
    menuItemName: 'Kopi Aren Nusantara Latte',
    menuRating: 5,
    comment: 'Kopi arennya juara! Rasa gula arennya legit dan susunya creamy banget. Pelayanan kasir cepat.',
    createdAt: '2026-08-31T14:20:00Z',
    sentiment: 'positive',
  },
  {
    id: 'rev-02',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    customerName: 'Kevin Sanjaya',
    rating: 4,
    menuItemId: 'prod-004',
    menuItemName: 'Nasi Goreng Wagyu Spesial',
    menuRating: 5,
    comment: 'Wagyu empuk dan porsi pas. Tempatnya bersih dan nyaman untuk meeting.',
    createdAt: '2026-08-31T15:45:00Z',
    sentiment: 'positive',
  },
  {
    id: 'rev-03',
    branchId: 'br-02',
    branchName: 'Outlet Senopati',
    customerName: 'Amanda Putri',
    rating: 5,
    menuItemId: 'prod-003',
    menuItemName: 'Croissant Butter Paris',
    menuRating: 5,
    comment: 'Croissant flaky dan harum butter asli Prancis. Sangat cocok dinikmati dengan hot espresso!',
    createdAt: '2026-08-31T16:10:00Z',
    sentiment: 'positive',
  },
  {
    id: 'rev-04',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    customerName: 'Rudi Hartono',
    rating: 3,
    menuItemId: 'prod-006',
    menuItemName: 'Cold Brew Bottle 250ml',
    menuRating: 3,
    comment: 'Rasa agak terlalu asam untuk selera saya, tapi botolnya bagus dan dingin.',
    createdAt: '2026-08-30T10:15:00Z',
    sentiment: 'neutral',
  },
];

interface ReviewState {
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'createdAt'>) => void;
  getAverageRating: (branchId?: string) => number;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: INITIAL_REVIEWS,
      addReview: (newReview) => {
        const review: CustomerReview = {
          ...newReview,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ reviews: [review, ...get().reviews] });
      },
      getAverageRating: (branchId) => {
        const filtered = branchId
          ? get().reviews.filter((r) => r.branchId === branchId)
          : get().reviews;
        if (filtered.length === 0) return 5.0;
        const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
        return parseFloat((sum / filtered.length).toFixed(1));
      },
    }),
    {
      name: 'adam_customer_reviews',
    }
  )
);
