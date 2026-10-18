import React, { useState } from 'react';
import { BookingHubEntryPoint } from '@/features/navigation/components/BookingHubEntryPoint';
import { CustomQuoteWizardWidget } from '@/widgets/custom-quote-wizard';
import { CustomQuoteChatWidget } from '@/widgets/custom-quote-chat';
import { QuoteInboxWidget } from '@/widgets/quote-inbox';
import { QuoteResponseWidget } from '@/widgets/quote-response';
import { BookingConfirmationWidget } from '@/widgets/booking-confirmation';
import { Sparkles, Sliders, MessageSquare, Inbox, CheckCircle2, LayoutGrid } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';

export function QuoteRequestPage() {
  type ViewType = 'hub' | 'wizard' | 'chat' | 'salon_inbox' | 'client_response';
  const [activeView, setActiveView] = useState<ViewType>('hub');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hasAcceptedQuote, setHasAcceptedQuote] = useState<boolean>(false);

  const views: Array<{ id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'hub', label: 'Centro de Reservas', icon: LayoutGrid },
    { id: 'wizard', label: 'Wizard Detallado', icon: Sliders },
    { id: 'chat', label: 'AI Assist', icon: MessageSquare },
    { id: 'client_response', label: 'Cotización Recibida', icon: CheckCircle2 },
    { id: 'salon_inbox', label: 'Bandeja Salón', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Navigation Header */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold tracking-wide">
            <Sparkles className="size-3.5" />
            <span>Emme Studio Booking & Quote Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
            Reserva de Citas & Cotizador de Nail Art
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Elige entre Reserva Directa (catálogo), Cotización Estructurada o Explorador de Inspiración.
          </p>
        </div>

        {/* View Switcher Tabs with SegmentedCapsuleTabs */}
        <SegmentedCapsuleTabs<'hub' | 'wizard' | 'chat' | 'salon_inbox' | 'client_response'>
          value={activeView}
          onChange={(view) => setActiveView(view)}
          layoutId="quoteRequestViewTabPill"
          size="sm"
          items={views}
        />
      </div>

      {/* VIEW 0: BOOKING HUB ENTRY POINT */}
      {activeView === 'hub' && <BookingHubEntryPoint />}

      {/* VIEW 1: STANDALONE WIZARD WIDGET */}
      {activeView === 'wizard' && (
        <>
          {!hasSubmitted ? (
            <CustomQuoteWizardWidget onCompleteSubmit={() => setHasSubmitted(true)} />
          ) : (
            <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-md text-center max-w-xl mx-auto space-y-4">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-7 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">¡Solicitud de Cotización Enviada!</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Tu manicurista evaluará los detalles, fotos y requerimientos de tu diseño. Te notificaremos cuando tu cotización oficial con desglose y horario esté lista.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setActiveView('client_response')}
                className="bg-primary text-white font-extrabold text-xs rounded-xl h-10 px-5 cursor-pointer"
              >
                Ver Propuesta Recibida del Salón
              </Button>
            </div>
          )}
        </>
      )}

      {/* VIEW 2: AI CHAT WIDGET */}
      {activeView === 'chat' && (
        <CustomQuoteChatWidget onCompleteSubmit={() => setActiveView('client_response')} />
      )}

      {/* VIEW 3: CLIENT RESPONSE & DEPOSIT BOOKING */}
      {activeView === 'client_response' && (
        <div className="max-w-xl mx-auto space-y-4">
          {!hasAcceptedQuote ? (
            <QuoteResponseWidget onAcceptAndBookSlot={() => setHasAcceptedQuote(true)} />
          ) : (
            <BookingConfirmationWidget />
          )}
        </div>
      )}

      {/* VIEW 4: SALON INBOX WORKSPACE */}
      {activeView === 'salon_inbox' && <QuoteInboxWidget />}
    </div>
  );
}

