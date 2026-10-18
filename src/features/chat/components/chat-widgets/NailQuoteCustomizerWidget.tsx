import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { useBookingStore } from '@/features/appointments/state/booking.store';
import { useChatStore } from '../../state/useChatStore';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';
import { cn } from '@emme/ui/lib/utils';

interface NailQuoteCustomizerWidgetProps {
  onQuoteApplied?: () => void;
}

export function NailQuoteCustomizerWidget({ onQuoteApplied }: NailQuoteCustomizerWidgetProps) {
  const { selectService, toggleAddOn, setNotes, setStep } = useBookingStore();
  const { prefillFromQuote } = useChatStore();

  const [nailLength, setNailLength] = useState<'short' | 'medium' | 'long' | 'xl'>('medium');
  const [removalNeeded, setRemovalNeeded] = useState<boolean>(false);
  const [repairNeeded, setRepairNeeded] = useState<boolean>(false);
  const [artLevel, setArtLevel] = useState<'basic' | 'french' | 'chrome' | '3d_crystals'>('chrome');

  const lengthPrices = { short: 0, medium: 50, long: 100, xl: 150 };
  const lengthLabels = {
    short: 'Corta',
    medium: 'Mediana (+50)',
    long: 'Larga (+100)',
    xl: 'XL (+150)',
  };

  const artPrices = {
    basic: 450,
    french: 550,
    chrome: 650,
    '3d_crystals': 750,
  };

  const artLabels = {
    basic: 'Monocolor Gel ($450)',
    french: 'Francés / Ombré ($550)',
    chrome: 'Efecto Chrome ($650)',
    '3d_crystals': 'Cristales Swarovski ($750)',
  };

  const calculateQuoteTotal = () => {
    let total = artPrices[artLevel] + lengthPrices[nailLength];
    if (removalNeeded) total += 100;
    if (repairNeeded) total += 120;
    return total;
  };

  const calculateDuration = () => {
    let mins = 60;
    if (nailLength === 'long' || nailLength === 'xl') mins += 20;
    if (removalNeeded) mins += 15;
    if (artLevel === '3d_crystals') mins += 20;
    return mins;
  };

  const handleApplyQuoteToBooking = () => {
    const total = calculateQuoteTotal();
    const duration = calculateDuration();
    const serviceTitle = `Cotización AI: ${artLabels[artLevel].split(' (')[0]} (${lengthLabels[nailLength].split(' (+')[0]})`;

    selectService({
      id: `custom-quote-${artLevel}-${nailLength}`,
      title: serviceTitle,
      category: 'Nail Art Custom',
      price: total,
      durationMinutes: duration,
    });

    if (removalNeeded) {
      toggleAddOn({
        id: 'remov-1',
        title: 'Remoción de producto anterior',
        price: 100,
      });
    }

    if (repairNeeded) {
      toggleAddOn({
        id: 'repair-1',
        title: 'Tratamiento fortalecedor de queratina',
        price: 120,
      });
    }

    setNotes(
      `Cotización personalizada AI: Largo ${nailLength.toUpperCase()}, Nivel de Arte: ${artLevel}, Remoción previa: ${
        removalNeeded ? 'Sí' : 'No'
      }`
    );

    setStep(2);

    prefillFromQuote({
      serviceName: serviceTitle,
      totalPrice: total,
      length: nailLength,
      finish: artLevel === 'chrome' ? 'chrome' : 'glossy',
      artLevel: artLevel === '3d_crystals' ? 'extravagant' : artLevel === 'french' ? 'moderate' : artLevel === 'chrome' ? 'minimal' : 'none',
      removalRequired: removalNeeded
    });

    if (onQuoteApplied) onQuoteApplied();
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Cotizador Personalizado</h4>
            <p className="text-[10.5px] text-[#86868B]">Calcula costo y duración al instante</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-primary border-primary/20 bg-primary/5">
          AI Estimator
        </Badge>
      </div>

      <div className="divide-y divide-black/[0.05]">
        {/* 1. Nail Length Selector (Segmented Apple Row) */}
        <div className="px-4 py-3">
          <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-2">
            1. Largo de Uña:
          </span>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F5F5F7] rounded-xl">
            {(['short', 'medium', 'long', 'xl'] as const).map((len) => {
              const isSelected = nailLength === len;
              return (
                <button
                  key={len}
                  type="button"
                  onClick={() => setNailLength(len)}
                  className={cn(
                    "py-1.5 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1",
                    isSelected
                      ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  )}
                >
                  <NailLengthSVG length={len} fillColor={isSelected ? '#E05286' : '#86868B'} className="w-4 h-6" />
                  <span className="text-[10px] truncate">{lengthLabels[len]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Art Complexity (Containerless Flush List) */}
        <div>
          <div className="px-4 pt-2.5 pb-1">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
              2. Nivel de Diseño:
            </span>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {(['basic', 'french', 'chrome', '3d_crystals'] as const).map((art) => {
              const isSelected = artLevel === art;
              return (
                <div
                  key={art}
                  onClick={() => setArtLevel(art)}
                  className={cn(
                    "px-4 py-2 flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs",
                    isSelected ? "bg-primary/5 font-semibold text-[#1D1D1F]" : "hover:bg-[#F8F8FA] text-[#1D1D1F]"
                  )}
                >
                  <span>{artLabels[art]}</span>
                  {isSelected && <Check className="size-3.5 text-primary stroke-[3]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Extras Flush Toggles */}
        <div className="divide-y divide-black/[0.05]">
          <label className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#F8F8FA] transition-colors text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={removalNeeded}
                onChange={(e) => setRemovalNeeded(e.target.checked)}
                className="rounded accent-primary size-3.5 cursor-pointer"
              />
              <span className="font-medium text-[#1D1D1F]">Remoción previa</span>
            </div>
            <span className="text-[11px] font-semibold text-primary">+$100 MXN</span>
          </label>

          <label className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#F8F8FA] transition-colors text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={repairNeeded}
                onChange={(e) => setRepairNeeded(e.target.checked)}
                className="rounded accent-primary size-3.5 cursor-pointer"
              />
              <span className="font-medium text-[#1D1D1F]">Tratamiento queratina</span>
            </div>
            <span className="text-[11px] font-semibold text-primary">+$120 MXN</span>
          </label>
        </div>

        {/* Total & CTA */}
        <div className="p-3.5 bg-[#FBFBFD] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#86868B] block">Estimación Total:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-primary">${calculateQuoteTotal()} MXN</span>
              <span className="text-[10.5px] text-[#86868B]">({calculateDuration()} min)</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleApplyQuoteToBooking}
            className="rounded-xl text-xs font-bold bg-primary text-white hover:brightness-105 h-9 px-4 shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <span>Transferir a Cita</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
