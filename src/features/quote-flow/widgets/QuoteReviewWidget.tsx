import React, { useState } from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { Sparkles, Clock, CheckCircle2, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { SalonPaymentCheckoutWidget, PaymentReceipt } from '@/shared/components/SalonPaymentCheckoutWidget';
import { toast } from 'sonner';
import { useApp } from '@/app/AppContext';

interface QuoteReviewWidgetProps {
  onSubmitRequest?: () => void;
  isLoading?: boolean;
}

export function QuoteReviewWidget({ onSubmitRequest, isLoading = false }: QuoteReviewWidgetProps) {
  const { state, calculateEstimatedRange, calculateEstimatedDuration } = useQuoteFlow();
  const { addAppointment } = useApp();
  const priceRange = calculateEstimatedRange();
  const estimatedMins = calculateEstimatedDuration();
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  const avgPrice = Math.round((priceRange.min + priceRange.max) / 2);
  const depositEst = 150;

  const handlePaymentComplete = (paidReceipt: PaymentReceipt) => {
    setReceipt(paidReceipt);
    
    addAppointment({
      clientId: 'c1',
      serviceId: 'custom-quote',
      date: paidReceipt.dateStr,
      startTime: paidReceipt.timeStr,
      endTime: '12:30',
      status: 'confirmed',
      notes: `Cotización Custom Pagada: ${state.serviceTitle} | ${state.nailConfig.shape} / ${state.nailConfig.length} | Pago: $${paidReceipt.amountPaid} MXN (${paidReceipt.methodLabel}) - Ref: ${paidReceipt.paymentId}`
    });

    toast.success('¡Cotización y Turno Garantizados!', {
      description: `Comprobante: ${paidReceipt.authCode}`
    });
  };

  if (receipt) {
    return (
      <div className="p-4 rounded-2xl bg-white border border-black/[0.06] text-center space-y-3 text-left">
        <div className="flex items-center gap-2.5 text-emerald-600">
          <CheckCircle2 className="size-5 shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">¡Turno de Cotización Garantizado!</h4>
            <p className="text-[10.5px] text-[#86868B]">Ref: {receipt.paymentId}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FBFBFD] border border-black/[0.04] text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#86868B]">Servicio Custom:</span>
            <span className="font-bold text-[#1D1D1F]">{state.serviceTitle || 'Set Custom'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#86868B]">Anticipo Pagado:</span>
            <span className="font-bold text-emerald-700">${receipt.amountPaid} MXN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#86868B]">Fecha / Turno:</span>
            <span className="font-bold text-[#1D1D1F]">{receipt.dateStr} · {receipt.timeStr}</span>
          </div>
        </div>

        <p className="text-[11px] text-[#86868B]">
          Tu manicurista ya tiene tus fotos de referencia asignadas a este turno.
        </p>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="space-y-3 text-left animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">Pagar Anticipo de Garantía</h3>
          <button
            type="button"
            onClick={() => setShowCheckout(false)}
            className="text-[11px] text-[#86868B] hover:text-[#1D1D1F] font-bold cursor-pointer"
          >
            ← Volver a revisión
          </button>
        </div>

        <SalonPaymentCheckoutWidget
          serviceTitle={state.serviceTitle || 'Cotización Custom Nail Art'}
          totalAmount={avgPrice}
          depositAmount={depositEst}
          dateStr="2026-08-21"
          timeStr="11:30 AM"
          staffName="Diana Manicurista"
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowCheckout(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-[#1D1D1F]">Revisión de Solicitud de Cotización</h3>
        <p className="text-[11px] text-[#86868B]">
          Revisa los detalles antes de enviar o aparta tu turno de inmediato.
        </p>
      </div>

      {/* Summary Flush List */}
      <div className="divide-y divide-black/[0.05] border-y border-black/[0.05] text-xs">
        <div className="py-2.5 flex justify-between items-center">
          <span className="text-[#86868B]">Servicio:</span>
          <span className="font-semibold text-[#1D1D1F]">{state.serviceTitle || 'Acrílico Esculpido Custom'}</span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-[#86868B]">Largo & Forma:</span>
          <span className="font-semibold text-[#1D1D1F] uppercase">{state.nailConfig.length} • {state.nailConfig.shape}</span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-[#86868B]">Acabado & Complejidad:</span>
          <span className="font-semibold text-[#1D1D1F] uppercase">{state.designDetails.finish} • {state.designDetails.complexity}</span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-[#86868B]">Retiro Previo:</span>
          <span className="font-semibold text-[#1D1D1F]">{state.nailConfig.existingProductToRemove ? 'Sí (+$100)' : 'No'}</span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-[#86868B]">Referencias / Fotos:</span>
          <span className="font-semibold text-[#1D1D1F]">{state.referenceImages.length} imagen(es)</span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-[#86868B] flex items-center gap-1"><Clock className="size-3 text-primary" /> Duración estimada:</span>
          <span className="font-semibold text-[#1D1D1F]">{estimatedMins} min ({Math.round(estimatedMins / 60 * 10) / 10}h)</span>
        </div>

        <div className="py-3 flex justify-between items-baseline">
          <span className="font-bold text-[#1D1D1F]">Rango Estimado:</span>
          <span className="text-lg font-bold font-display text-primary">${priceRange.min} – ${priceRange.max} MXN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <Button
          type="button"
          onClick={() => setShowCheckout(true)}
          className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
        >
          <ShieldCheck className="size-4" />
          <span>Apartar con Anticipo (${depositEst} MXN)</span>
        </Button>

        {onSubmitRequest && (
          <Button
            type="button"
            onClick={onSubmitRequest}
            disabled={isLoading}
            variant="outline"
            className="h-11 rounded-xl border-black/[0.1] hover:bg-neutral-100 text-[#1D1D1F] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Enviar Solo para Revisión</span>
          </Button>
        )}
      </div>
    </div>
  );
}
