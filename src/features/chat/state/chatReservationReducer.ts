import { format, addDays } from 'date-fns';
import { 
  ChatReservationState, 
  ChatReservationAction, 
  ReservationAddOn,
  NailShape,
  NailLength,
  NailFinish,
  NailArtLevel 
} from '../types/reservationState';

export const DEFAULT_ADDON_OPTIONS: ReservationAddOn[] = [
  { id: 'addon-1', name: 'Efecto Chrome Mirror Espejo', price: 15, duration: 15, category: 'finish' },
  { id: 'addon-2', name: 'Cristales Swarovski (x4)', price: 12, duration: 10, category: 'art' },
  { id: 'addon-3', name: 'Refuerzo de Keratina Extra', price: 10, duration: 10, category: 'care' },
  { id: 'addon-4', name: 'Exfoliación Orgánica Spa de Manos', price: 15, duration: 15, category: 'care' },
  { id: 'addon-5', name: 'Retiro Cuidadoso de Esmalte Anterior', price: 15, duration: 15, category: 'removal' },
  { id: 'addon-6', name: 'Diseño Francés Degradado (Baby Boomer)', price: 20, duration: 20, category: 'art' }
];

export const INITIAL_RESERVATION_STATE: ChatReservationState = {
  step: 1,
  serviceId: 's1',
  serviceName: 'Manicura Rusa + Esmaltado Semi-permanente',
  serviceCategory: 'Manicura Rusa',
  serviceBasePrice: 45,
  serviceBaseDuration: 60,

  staffId: 'staff-1',
  staffName: 'Valeria Arriaza',
  staffRole: 'Senior Nail Artist & Master Rusa',
  staffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',

  dateStr: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  timeStr: '11:00',
  endTimeStr: '12:00',

  customization: {
    shape: 'almond',
    length: 'short',
    finish: 'glossy',
    artLevel: 'minimal',
    removalRequired: false,
    referenceImageUrl: undefined,
    specialNotes: ''
  },
  selectedAddOns: [],

  appliedLoyaltyPoints: 0,
  discountAmount: 0,
  appliedPromoCode: null,

  basePrice: 45,
  addOnsPrice: 0,
  customizationPrice: 10, // minimal art level +$10
  totalPrice: 55,
  depositAmount: 15,
  remainingBalance: 40,
  totalDurationMinutes: 60,

  clientInfo: {
    name: 'Valeria Arriaza',
    phone: '+52 55 4123 8970',
    email: 'valeria.client@emmestudio.mx',
    notes: 'Preferencia por acabado prolijo de cutícula'
  },

  paymentMethod: null,
  paymentStatus: 'unpaid',
  bookingRef: null,
  confirmedAppointmentId: null,
  createdAt: new Date().toISOString()
};

/**
 * Recalculates dynamic pricing & duration based on service, customization, add-ons, and discounts.
 */
export function calculateReservationPricing(
  state: Pick<
    ChatReservationState, 
    'serviceBasePrice' | 'serviceBaseDuration' | 'selectedAddOns' | 'customization' | 'discountAmount'
  >
): {
  basePrice: number;
  addOnsPrice: number;
  customizationPrice: number;
  totalPrice: number;
  depositAmount: number;
  remainingBalance: number;
  totalDurationMinutes: number;
} {
  const basePrice = state.serviceBasePrice || 0;
  const baseDuration = state.serviceBaseDuration || 60;

  // Add-ons total
  const addOnsPrice = (state.selectedAddOns || []).reduce((acc, curr) => acc + (curr.price || 0), 0);
  const addOnsDuration = (state.selectedAddOns || []).reduce((acc, curr) => acc + (curr.duration || 0), 0);

  // Customization surcharges
  let customPrice = 0;
  let customDuration = 0;

  if (state.customization) {
    // Length surcharge
    if (state.customization.length === 'medium') customPrice += 5;
    else if (state.customization.length === 'long') customPrice += 10;
    else if (state.customization.length === 'xl') customPrice += 15;

    // Art Level surcharge
    if (state.customization.artLevel === 'minimal') {
      customPrice += 10;
      customDuration += 10;
    } else if (state.customization.artLevel === 'moderate') {
      customPrice += 20;
      customDuration += 20;
    } else if (state.customization.artLevel === 'extravagant') {
      customPrice += 35;
      customDuration += 30;
    }

    // Chrome / Velvet finish
    if (state.customization.finish === 'chrome' || state.customization.finish === 'velvet') {
      customPrice += 12;
      customDuration += 10;
    }

    // Removal required
    if (state.customization.removalRequired) {
      customPrice += 15;
      customDuration += 15;
    }
  }

  const subtotal = basePrice + addOnsPrice + customPrice;
  const discount = Math.min(state.discountAmount || 0, subtotal);
  const totalPrice = Math.max(0, subtotal - discount);

  // Standard studio deposit: 30% of total or minimum $150 MXN / $15 USD
  const standardDeposit = Math.round(totalPrice * 0.3) || 15;
  const depositAmount = Math.min(standardDeposit, totalPrice);
  const remainingBalance = Math.max(0, totalPrice - depositAmount);
  const totalDurationMinutes = baseDuration + addOnsDuration + customDuration;

  return {
    basePrice,
    addOnsPrice,
    customizationPrice: customPrice,
    totalPrice,
    depositAmount,
    remainingBalance,
    totalDurationMinutes
  };
}

/**
 * Pure state reducer function for the Chat Reservation Flow
 */
export function chatReservationReducer(
  state: ChatReservationState = INITIAL_RESERVATION_STATE, 
  action: ChatReservationAction
): ChatReservationState {
  switch (action.type) {
    case 'SET_STEP': {
      return {
        ...state,
        step: action.payload.step
      };
    }

    case 'SELECT_SERVICE': {
      const newBasePrice = action.payload.price;
      const newDuration = action.payload.duration || 60;
      
      const pricing = calculateReservationPricing({
        serviceBasePrice: newBasePrice,
        serviceBaseDuration: newDuration,
        selectedAddOns: state.selectedAddOns,
        customization: state.customization,
        discountAmount: state.discountAmount
      });

      return {
        ...state,
        serviceId: action.payload.id,
        serviceName: action.payload.name,
        serviceCategory: action.payload.category || state.serviceCategory,
        serviceBasePrice: newBasePrice,
        serviceBaseDuration: newDuration,
        ...pricing,
        // Advance step if on step 1
        step: state.step === 1 ? 2 : state.step
      };
    }

    case 'SELECT_STAFF': {
      return {
        ...state,
        staffId: action.payload.id,
        staffName: action.payload.name,
        staffRole: action.payload.role || state.staffRole,
        staffAvatar: action.payload.avatar || state.staffAvatar,
        // Advance step if on step 2
        step: state.step === 2 ? 3 : state.step
      };
    }

    case 'SELECT_DATE_TIME': {
      return {
        ...state,
        dateStr: action.payload.dateStr,
        timeStr: action.payload.timeStr,
        endTimeStr: action.payload.endTimeStr || state.endTimeStr,
        // Advance step if on step 3
        step: state.step === 3 ? 4 : state.step
      };
    }

    case 'TOGGLE_ADDON': {
      const exists = state.selectedAddOns.some(a => a.id === action.payload.addOn.id);
      const newAddOns = exists
        ? state.selectedAddOns.filter(a => a.id !== action.payload.addOn.id)
        : [...state.selectedAddOns, action.payload.addOn];

      const pricing = calculateReservationPricing({
        serviceBasePrice: state.serviceBasePrice,
        serviceBaseDuration: state.serviceBaseDuration,
        selectedAddOns: newAddOns,
        customization: state.customization,
        discountAmount: state.discountAmount
      });

      return {
        ...state,
        selectedAddOns: newAddOns,
        ...pricing
      };
    }

    case 'SET_ADDONS': {
      const newAddOns = action.payload.addOns;
      const pricing = calculateReservationPricing({
        serviceBasePrice: state.serviceBasePrice,
        serviceBaseDuration: state.serviceBaseDuration,
        selectedAddOns: newAddOns,
        customization: state.customization,
        discountAmount: state.discountAmount
      });

      return {
        ...state,
        selectedAddOns: newAddOns,
        ...pricing
      };
    }

    case 'UPDATE_CUSTOMIZATION': {
      const updatedCustom = {
        ...state.customization,
        ...action.payload
      };

      const pricing = calculateReservationPricing({
        serviceBasePrice: state.serviceBasePrice,
        serviceBaseDuration: state.serviceBaseDuration,
        selectedAddOns: state.selectedAddOns,
        customization: updatedCustom,
        discountAmount: state.discountAmount
      });

      return {
        ...state,
        customization: updatedCustom,
        ...pricing
      };
    }

    case 'UPDATE_CLIENT_INFO': {
      return {
        ...state,
        clientInfo: {
          ...state.clientInfo,
          ...action.payload
        }
      };
    }

    case 'APPLY_LOYALTY_POINTS': {
      const discount = Math.floor(action.payload.points / 100) * (action.payload.discountPerHundred || 10);
      const pricing = calculateReservationPricing({
        serviceBasePrice: state.serviceBasePrice,
        serviceBaseDuration: state.serviceBaseDuration,
        selectedAddOns: state.selectedAddOns,
        customization: state.customization,
        discountAmount: discount
      });

      return {
        ...state,
        appliedLoyaltyPoints: action.payload.points,
        discountAmount: discount,
        ...pricing
      };
    }

    case 'APPLY_PROMO_CODE': {
      const pricing = calculateReservationPricing({
        serviceBasePrice: state.serviceBasePrice,
        serviceBaseDuration: state.serviceBaseDuration,
        selectedAddOns: state.selectedAddOns,
        customization: state.customization,
        discountAmount: action.payload.discountAmount
      });

      return {
        ...state,
        appliedPromoCode: action.payload.promoCode,
        discountAmount: action.payload.discountAmount,
        ...pricing
      };
    }

    case 'REMOVE_DISCOUNTS': {
      const pricing = calculateReservationPricing({
        serviceBasePrice: state.serviceBasePrice,
        serviceBaseDuration: state.serviceBaseDuration,
        selectedAddOns: state.selectedAddOns,
        customization: state.customization,
        discountAmount: 0
      });

      return {
        ...state,
        appliedLoyaltyPoints: 0,
        appliedPromoCode: null,
        discountAmount: 0,
        ...pricing
      };
    }

    case 'PREFILL_FROM_PROPOSAL': {
      const newBasePrice = action.payload.servicePrice;
      const pricing = calculateReservationPricing({
        serviceBasePrice: newBasePrice,
        serviceBaseDuration: 60,
        selectedAddOns: state.selectedAddOns,
        customization: state.customization,
        discountAmount: state.discountAmount
      });

      return {
        ...state,
        serviceId: action.payload.serviceId,
        serviceName: action.payload.serviceName,
        serviceBasePrice: newBasePrice,
        staffId: action.payload.staffId || state.staffId,
        staffName: action.payload.staffName || state.staffName,
        dateStr: action.payload.dateStr,
        timeStr: action.payload.timeStr,
        depositAmount: action.payload.depositAmount || pricing.depositAmount,
        step: 6, // Proposal review step
        ...pricing
      };
    }

    case 'PREFILL_FROM_QUOTE': {
      const updatedCustom: typeof state.customization = {
        ...state.customization,
        shape: action.payload.shape || state.customization.shape,
        length: action.payload.length || state.customization.length,
        finish: action.payload.finish || state.customization.finish,
        artLevel: action.payload.artLevel || state.customization.artLevel,
        removalRequired: action.payload.removalRequired ?? state.customization.removalRequired,
        referenceImageUrl: action.payload.referenceImageUrl || state.customization.referenceImageUrl
      };

      const pricing = calculateReservationPricing({
        serviceBasePrice: action.payload.totalPrice,
        serviceBaseDuration: 90,
        selectedAddOns: state.selectedAddOns,
        customization: updatedCustom,
        discountAmount: state.discountAmount
      });

      return {
        ...state,
        serviceName: action.payload.serviceName,
        serviceBasePrice: action.payload.totalPrice,
        customization: updatedCustom,
        step: 4, // Customization / Review step
        ...pricing
      };
    }

    case 'CONFIRM_DIRECT_BOOKING': {
      return {
        ...state,
        paymentStatus: 'unpaid',
        bookingRef: `EMME-DIR-${Math.floor(1000 + Math.random() * 9000)}`,
        confirmedAppointmentId: action.payload?.appointmentId || `apt-${Date.now()}`,
        step: 8 // Confirmed Booking Pass
      };
    }

    case 'CONFIRM_PAYMENT': {
      return {
        ...state,
        paymentMethod: action.payload.paymentMethod,
        paymentStatus: 'deposit_paid',
        bookingRef: action.payload.bookingRef,
        confirmedAppointmentId: action.payload.appointmentId || `apt-${Date.now()}`,
        step: 8 // Confirmed Booking Pass
      };
    }

    case 'RESET_RESERVATION': {
      return {
        ...INITIAL_RESERVATION_STATE,
        createdAt: new Date().toISOString()
      };
    }

    default:
      return state;
  }
}
