import React, { createContext, useContext, useReducer } from 'react';
import { CustomQuoteState, CustomQuoteAction } from './quote-request-types';

const initialState: CustomQuoteState = {
  currentStep: 'structured-form',
  serviceId: 'custom-nail-art',
  serviceTitle: 'Diseño Personalizado & Mano Alzada',
  nailConfig: {
    nailType: 'extension',
    length: 'medium',
    shape: 'almond',
    existingProductToRemove: false,
    brokenNailsCount: 0,
  },
  designDetails: {
    colors: ['#f472b6'],
    finish: 'chrome',
    complexity: 'medium',
    charmsGems: false,
    sameDesignEveryNail: true,
    description: '',
  },
  referenceImages: [],
  schedulePref: {
    preferredTimeRange: 'afternoon',
    isFlexible: true,
  },
  isSubmitting: false,
};

function quoteRequestReducer(state: CustomQuoteState, action: CustomQuoteAction): CustomQuoteState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_NAIL_CONFIG':
      return { ...state, nailConfig: { ...state.nailConfig, ...action.payload } };
    case 'UPDATE_DESIGN_DETAILS':
      return { ...state, designDetails: { ...state.designDetails, ...action.payload } };
    case 'ADD_REFERENCE_IMAGE':
      return { ...state, referenceImages: [...state.referenceImages, action.payload] };
    case 'REMOVE_REFERENCE_IMAGE':
      return {
        ...state,
        referenceImages: state.referenceImages.filter((_, idx) => idx !== action.payload),
      };
    case 'UPDATE_SCHEDULE_PREF':
      return { ...state, schedulePref: { ...state.schedulePref, ...action.payload } };
    case 'SUBMIT_SUCCESS':
      return { ...state, submittedRequest: action.payload, currentStep: 'submitted' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface CustomQuoteContextType {
  state: CustomQuoteState;
  dispatch: React.Dispatch<CustomQuoteAction>;
}

const CustomQuoteContext = createContext<CustomQuoteContextType | undefined>(undefined);

export function CustomQuoteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quoteRequestReducer, initialState);
  return (
    <CustomQuoteContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomQuoteContext.Provider>
  );
}

export function useCustomQuote() {
  const context = useContext(CustomQuoteContext);
  if (!context) {
    throw new Error('useCustomQuote must be used within a CustomQuoteProvider');
  }
  return context;
}
