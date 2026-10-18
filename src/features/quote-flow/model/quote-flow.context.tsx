import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuoteFlowState, QuoteFlowAction, QuoteFlowStepId } from './quote-flow.types';
import { quoteFlowReducer, initialQuoteFlowState, STEPS_ORDER } from './quote-flow.reducer';
import { QuotePricingService } from '@/domain/quotes/services/QuotePricingService';

interface QuoteFlowContextType {
  state: QuoteFlowState;
  dispatch: React.Dispatch<QuoteFlowAction>;
  nextStep: () => void;
  prevStep: () => void;
  calculateEstimatedRange: () => { min: number; max: number };
  calculateEstimatedDuration: () => number;
}

const QuoteFlowContext = createContext<QuoteFlowContextType | undefined>(undefined);

export function QuoteFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quoteFlowReducer, initialQuoteFlowState);

  const nextStep = () => {
    if (state.stepIndex < STEPS_ORDER.length - 1) {
      dispatch({ type: 'SET_STEP', payload: STEPS_ORDER[state.stepIndex + 1] });
    }
  };

  const prevStep = () => {
    if (state.stepIndex > 0) {
      dispatch({ type: 'SET_STEP', payload: STEPS_ORDER[state.stepIndex - 1] });
    }
  };

  const calculateEstimatedRange = () => {
    return QuotePricingService.calculateEstimatedPriceRange(
      state.serviceBasePrice,
      state.nailConfig,
      state.designDetails
    );
  };

  const calculateEstimatedDuration = () => {
    return QuotePricingService.calculateDurationMinutes(
      state.nailConfig,
      state.designDetails
    );
  };

  return (
    <QuoteFlowContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        calculateEstimatedRange,
        calculateEstimatedDuration,
      }}
    >
      {children}
    </QuoteFlowContext.Provider>
  );
}

export function useQuoteFlow() {
  const context = useContext(QuoteFlowContext);
  if (!context) {
    throw new Error('useQuoteFlow must be used within a QuoteFlowProvider');
  }
  return context;
}
