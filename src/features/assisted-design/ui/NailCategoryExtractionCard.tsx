import React, { useState } from 'react';
import { cn } from '@emme/ui/lib/utils';
import { NailPhotoDetailedAnalysis } from '@/domain/quotes/entities/Inspiration';
import { NailPhotoDetailProcessor } from '@/domain/quotes/infrastructure/ai/nail-photo-detail-processor';
import { NailUnifiedVerificationFlow } from './NailUnifiedVerificationFlow';
import { NailClientDesignSummaryCard } from './NailClientDesignSummaryCard';
import { NailArtistSpecSheetCard } from './NailArtistSpecSheetCard';

export interface NailCategoryExtractionCardProps {
  /** Existing detailed analysis data, or it will generate from imageUrl/text */
  analysis?: NailPhotoDetailedAnalysis;
  imageUrl?: string;
  imageDescription?: string;
  variant?: 'chat' | 'quote_service' | 'dashboard' | 'compact';
  initialViewMode?: 'client' | 'artist' | 'unified';
  onApplyToQuote?: (analysis: NailPhotoDetailedAnalysis) => void;
  onBookAppointment?: (analysis: NailPhotoDetailedAnalysis) => void;
  onSelectNewPhoto?: () => void;
  className?: string;
  showActions?: boolean;
}

export { NailUnifiedVerificationFlow, NailClientDesignSummaryCard, NailArtistSpecSheetCard };

export function NailCategoryExtractionCard({
  analysis: propAnalysis,
  imageUrl = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
  imageDescription = 'Foto de diseño para extracción por categorías',
  variant = 'quote_service',
  initialViewMode = 'unified',
  onApplyToQuote,
  onBookAppointment,
  onSelectNewPhoto,
  className = '',
  showActions = true,
}: NailCategoryExtractionCardProps) {
  // Load analysis if not directly provided
  const [analysis, setAnalysis] = useState<NailPhotoDetailedAnalysis>(() => {
    if (propAnalysis) return propAnalysis;
    return NailPhotoDetailProcessor.analyzeNailPhoto({
      imageUrl,
      textDescription: imageDescription,
    });
  });

  React.useEffect(() => {
    if (propAnalysis) {
      setAnalysis(propAnalysis);
    } else if (imageUrl) {
      const generated = NailPhotoDetailProcessor.analyzeNailPhoto({
        imageUrl,
        textDescription: imageDescription,
      });
      setAnalysis(generated);
    }
  }, [propAnalysis, imageUrl, imageDescription]);

  return (
    <div className={cn('w-full', className)}>
      <NailUnifiedVerificationFlow
        analysis={analysis}
        imageUrl={imageUrl}
        onApplyToQuote={onApplyToQuote}
        onBookAppointment={onBookAppointment}
        onSelectNewPhoto={onSelectNewPhoto}
      />
    </div>
  );
}
