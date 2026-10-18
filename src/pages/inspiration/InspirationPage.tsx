import React from 'react';
import { InspirationWizardWidget } from '@/widgets/inspiration-wizard/ui/InspirationWizardWidget';

export function InspirationPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <InspirationWizardWidget />
    </div>
  );
}
