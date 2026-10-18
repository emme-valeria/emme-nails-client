export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  isOptional?: boolean;
}

export interface SelectionItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
  image?: string;
  priceDeltaMXN?: number;
}

export interface DecisionGroup {
  id: string;
  title: string;
  subtitle?: string;
  options: SelectionItem[];
  selectedId?: string | string[];
  allowMultiple?: boolean;
}

export interface SummaryItem {
  label: string;
  value: string;
  detail?: string;
  category?: string;
}

export interface PriceEstimate {
  totalMXN: number;
  depositMXN: number;
  minMXN?: number;
  maxMXN?: number;
  isEstimateOnly?: boolean;
  breakdown: Array<{ label: string; amountMXN: number }>;
}

export interface LivePreviewConfig {
  shape?: string;
  length?: string;
  colorName?: string;
  colorHex?: string;
  finish?: string;
  artStyle?: string;
  serviceTitle?: string;
  estimatedPrice?: number;
  estimatedDuration?: number;
}

export interface WizardShellProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepSubtitle?: string;
  onBack?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
  summaryItems: SummaryItem[];
  priceEstimate: PriceEstimate;
  livePreviewConfig?: LivePreviewConfig;
  showNavigation?: boolean;
  children: React.ReactNode;
}
