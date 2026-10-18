import { create } from 'zustand';

export interface SelectedService {
  id: string;
  title: string;
  category: string;
  price: number;
  durationMinutes: number;
}

export interface SelectedStaff {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface SelectedAddOn {
  id: string;
  title: string;
  price: number;
}

export interface BookingDraft {
  selectedService?: SelectedService;
  selectedStaff?: SelectedStaff;
  selectedDate?: string;
  selectedTime?: string;
  addOns: SelectedAddOn[];
  useLoyaltyPoints: boolean;
  notes: string;
}

interface BookingStoreState {
  draft: BookingDraft;
  step: 1 | 2 | 3 | 4 | 5;
  savedBookings: Array<BookingDraft & { id: string; timestamp: string }>;

  // Actions
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectService: (service: SelectedService) => void;
  selectStaff: (staff: SelectedStaff) => void;
  setDateTime: (date: string, time: string) => void;
  toggleAddOn: (addOn: SelectedAddOn) => void;
  toggleLoyalty: () => void;
  setNotes: (notes: string) => void;
  calculateTotals: () => { subtotal: number; discount: number; total: number };
  saveDraft: (bookingId: string) => void;
  resetBooking: () => void;
}

const initialDraft: BookingDraft = {
  addOns: [],
  useLoyaltyPoints: false,
  notes: '',
};

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  draft: initialDraft,
  step: 1,
  savedBookings: [],

  setStep: (step) => set({ step }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(5, state.step + 1) as 1 | 2 | 3 | 4 | 5,
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(1, state.step - 1) as 1 | 2 | 3 | 4 | 5,
    })),

  selectService: (service) =>
    set((state) => ({
      draft: { ...state.draft, selectedService: service },
    })),

  selectStaff: (staff) =>
    set((state) => ({
      draft: { ...state.draft, selectedStaff: staff },
    })),

  setDateTime: (date, time) =>
    set((state) => ({
      draft: { ...state.draft, selectedDate: date, selectedTime: time },
    })),

  toggleAddOn: (addOn) =>
    set((state) => {
      const exists = state.draft.addOns.some((a) => a.id === addOn.id);
      const updatedAddOns = exists
        ? state.draft.addOns.filter((a) => a.id !== addOn.id)
        : [...state.draft.addOns, addOn];
      return {
        draft: { ...state.draft, addOns: updatedAddOns },
      };
    }),

  toggleLoyalty: () =>
    set((state) => ({
      draft: { ...state.draft, useLoyaltyPoints: !state.draft.useLoyaltyPoints },
    })),

  setNotes: (notes) =>
    set((state) => ({
      draft: { ...state.draft, notes },
    })),

  calculateTotals: () => {
    const { draft } = get();
    const servicePrice = draft.selectedService?.price || 0;
    const addOnsTotal = draft.addOns.reduce((acc, curr) => acc + curr.price, 0);
    const subtotal = servicePrice + addOnsTotal;
    const discount = draft.useLoyaltyPoints ? 5 : 0;
    const total = Math.max(0, subtotal - discount);

    return { subtotal, discount, total };
  },

  saveDraft: (bookingId) =>
    set((state) => ({
      savedBookings: [
        ...state.savedBookings,
        {
          id: bookingId,
          timestamp: new Date().toISOString(),
          ...state.draft,
        },
      ],
    })),

  resetBooking: () =>
    set({
      draft: initialDraft,
      step: 1,
    }),
}));
