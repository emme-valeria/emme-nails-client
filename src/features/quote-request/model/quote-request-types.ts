import { NailConfiguration, DesignDetails, SchedulePreference, QuoteRequest } from '@/domain/quotes/entities/QuoteRequest';

export type CustomQuoteStepId = 'structured-form' | 'inspiration-and-references' | 'review-and-submit' | 'submitted';

export interface CustomQuoteState {
  currentStep: CustomQuoteStepId;
  serviceId: string;
  serviceTitle: string;
  nailConfig: NailConfiguration;
  designDetails: DesignDetails;
  referenceImages: string[];
  schedulePref: SchedulePreference;
  submittedRequest?: QuoteRequest;
  isSubmitting: boolean;
}

export type CustomQuoteAction =
  | { type: 'SET_STEP'; payload: CustomQuoteStepId }
  | { type: 'UPDATE_NAIL_CONFIG'; payload: Partial<NailConfiguration> }
  | { type: 'UPDATE_DESIGN_DETAILS'; payload: Partial<DesignDetails> }
  | { type: 'ADD_REFERENCE_IMAGE'; payload: string }
  | { type: 'REMOVE_REFERENCE_IMAGE'; payload: number }
  | { type: 'UPDATE_SCHEDULE_PREF'; payload: Partial<SchedulePreference> }
  | { type: 'SUBMIT_SUCCESS'; payload: QuoteRequest }
  | { type: 'RESET' };
