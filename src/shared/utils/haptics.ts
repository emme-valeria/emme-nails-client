/**
 * Haptic Feedback & Physical Vibration Controller
 * Provides standardized tactile vibrations across user interactions and reservation milestones.
 * Includes graceful degradation for devices/browsers without physical vibration engines.
 */

export const HAPTIC_PATTERNS: Record<string, number | number[]> = {
  /** Light crisp feedback on selecting options (swatch, shape, time, extra) */
  selection: [15],
  /** Smooth confirmation when advancing between booking steps */
  stepAdvance: [20, 35, 20],
  /** Instant verification feedback (e.g. valid phone number, coupon applied) */
  validationSuccess: [20, 35, 20],
  /** Triumphant VIP reservation & payment confirmed pattern */
  reservationConfirmed: [25, 40, 20, 50],
  /** Warning or alert pattern for missing fields */
  warning: [40, 60]
};

export type HapticType = 'selection' | 'stepAdvance' | 'validationSuccess' | 'reservationConfirmed' | 'warning';

/**
 * Triggers physical vibration on supported mobile devices
 */
export function triggerHaptic(type: HapticType | number | number[] = 'selection'): boolean {
  if (typeof window === 'undefined') return false;

  try {
    if ('navigator' in window && 'vibrate' in window.navigator) {
      let pattern: number | number[];
      if (typeof type === 'string') {
        pattern = HAPTIC_PATTERNS[type] || [15];
      } else {
        pattern = type;
      }
      return window.navigator.vibrate(pattern);
    }
  } catch {
    // Gracefully ignore on unsupported devices / browser sandboxes
  }
  return false;
}

/** Convenience shorthand for the user-requested [20, 35, 20] vibration */
export const triggerStepVibration = () => triggerHaptic('stepAdvance');
export const triggerSelectionVibration = () => triggerHaptic('selection');
export const triggerSuccessVibration = () => triggerHaptic('validationSuccess');
export const triggerConfirmedVibration = () => triggerHaptic('reservationConfirmed');
export const triggerHapticFeedback = (ms: number = 15) => triggerHaptic([ms]);
