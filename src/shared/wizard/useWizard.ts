import { useState, useCallback } from 'react';

export interface UseWizardOptions<T> {
  initialStep?: number;
  totalSteps: number;
  initialData: T;
  onComplete?: (data: T) => void;
}

export function useWizard<T>({
  initialStep = 1,
  totalSteps,
  initialData,
  onComplete
}: UseWizardOptions<T>) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [data, setData] = useState<T>(initialData);

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (onComplete) {
      onComplete(data);
    }
  }, [currentStep, totalSteps, onComplete, data]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  // Auto-advance helper after single obvious selection
  const autoAdvance = useCallback((updates: Partial<T>, delayMs = 280) => {
    updateData(updates);
    setTimeout(() => {
      setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : prev));
    }, delayMs);
  }, [updateData, totalSteps]);

  return {
    currentStep,
    totalSteps,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    autoAdvance,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
}
