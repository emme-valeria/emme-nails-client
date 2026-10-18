import React, { useState } from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { SemanticDesignInterpreterAdapter } from '@/domain/quotes/infrastructure/ai/design-interpreter-adapter';
import { Sparkles, CheckCircle2, Wand2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { NailCategoryExtractionCard } from '@/features/assisted-design/ui/NailCategoryExtractionCard';

const interpreter = new SemanticDesignInterpreterAdapter();

export function SemanticSuggestionsWidget() {
  const { state, dispatch } = useQuoteFlow();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeAndSuggest = async () => {
    setIsAnalyzing(true);
    try {
      const result = await interpreter.interpretDesignRequest({
        textDescription: state.designDetails.description,
        imageUrls: state.referenceImages,
      });
      dispatch({ type: 'SET_SUGGESTED_ATTRIBUTES', payload: result });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAttributes = () => {
    dispatch({ type: 'CONFIRM_SUGGESTED_ATTRIBUTES' });
  };

  const detailedAnalysis = state.suggestedAttributes?.detailedAnalysis;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-primary/5 border border-primary/20 space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="size-4 text-primary" />
          <h4 className="text-xs sm:text-sm font-black text-foreground">
            Extracción Inteligente por Categorías
          </h4>
        </div>
        <Badge variant="primary" size="sm">
          IA Visión
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Analizamos tus fotos de referencia para desglosar la técnica de aplicación, forma, largo, colorimetría, acabado y receta paso a paso con certeza garantizada.
      </p>

      {!state.suggestedAttributes ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleAnalyzeAndSuggest}
          isLoading={isAnalyzing}
          className="w-full text-xs font-extrabold bg-card border-primary/30 text-primary hover:bg-primary/10 h-10 rounded-2xl cursor-pointer"
        >
          <Sparkles className="size-3.5 mr-1" />
          Analizar Fotos & Extraer Categorías con IA
        </Button>
      ) : (
        <div className="space-y-4">
          <NailCategoryExtractionCard
            analysis={detailedAnalysis}
            imageUrl={state.referenceImages[0] || undefined}
            imageDescription={state.designDetails.description}
            variant="quote_service"
            onApplyToQuote={(extractedAnalysis) => {
              dispatch({
                type: 'SET_SUGGESTED_ATTRIBUTES',
                payload: {
                  ...extractedAnalysis.suggestedAttributes,
                  detailedAnalysis: extractedAnalysis,
                },
              });
              dispatch({ type: 'CONFIRM_SUGGESTED_ATTRIBUTES' });
            }}
          />

          {!state.isAttributesConfirmed && (
            <Button
              type="button"
              onClick={handleConfirmAttributes}
              className="w-full bg-primary text-white text-xs font-black h-10 rounded-xl cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="size-4 mr-1.5" />
              Confirmar Todo para mi Cotización
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

