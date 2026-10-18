import React from 'react';
import { useLocation } from 'react-router-dom';
import { ServiceQualificationEngine } from '@/widgets/service-qualification/ui/ServiceQualificationEngine';

export function QuoteRequestPage() {
  const location = useLocation();
  const prefilledImage = location.state?.prefilledData?.imageUrl;

  return (
    <div className="min-h-screen bg-background p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ServiceQualificationEngine 
        initialInputMethod="photo" 
        initialPhotoUrl={prefilledImage} 
      />
    </div>
  );
}
