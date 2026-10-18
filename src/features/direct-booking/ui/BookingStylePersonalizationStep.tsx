import React, { forwardRef } from 'react';
import { 
  NailCustomizerStep, 
  NailCustomizerStepProps, 
  NailCustomizerStepHandle 
} from '@/shared/components/NailCustomizerStep';

export type BookingStylePersonalizationStepProps = NailCustomizerStepProps;
export type BookingStylePersonalizationStepHandle = NailCustomizerStepHandle;

/**
 * BookingStylePersonalizationStep is a 100% exact parity alias to NailCustomizerStep,
 * guaranteeing identical layout, sub-steps, animations, SVG visualizer, color palettes,
 * and haptic feedback between "Cotizar con IA" (Paso 2) and "Agendar Cita" (Paso 3).
 */
export const BookingStylePersonalizationStep = forwardRef<BookingStylePersonalizationStepHandle, BookingStylePersonalizationStepProps>(
  (props, ref) => {
    return <NailCustomizerStep ref={ref} {...props} />;
  }
);

BookingStylePersonalizationStep.displayName = 'BookingStylePersonalizationStep';

export default BookingStylePersonalizationStep;
