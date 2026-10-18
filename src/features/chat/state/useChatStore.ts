import { create } from 'zustand';
import { 
  ChatWidgetType, 
  ChatReservationState, 
  ChatReservationAction, 
  ReservationStep,
  ReservationAddOn,
  ReservationCustomization,
  ReservationClientInfo,
  NailShape,
  NailLength,
  NailFinish,
  NailArtLevel
} from '../types/reservationState';
import { 
  chatReservationReducer, 
  INITIAL_RESERVATION_STATE, 
  DEFAULT_ADDON_OPTIONS 
} from './chatReservationReducer';

export * from '../types/reservationState';
export * from './chatReservationReducer';
export type WidgetType = ChatWidgetType;

interface ChatStoreState {
  activeWidget: ChatWidgetType;
  reservation: ChatReservationState;
  
  // Direct Reducer Dispatch
  dispatchReservation: (action: ChatReservationAction) => void;

  // Widget management
  setActiveWidget: (widget: ChatWidgetType) => void;

  // High-Level Helper Actions
  setStep: (step: ReservationStep) => void;
  selectService: (service: { id: string; name: string; category?: string; price: number; duration?: number }) => void;
  selectStaff: (staff: { id: string; name: string; role?: string; avatar?: string }) => void;
  selectDateTime: (dateStr: string, timeStr: string, endTimeStr?: string) => void;
  toggleAddOn: (addOn: ReservationAddOn) => void;
  setAddOns: (addOns: ReservationAddOn[]) => void;
  updateCustomization: (customization: Partial<ReservationCustomization>) => void;
  updateClientInfo: (clientInfo: Partial<ReservationClientInfo>) => void;
  applyLoyaltyPoints: (points: number, discountPerHundred?: number) => void;
  applyPromoCode: (promoCode: string, discountAmount: number) => void;
  removeDiscounts: () => void;
  prefillFromProposal: (proposal: {
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    staffId?: string;
    staffName: string;
    dateStr: string;
    timeStr: string;
    depositAmount?: number;
  }) => void;
  prefillFromQuote: (quote: {
    serviceName: string;
    totalPrice: number;
    shape?: NailShape;
    length?: NailLength;
    finish?: NailFinish;
    artLevel?: NailArtLevel;
    removalRequired?: boolean;
    referenceImageUrl?: string;
  }) => void;
  confirmDirectBooking: (appointmentId?: string) => void;
  confirmPayment: (paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'spei' | 'cash_at_salon', bookingRef: string, appointmentId?: string) => void;
  resetReservation: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  activeWidget: null,
  reservation: INITIAL_RESERVATION_STATE,

  dispatchReservation: (action: ChatReservationAction) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, action)
    })),

  setActiveWidget: (widget) => set({ activeWidget: widget }),

  setStep: (step) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'SET_STEP',
        payload: { step }
      })
    })),

  selectService: (service) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'SELECT_SERVICE',
        payload: service
      })
    })),

  selectStaff: (staff) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'SELECT_STAFF',
        payload: staff
      })
    })),

  selectDateTime: (dateStr, timeStr, endTimeStr) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'SELECT_DATE_TIME',
        payload: { dateStr, timeStr, endTimeStr }
      })
    })),

  toggleAddOn: (addOn) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'TOGGLE_ADDON',
        payload: { addOn }
      })
    })),

  setAddOns: (addOns) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'SET_ADDONS',
        payload: { addOns }
      })
    })),

  updateCustomization: (customization) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'UPDATE_CUSTOMIZATION',
        payload: customization
      })
    })),

  updateClientInfo: (clientInfo) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'UPDATE_CLIENT_INFO',
        payload: clientInfo
      })
    })),

  applyLoyaltyPoints: (points, discountPerHundred) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'APPLY_LOYALTY_POINTS',
        payload: { points, discountPerHundred }
      })
    })),

  applyPromoCode: (promoCode, discountAmount) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'APPLY_PROMO_CODE',
        payload: { promoCode, discountAmount }
      })
    })),

  removeDiscounts: () =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'REMOVE_DISCOUNTS'
      })
    })),

  prefillFromProposal: (proposal) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'PREFILL_FROM_PROPOSAL',
        payload: proposal
      })
    })),

  prefillFromQuote: (quote) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'PREFILL_FROM_QUOTE',
        payload: quote
      })
    })),

  confirmDirectBooking: (appointmentId) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'CONFIRM_DIRECT_BOOKING',
        payload: { appointmentId }
      })
    })),

  confirmPayment: (paymentMethod, bookingRef, appointmentId) =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'CONFIRM_PAYMENT',
        payload: { paymentMethod, bookingRef, appointmentId }
      })
    })),

  resetReservation: () =>
    set((state) => ({
      reservation: chatReservationReducer(state.reservation, {
        type: 'RESET_RESERVATION'
      })
    }))
}));
