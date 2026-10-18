import { ServiceOption } from '@/shared/components/ServiceSelector';
import { NailShape } from '@/shared/components/NailShapeSelector';
import { NailLength } from '@/shared/components/NailLengthSelector';
import { StaffOption } from '@/shared/components/AvailabilitySelector';
import { Appointment } from '@/domain/appointments/entities/Appointment';

export type DirectBookingStepId = 'select-service' | 'configure-options' | 'select-schedule' | 'confirmation';

export interface DirectBookingState {
  currentStep: DirectBookingStepId;
  selectedService?: ServiceOption;
  selectedShape: NailShape;
  selectedLength: NailLength;
  selectedAddOnIds: string[];
  selectedStaff?: StaffOption;
  selectedDate?: string;
  selectedTimeSlot?: string;
  confirmedAppointment?: Appointment;
  isSubmitting: boolean;
}

export type DirectBookingAction =
  | { type: 'SET_STEP'; payload: DirectBookingStepId }
  | { type: 'SELECT_SERVICE'; payload: ServiceOption }
  | { type: 'SET_SHAPE'; payload: NailShape }
  | { type: 'SET_LENGTH'; payload: NailLength }
  | { type: 'TOGGLE_ADDON'; payload: string }
  | { type: 'SELECT_STAFF'; payload: StaffOption }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME_SLOT'; payload: string }
  | { type: 'CONFIRM_BOOKING'; payload: Appointment }
  | { type: 'RESET' };
