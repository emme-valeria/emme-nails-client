import React, { createContext, useContext, useReducer } from 'react';
import { DirectBookingState, DirectBookingAction } from './booking-types';

const initialState: DirectBookingState = {
  currentStep: 'select-service',
  selectedShape: 'almond',
  selectedLength: 'short',
  selectedAddOnIds: [],
  isSubmitting: false,
};

function bookingReducer(state: DirectBookingState, action: DirectBookingAction): DirectBookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SELECT_SERVICE':
      return { ...state, selectedService: action.payload, currentStep: 'configure-options' };
    case 'SET_SHAPE':
      return { ...state, selectedShape: action.payload };
    case 'SET_LENGTH':
      return { ...state, selectedLength: action.payload };
    case 'TOGGLE_ADDON':
      return {
        ...state,
        selectedAddOnIds: state.selectedAddOnIds.includes(action.payload)
          ? state.selectedAddOnIds.filter((id) => id !== action.payload)
          : [...state.selectedAddOnIds, action.payload],
      };
    case 'SELECT_STAFF':
      return { ...state, selectedStaff: action.payload };
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_TIME_SLOT':
      return { ...state, selectedTimeSlot: action.payload };
    case 'CONFIRM_BOOKING':
      return { ...state, confirmedAppointment: action.payload, currentStep: 'confirmation' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface BookingContextType {
  state: DirectBookingState;
  dispatch: React.Dispatch<DirectBookingAction>;
}

const DirectBookingContext = createContext<BookingContextType | undefined>(undefined);

export function DirectBookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <DirectBookingContext.Provider value={{ state, dispatch }}>
      {children}
    </DirectBookingContext.Provider>
  );
}

export function useDirectBooking() {
  const context = useContext(DirectBookingContext);
  if (!context) {
    throw new Error('useDirectBooking must be used within a DirectBookingProvider');
  }
  return context;
}
