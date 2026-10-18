export type ChatWidgetType = 
  | 'catalog' 
  | 'staff' 
  | 'booking_flow' 
  | 'wizard_flow'
  | 'proposal_appointment'
  | 'secure_deposit'
  | 'confirmed_pass'
  | 'loyalty' 
  | 'style_advisor' 
  | 'aftercare' 
  | 'photo_quote' 
  | 'lash_selector'
  | null;

export type ReservationStep = 
  | 1 // Service Selection
  | 2 // Specialist Selection
  | 3 // Date & Time Selection
  | 4 // Customization & Add-ons
  | 5 // Client Details & Notes
  | 6 // Review & Proposal
  | 7 // Secure Deposit Checkout
  | 8; // Confirmed Booking Pass

export interface ReservationAddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  category?: 'art' | 'care' | 'removal' | 'finish';
}

export type NailShape = 'natural' | 'almond' | 'coffin' | 'square' | 'stiletto' | 'round';
export type NailLength = 'natural' | 'short' | 'medium' | 'long' | 'xl';
export type NailFinish = 'glossy' | 'matte' | 'chrome' | 'velvet' | 'glitter';
export type NailArtLevel = 'none' | 'minimal' | 'moderate' | 'extravagant';

export interface ReservationCustomization {
  shape: NailShape;
  length: NailLength;
  finish: NailFinish;
  artLevel: NailArtLevel;
  removalRequired: boolean;
  referenceImageUrl?: string;
  specialNotes: string;
}

export interface ReservationClientInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface ChatReservationState {
  step: ReservationStep;
  // Service info
  serviceId: string | null;
  serviceName: string | null;
  serviceCategory: string | null;
  serviceBasePrice: number;
  serviceBaseDuration: number;
  
  // Specialist info
  staffId: string | null;
  staffName: string | null;
  staffRole: string | null;
  staffAvatar: string | null;

  // Date & Time
  dateStr: string | null; // 'yyyy-MM-dd'
  timeStr: string | null; // '11:00'
  endTimeStr: string | null;

  // Customization & Addons
  customization: ReservationCustomization;
  selectedAddOns: ReservationAddOn[];

  // Loyalty & Perks
  appliedLoyaltyPoints: number;
  discountAmount: number;
  appliedPromoCode: string | null;

  // Financial Breakdown
  basePrice: number;
  addOnsPrice: number;
  customizationPrice: number;
  totalPrice: number;
  depositAmount: number;
  remainingBalance: number;
  totalDurationMinutes: number;

  // Client Details
  clientInfo: ReservationClientInfo;

  // Payment & Confirmation
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'spei' | 'cash_at_salon' | null;
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid';
  bookingRef: string | null;
  confirmedAppointmentId: string | null;
  createdAt: string;
}

export type ChatReservationAction =
  | { type: 'SET_STEP'; payload: { step: ReservationStep } }
  | { 
      type: 'SELECT_SERVICE'; 
      payload: { 
        id: string; 
        name: string; 
        category?: string; 
        price: number; 
        duration?: number;
      } 
    }
  | { 
      type: 'SELECT_STAFF'; 
      payload: { 
        id: string; 
        name: string; 
        role?: string; 
        avatar?: string;
      } 
    }
  | { 
      type: 'SELECT_DATE_TIME'; 
      payload: { 
        dateStr: string; 
        timeStr: string; 
        endTimeStr?: string;
      } 
    }
  | { 
      type: 'TOGGLE_ADDON'; 
      payload: { 
        addOn: ReservationAddOn;
      } 
    }
  | { 
      type: 'SET_ADDONS'; 
      payload: { 
        addOns: ReservationAddOn[];
      } 
    }
  | { 
      type: 'UPDATE_CUSTOMIZATION'; 
      payload: Partial<ReservationCustomization>;
    }
  | { 
      type: 'UPDATE_CLIENT_INFO'; 
      payload: Partial<ReservationClientInfo>;
    }
  | { 
      type: 'APPLY_LOYALTY_POINTS'; 
      payload: { 
        points: number; 
        discountPerHundred?: number;
      } 
    }
  | { 
      type: 'APPLY_PROMO_CODE'; 
      payload: { 
        promoCode: string; 
        discountAmount: number;
      } 
    }
  | { 
      type: 'REMOVE_DISCOUNTS'; 
    }
  | { 
      type: 'PREFILL_FROM_PROPOSAL'; 
      payload: {
        serviceId: string;
        serviceName: string;
        servicePrice: number;
        staffId?: string;
        staffName: string;
        dateStr: string;
        timeStr: string;
        depositAmount?: number;
      } 
    }
  | { 
      type: 'PREFILL_FROM_QUOTE'; 
      payload: {
        serviceName: string;
        totalPrice: number;
        shape?: NailShape;
        length?: NailLength;
        finish?: NailFinish;
        artLevel?: NailArtLevel;
        removalRequired?: boolean;
        referenceImageUrl?: string;
      } 
    }
  | { 
      type: 'CONFIRM_DIRECT_BOOKING'; 
      payload?: { 
        appointmentId?: string;
      };
    }
  | { 
      type: 'CONFIRM_PAYMENT'; 
      payload: { 
        paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'spei' | 'cash_at_salon';
        bookingRef: string;
        appointmentId?: string;
      } 
    }
  | { 
      type: 'RESET_RESERVATION'; 
    };
