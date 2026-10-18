import { NailConfiguration, DesignDetails, SchedulePreference, QuoteRequest, Quote } from '@/domain/quotes/entities/QuoteRequest';
import { DesignInspiration, SuggestedDesignAttributes } from '@/domain/quotes/entities/Inspiration';
import { InputMode } from '@/domain/quotes/entities/Analytics';

export type QuoteFlowStepId =
  | 'service-selection'
  | 'nail-configuration'
  | 'design-details'
  | 'reference-images'
  | 'schedule-preferences'
  | 'review-submit';

export interface QuoteFlowState {
  currentStep: QuoteFlowStepId;
  stepIndex: number;
  serviceId?: string;
  serviceTitle?: string;
  serviceBasePrice: number;
  nailConfig: NailConfiguration;
  designDetails: DesignDetails;
  referenceImages: string[];
  schedulePref: SchedulePreference;
  selectedInspiration?: DesignInspiration;
  suggestedAttributes?: SuggestedDesignAttributes;
  isAttributesConfirmed: boolean;
  inputMode: InputMode;
  submittedRequest?: QuoteRequest;
  officialQuote?: Quote;
  errors: Record<string, string>;
}

export type QuoteFlowAction =
  | { type: 'SET_STEP'; payload: QuoteFlowStepId }
  | { type: 'SELECT_SERVICE'; payload: { id: string; title: string; basePrice: number } }
  | { type: 'UPDATE_NAIL_CONFIG'; payload: Partial<NailConfiguration> }
  | { type: 'UPDATE_DESIGN_DETAILS'; payload: Partial<DesignDetails> }
  | { type: 'ADD_REFERENCE_IMAGE'; payload: string }
  | { type: 'REMOVE_REFERENCE_IMAGE'; payload: number }
  | { type: 'UPDATE_SCHEDULE_PREF'; payload: Partial<SchedulePreference> }
  | { type: 'SELECT_INSPIRATION'; payload: DesignInspiration }
  | { type: 'SET_SUGGESTED_ATTRIBUTES'; payload: SuggestedDesignAttributes }
  | { type: 'CONFIRM_SUGGESTED_ATTRIBUTES' }
  | { type: 'SET_SUBMITTED_REQUEST'; payload: QuoteRequest }
  | { type: 'SET_OFFICIAL_QUOTE'; payload: Quote }
  | { type: 'RESET_FLOW' };

