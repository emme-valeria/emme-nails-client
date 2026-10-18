import React from 'react';
import { InspirationSelectionWidget } from '@/features/quote-flow/widgets/InspirationSelectionWidget';
import { SemanticSuggestionsWidget } from '@/features/quote-flow/widgets/SemanticSuggestionsWidget';
import { QuoteFlowProvider } from '@/features/quote-flow/model/quote-flow.context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Sparkles, ArrowRight, Calendar, FileText } from 'lucide-react';

interface InspirationExplorerWidgetProps {
  onStartDirectBooking: () => void;
  onStartCustomQuote: () => void;
}

export function InspirationExplorerWidget({
  onStartDirectBooking,
  onStartCustomQuote,
}: InspirationExplorerWidgetProps) {
  return (
    <QuoteFlowProvider>
      <Card className="p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md bg-card space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-base font-black text-foreground">Asistente de Inspiración & Tendencias</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Descubre los diseños más solicitados en Guadalajara o sube tu propia referencia para sugerir estilos con Inteligencia Artificial.
          </p>
        </div>

        <InspirationSelectionWidget />

        <SemanticSuggestionsWidget />

        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
          <h4 className="text-xs font-black text-foreground">¿Listo para continuar con este estilo?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={onStartDirectBooking}
              className="w-full bg-primary hover:brightness-105 text-white text-xs font-extrabold h-10 rounded-xl cursor-pointer"
            >
              <Calendar className="size-3.5 mr-1" />
              Agendar Servicio Similares
            </Button>
            <Button
              type="button"
              onClick={onStartCustomQuote}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-extrabold h-10 rounded-xl cursor-pointer"
            >
              <FileText className="size-3.5 mr-1" />
              Cotizar con este Diseño
            </Button>
          </div>
        </div>
      </Card>
    </QuoteFlowProvider>
  );
}
