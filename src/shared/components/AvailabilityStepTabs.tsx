import React from 'react';
import { UserCheck, Calendar, Clock } from 'lucide-react';
import { SegmentedCapsuleTabs, TabItem } from './SegmentedCapsuleTabs';

export type AvailabilitySubStep = 'staff' | 'date' | 'time';

export interface AvailabilityStepTabsProps {
  activeSubStep: AvailabilitySubStep;
  onChange: (subStep: AvailabilitySubStep) => void;
  staffName?: string;
  dateLabel?: string;
  timeSlot?: string;
  hasStaffSelected?: boolean;
  hasDateSelected?: boolean;
  hasTimeSelected?: boolean;
  onTabClick?: (subStep: AvailabilitySubStep) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  layoutId?: string;
}

export function AvailabilityStepTabs({
  activeSubStep,
  onChange,
  staffName,
  dateLabel,
  timeSlot,
  hasStaffSelected = false,
  hasDateSelected = false,
  hasTimeSelected = false,
  onTabClick,
  className,
  size = 'sm',
  layoutId = 'availability-flow-substeps',
}: AvailabilityStepTabsProps) {
  const tabs: TabItem<AvailabilitySubStep>[] = [
    {
      id: 'staff',
      label: '1. Especialista',
      detail: staffName ? `(${staffName.split(' ')[0]})` : undefined,
      icon: UserCheck,
      dotIndicator: hasStaffSelected && activeSubStep !== 'staff',
    },
    {
      id: 'date',
      label: '2. Fecha',
      detail: dateLabel ? `(${dateLabel})` : undefined,
      icon: Calendar,
      dotIndicator: hasDateSelected && activeSubStep !== 'date',
    },
    {
      id: 'time',
      label: '3. Horario',
      detail: timeSlot ? `(${timeSlot})` : undefined,
      icon: Clock,
      dotIndicator: hasTimeSelected && activeSubStep !== 'time',
    },
  ];

  return (
    <SegmentedCapsuleTabs<AvailabilitySubStep>
      items={tabs}
      value={activeSubStep}
      onChange={onChange}
      onTabClick={onTabClick}
      fullWidth
      size={size}
      layoutId={layoutId}
      className={className}
    />
  );
}
