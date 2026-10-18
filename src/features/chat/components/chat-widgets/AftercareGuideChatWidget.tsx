import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, Bell } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';

interface AftercareGuideChatWidgetProps {
  onScheduleRetouch: () => void;
}

const AFTERCARE_STEPS = [
  { id: 1, title: 'Aceite de cutículas diario', desc: 'Mantiene la hidratación y elasticidad del gel.' },
  { id: 2, title: 'Guantes en labores del hogar', desc: 'Evita contacto prolongado con agua caliente y cloro.' },
  { id: 3, title: 'Evitar palanquear o rascar', desc: 'No uses las uñas como herramientas para abrir objetos.' },
  { id: 4, title: 'Agendar retoque a los 21 días', desc: 'Previene quiebres dolorosos por crecimiento del ápex.' },
];

export function AftercareGuideChatWidget({ onScheduleRetouch }: AftercareGuideChatWidgetProps) {
  const [checked, setChecked] = useState<number[]>([1, 2]);

  const toggleCheck = (id: number) => {
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Guía de Cuidados & Duración</h4>
            <p className="text-[10.5px] text-[#86868B]">Rutina para uñas impecables por +3 semanas</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-emerald-700 border-emerald-200 bg-emerald-50">
          Guía
        </Badge>
      </div>

      {/* Flush Checklist with Hairline Dividers */}
      <div className="divide-y divide-black/[0.05]">
        {AFTERCARE_STEPS.map(step => {
          const isDone = checked.includes(step.id);
          return (
            <div 
              key={step.id}
              onClick={() => toggleCheck(step.id)}
              className={cn(
                "px-4 py-3 cursor-pointer flex items-start gap-3 transition-colors",
                isDone ? "bg-[#FBFBFD]" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
              )}
            >
              <div className="mt-0.5 text-emerald-600 shrink-0">
                {isDone ? <CheckSquare className="size-4.5 fill-emerald-100 text-emerald-600" /> : <Square className="size-4.5 text-neutral-400" />}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className={cn("font-semibold text-xs text-[#1D1D1F]", isDone && "line-through text-[#86868B]")}>
                  {step.title}
                </p>
                <p className="text-[11px] text-[#86868B] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action */}
      <div className="p-3.5 bg-white border-t border-black/[0.05]">
        <Button
          onClick={onScheduleRetouch}
          className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Bell className="size-3.5" />
          <span>Agendar Retoque en 21 Días</span>
        </Button>
      </div>
    </div>
  );
}
