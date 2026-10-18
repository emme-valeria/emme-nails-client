import React, { useState } from 'react';
import { Quote } from '@/domain/quotes/entities/QuoteRequest';
import { QUOTE_STATUS_LABELS } from '@/domain/quotes/value-objects/QuoteStatus';
import { CheckCircle2, Clock, Calendar, ShieldCheck, ArrowRight, MessageSquare, XCircle, CreditCard } from 'lucide-react';
import { Button } from '@emme/ui/button';

interface QuoteResponseWidgetProps {
  quote?: Quote;
  onAcceptAndBookSlot?: () => void;
  onRequestChanges?: (reason: string) => void;
  onDeclineQuote?: () => void;
}

export function QuoteResponseWidget({
  quote,
  onAcceptAndBookSlot,
  onRequestChanges,
  onDeclineQuote,
}: QuoteResponseWidgetProps) {
  const defaultQuote: Quote = quote || {
    id: 'quote-888',
    quoteRequestId: 'req-101',
    clientId: 'c-1',
    staffId: 'st-1',
    staffName: 'Valeria M. (Nail Artist Master)',
    status: 'SENT_TO_CLIENT',
    items: [
      { id: '1', description: 'Set Base Acrílico Esculpido', amount: 650 },
      { id: '2', description: 'Remoción de producto anterior', amount: 100 },
      { id: '3', description: 'Custom Nail Art (Efecto Cromo)', amount: 150 },
      { id: '4', description: 'Cristales 3D Swarovski (x4 uñas)', amount: 200 },
    ],
    subtotal: 1100,
    discount: 0,
    totalPrice: 1100,
    requiredDeposit: 300,
    remainingBalance: 800,
    estimatedDurationMinutes: 150,
    expirationDate: '2026-08-18',
    artistNotes: 'Cotización con garantía de 7 días de retoque incluido. Se requiere anticipo de $300 para congelar el turno.',
    createdAt: new Date().toISOString(),
  };

  const [showChangesBox, setShowChangesBox] = useState<boolean>(false);
  const [changeReason, setChangeReason] = useState<string>('');
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  return (
    <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-4 max-w-lg my-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase">
            Cotización Oficial Lista
          </span>
          <h3 className="text-sm font-extrabold text-foreground mt-1">Propuesta de {defaultQuote.staffName}</h3>
        </div>
        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
          <Clock className="size-3.5 text-primary" />
          Válida hasta {defaultQuote.expirationDate}
        </span>
      </div>

      {/* Itemized Price Breakdown Table */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-secondary/40 border border-border/40 text-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Desglose Oficial de Conceptos:
        </span>
        <div className="space-y-1.5 pt-1">
          {defaultQuote.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-foreground font-medium">
              <span>• {item.description}</span>
              <span className="font-extrabold text-primary">${item.amount} MXN</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/40 flex justify-between items-center font-extrabold text-foreground text-sm">
          <span>Subtotal Total</span>
          <span className="text-primary">${defaultQuote.totalPrice} MXN</span>
        </div>
      </div>

      {/* Financials & Duration Specs */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-2xl bg-primary/5 border border-primary/15">
          <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">Anticipo / Deposit</span>
          <span className="text-sm font-black text-primary">${defaultQuote.requiredDeposit} MXN</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-secondary/50 border border-border/40">
          <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">Restante en Cita</span>
          <span className="text-sm font-bold text-foreground">${defaultQuote.remainingBalance} MXN</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-secondary/50 border border-border/40">
          <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">Duración Cita</span>
          <span className="text-sm font-bold text-foreground">{defaultQuote.estimatedDurationMinutes} min</span>
        </div>
      </div>

      {/* Artist Note */}
      {defaultQuote.artistNotes && (
        <p className="text-[11px] font-medium text-muted-foreground bg-secondary/30 p-2.5 rounded-xl border border-border/40 italic">
          "{defaultQuote.artistNotes}"
        </p>
      )}

      {/* Actions */}
      {!isAccepted ? (
        <div className="space-y-2 pt-1">
          <Button
            type="button"
            onClick={() => {
              setIsAccepted(true);
              if (onAcceptAndBookSlot) onAcceptAndBookSlot();
            }}
            className="w-full h-11 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="size-4" />
            <span>Aceptar Cotización y Elegir Turno ($300 Anticipo)</span>
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowChangesBox(!showChangesBox)}
              className="flex-1 rounded-xl text-xs font-bold gap-1 cursor-pointer"
            >
              <MessageSquare className="size-3.5" />
              <span>Pedir Cambios</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onDeclineQuote}
              className="rounded-xl text-xs font-bold text-muted-foreground hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <XCircle className="size-3.5" />
              <span>Rechazar</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-primary/[0.04] border border-primary/15 text-primary text-xs font-extrabold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-primary" />
            Cotización Aceptada. Selecciona tu horario para pagar el anticipo.
          </span>
        </div>
      )}

      {showChangesBox && (
        <div className="p-3 rounded-2xl bg-secondary/60 border border-border/60 space-y-2">
          <p className="text-xs font-bold text-foreground">Describe los cambios que deseas solicitar:</p>
          <textarea
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="Ej: 'Me gustaría omitir los cristales 3D para ajustar el presupuesto a $900 MXN...'"
            rows={2}
            className="w-full p-2 rounded-xl bg-card border text-xs"
          />
          <Button
            type="button"
            onClick={() => {
              if (onRequestChanges && changeReason) {
                onRequestChanges(changeReason);
                setShowChangesBox(false);
              }
            }}
            className="h-8 text-xs font-bold bg-primary text-white rounded-lg"
          >
            Enviar Solicitud de Cambio
          </Button>
        </div>
      )}
    </div>
  );
}
