import React, { useState } from 'react';
import { Sparkles, Wand2, Check, Sun, Eye, Leaf, Gem, Palette, ChevronRight } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';

interface StyleAdvisorChatWidgetProps {
  onSelectDesign: (design: {
    shape: string;
    finish: string;
    estimatedPrice: number;
    estimatedDuration: number;
    description: string;
  }) => void;
}

const NAIL_SHAPES = [
  { id: 'shape-1', name: 'Almendra', popularity: 'Más Popular' },
  { id: 'shape-2', name: 'Cuadrada', popularity: 'Clásica' },
  { id: 'shape-3', name: 'Stiletto', popularity: 'Audaz' },
  { id: 'shape-4', name: 'Ovalada', popularity: 'Natural' },
];

const FINISHES = [
  { id: 'fin-1', name: 'Chrome Mirror Espejo', priceExtra: 15, durationExtra: 15, icon: Sun },
  { id: 'fin-2', name: 'Velvet Cat Eye 3D', priceExtra: 12, durationExtra: 10, icon: Eye },
  { id: 'fin-3', name: 'Rubber Base Nude Natural', priceExtra: 10, durationExtra: 10, icon: Leaf },
  { id: 'fin-4', name: 'Cristales Swarovski Encapsulados', priceExtra: 20, durationExtra: 20, icon: Gem },
];

export function StyleAdvisorChatWidget({ onSelectDesign }: StyleAdvisorChatWidgetProps) {
  const [selectedShape, setSelectedShape] = useState(NAIL_SHAPES[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);

  const basePrice = 450;
  const baseDuration = 60;

  const totalPrice = basePrice + selectedFinish.priceExtra * 10;
  const totalDuration = baseDuration + selectedFinish.durationExtra;

  const handleConfirm = () => {
    onSelectDesign({
      shape: selectedShape.name,
      finish: selectedFinish.name,
      estimatedPrice: totalPrice,
      estimatedDuration: totalDuration,
      description: `Uñas forma ${selectedShape.name} con acabado ${selectedFinish.name}.`
    });
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Wand2 className="size-4 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">AI Style Builder</h4>
            <p className="text-[10.5px] text-[#86868B]">Configura tu combinación personalizada</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-primary border-primary/20 bg-primary/5">
          AI Configurator
        </Badge>
      </div>

      {/* Section 1: Forma de Uñas (Segmented Apple Row) */}
      <div className="px-4 py-3 border-b border-black/[0.05]">
        <span className="text-[10.5px] font-bold text-[#86868B] uppercase tracking-wider block mb-2">
          1. Forma de Uña
        </span>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F5F5F7] rounded-xl">
          {NAIL_SHAPES.map(s => {
            const isSelected = selectedShape.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedShape(s)}
                className={cn(
                  "py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer truncate",
                  isSelected
                    ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Acabado o Efecto (Containerless List) */}
      <div className="border-b border-black/[0.05]">
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10.5px] font-bold text-[#86868B] uppercase tracking-wider block">
            2. Acabado o Efecto Especial
          </span>
        </div>
        <div className="divide-y divide-black/[0.05]">
          {FINISHES.map(f => {
            const isSelected = selectedFinish.id === f.id;
            const IconComp = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFinish(f)}
                className={cn(
                  "px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer",
                  isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComp className={cn("size-4 shrink-0", isSelected ? "text-primary" : "text-[#86868B]")} />
                  <span className={cn("text-xs font-medium truncate", isSelected ? "font-bold text-[#1D1D1F]" : "text-[#1D1D1F]")}>
                    {f.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-primary">+${f.priceExtra * 10} MXN</span>
                  {isSelected && <Check className="size-3.5 text-primary stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Row and CTA Button */}
      <div className="p-3.5 bg-[#FBFBFD] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-xs text-[#1D1D1F] truncate">
            {selectedShape.name} • {selectedFinish.name.split(' ')[0]}
          </p>
          <p className="text-[11px] text-[#86868B]">
            {totalDuration} min • <strong className="text-primary font-bold">${totalPrice} MXN</strong>
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleConfirm}
          className="h-9 px-4 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="size-3.5 mr-1" />
          <span>Agendar Estilo</span>
        </Button>
      </div>
    </div>
  );
}
