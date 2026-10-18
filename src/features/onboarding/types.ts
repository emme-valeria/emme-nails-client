export type OnboardingGoalId = 'extensions' | 'natural_care' | 'pedi_spa' | 'lashes_brows';

export interface OnboardingState {
  // 1 or 2 Optional Fields
  clientName: string; // (Opcional)
  clientContact: string; // (Opcional: WhatsApp / IG)

  // Real EMME Studio Service Options
  goal: OnboardingGoalId;
  specificService: string; // e.g. 'Soft Gel (Full Cover)', 'Manicura Rusa', 'Acrílico Escultural'
  
  // Nail Aesthetics & Silhouettes
  shape: string;
  length: string;
  finish: string;
  artLevel: string; // 'Básico French', 'Glazed Chrome / Cat Eye', '3D Cristales & Nail Art'
  
  // Lashes & Brows
  lashStyle: string;
  browStyle: string;
  
  // Palette & Vibe
  colorName: string;
  colorHex: string;
  styleVibe: string;
  
  // 1-Tap Comfort & Preferences (No typing required)
  comfortPreferences: string[];
}
