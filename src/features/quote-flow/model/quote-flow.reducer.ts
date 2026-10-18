import { QuoteFlowState, QuoteFlowAction, QuoteFlowStepId } from './quote-flow.types';

export const STEPS_ORDER: QuoteFlowStepId[] = [
  'service-selection',
  'nail-configuration',
  'design-details',
  'reference-images',
  'schedule-preferences',
  'review-submit',
];

export const initialQuoteFlowState: QuoteFlowState = {
  currentStep: 'service-selection',
  stepIndex: 0,
  serviceBasePrice: 650,
  nailConfig: {
    nailType: 'extension',
    length: 'medium',
    shape: 'almond',
    existingProductToRemove: false,
    brokenNailsCount: 0,
  },
  designDetails: {
    colors: ['#E8A0BF', '#FFFFFF'],
    finish: 'chrome',
    complexity: 'medium',
    charmsGems: false,
    sameDesignEveryNail: true,
    description: '',
  },
  referenceImages: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
  ],
  schedulePref: {
    preferredDate: '2026-08-20',
    preferredTimeRange: 'afternoon',
    isFlexible: true,
  },
  isAttributesConfirmed: true,
  inputMode: 'mixed',
  errors: {},
};

export function quoteFlowReducer(state: QuoteFlowState, action: QuoteFlowAction): QuoteFlowState {
  switch (action.type) {
    case 'SET_STEP': {
      const idx = STEPS_ORDER.indexOf(action.payload);
      return {
        ...state,
        currentStep: action.payload,
        stepIndex: idx !== -1 ? idx : state.stepIndex,
      };
    }
    case 'SELECT_SERVICE':
      return {
        ...state,
        serviceId: action.payload.id,
        serviceTitle: action.payload.title,
        serviceBasePrice: action.payload.basePrice,
      };
    case 'UPDATE_NAIL_CONFIG':
      return {
        ...state,
        nailConfig: { ...state.nailConfig, ...action.payload },
      };
    case 'UPDATE_DESIGN_DETAILS':
      return {
        ...state,
        designDetails: { ...state.designDetails, ...action.payload },
      };
    case 'ADD_REFERENCE_IMAGE':
      return {
        ...state,
        referenceImages: [...state.referenceImages, action.payload],
        inputMode: state.inputMode === 'structured' ? 'photo' : 'mixed',
      };
    case 'REMOVE_REFERENCE_IMAGE':
      return {
        ...state,
        referenceImages: state.referenceImages.filter((_, idx) => idx !== action.payload),
      };
    case 'UPDATE_SCHEDULE_PREF':
      return {
        ...state,
        schedulePref: { ...state.schedulePref, ...action.payload },
      };
    case 'SELECT_INSPIRATION':
      return {
        ...state,
        selectedInspiration: action.payload,
        referenceImages: action.payload.imageUrl ? [action.payload.imageUrl, ...state.referenceImages] : state.referenceImages,
        designDetails: {
          ...state.designDetails,
          finish: action.payload.finish || state.designDetails.finish,
          colors: action.payload.colors.length > 0 ? action.payload.colors : state.designDetails.colors,
        },
      };
    case 'SET_SUGGESTED_ATTRIBUTES':
      return {
        ...state,
        suggestedAttributes: action.payload,
        isAttributesConfirmed: false,
      };
    case 'CONFIRM_SUGGESTED_ATTRIBUTES':
      return {
        ...state,
        isAttributesConfirmed: true,
        designDetails: {
          ...state.designDetails,
          finish: state.suggestedAttributes?.finish || state.designDetails.finish,
          complexity: state.suggestedAttributes?.complexity || state.designDetails.complexity,
        },
      };
    case 'SET_SUBMITTED_REQUEST':
      return {
        ...state,
        submittedRequest: action.payload,
      };
    case 'SET_OFFICIAL_QUOTE':
      return {
        ...state,
        officialQuote: action.payload,
      };
    case 'RESET_FLOW':
      return initialQuoteFlowState;
    default:
      return state;
  }
}
