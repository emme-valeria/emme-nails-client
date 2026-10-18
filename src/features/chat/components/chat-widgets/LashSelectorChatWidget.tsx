import React, { useState } from 'react';
import { useChatStore } from '../../state/useChatStore';
import { useApp } from '@/app/AppContext';
import { Eye, Sparkles, Check, Clock, Calendar, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic } from '@/shared/utils/haptics';
import { LashVectorPreview, LashTechniqueType } from '@/features/lashes/components/LashVectorPreview';

export const CHAT_LASH_PRESETS: {
  id: string;
  technique: LashTechniqueType;
  name: string;
  badge: string;
  price: number;
  duration: number;
  desc: string;
}[] = [
  {
    id: 'lash-classic',
    technique: 'classic',
    name: 'Clásica Natural (Pelo a Pelo)',
    badge: 'Más Natural',
    price: 750,
    duration: 75,
    desc: 'Alarga y peina sin volumen artificial. Efecto rímel limpio.'
  },
  {
    id: 'lash-hybrid',
    technique: 'hybrid',
    name: 'Híbridas Foxy (⭐ Más Pedida)',
    badge: '⭐ 68% de Clientas',
    price: 900,
    duration: 90,
    desc: 'Mix 1:1 + abanicos 3D con longitud rasgada Foxy Eye.'
  },
  {
    id: 'lash-russian',
    technique: 'russian',
    name: 'Volumen Ruso Glamour (4D-6D)',
    badge: 'Delineado Intenso',
    price: 1150,
    duration: 105,
    desc: 'Densidad aterciopelada y ojos grandes de alto impacto.'
  },
  {
    id: 'lash-lift',
    technique: 'lifting',
    name: 'Lash Lifting + Keratina',
    badge: 'Cero Mantenimiento',
    price: 550,
    duration: 50,
    desc: 'Arquea tu pestaña 100% natural con nutrición profunda.'
  }
];

export function LashSelectorChatWidget() {
  const { selectService, setActiveWidget, setStep } = useChatStore();
  const [selectedId, setSelectedId] = useState<string>('lash-hybrid');
  const [appointmentType, setAppointmentType] = useState<'full_set' | 'touchup_2w' | 'removal_and_new'>('full_set');

  const selectedPreset = CHAT_LASH_PRESETS.find(p => p.id === selectedId) || CHAT_LASH_PRESETS[1];

  const calculateFinalPrice = () => {
    if (appointmentType === 'touchup_2w') return Math.round(selectedPreset.price * 0.60);
    if (appointmentType === 'removal_and_new') return selectedPreset.price + 150;
    return selectedPreset.price;
  };

  const handleConfirmAndProceed = () => {
    triggerHaptic(10);
    const finalPrice = calculateFinalPrice();
    const typeLabel = appointmentType === 'touchup_2w' ? 'Retoque 2 semanas' : appointmentType === 'removal_and_new' ? 'Retiro + Set Nuevo' : 'Set Completo';
    
    selectService({
      id: selectedPreset.id,
      name: `${selectedPreset.name} (${typeLabel})`,
      category: 'lashes',
      price: finalPrice,
      duration: selectedPreset.duration
    });

    // Advance directly to Proposal / Checkout in chat
    setActiveWidget('proposal_appointment');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-black/[0.08] shadow-xs p-3.5 sm:p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-rose-50 text-rose-700">
            <Eye className="size-4" />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">Configura tus Pestañas en 1 Clic</h4>
            <p className="text-[11px] text-[#86868B]">Fórmulas estándar de salón</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#1D1D1F]">
          ${calculateFinalPrice()} MXN
        </span>
      </div>

      {/* Preset Cards using vector preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CHAT_LASH_PRESETS.map((p) => {
          const isSelected = selectedId === p.id;
          return (
            <div
              key={p.id}
              onClick={() => {
                triggerHaptic(6);
                setSelectedId(p.id);
              }}
              className={cn(
                "p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all",
                isSelected 
                  ? "bg-[#FAF9F7] border-[#1D1D1F] ring-1 ring-[#1D1D1F]" 
                  : "bg-white border-black/[0.06] hover:bg-neutral-50"
              )}
            >
              <div className="w-14 h-12 flex-shrink-0 bg-white rounded-lg border border-black/[0.05] flex items-center justify-center p-1">
                <LashVectorPreview technique={p.technique} size="sm" selected={isSelected} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-rose-700 uppercase">{p.badge}</span>
                  <span className="text-xs font-extrabold text-[#1D1D1F]">${p.price}</span>
                </div>
                <h5 className="text-xs font-bold text-[#1D1D1F] truncate">{p.name}</h5>
                <p className="text-[10px] text-[#636366] line-clamp-1">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* State Selection */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F7] rounded-xl border border-black/[0.05]">
        {[
          { id: 'full_set', label: '1ra Vez / Completo' },
          { id: 'touchup_2w', label: 'Retoque (-40%)' },
          { id: 'removal_and_new', label: 'Retiro + Nuevo' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setAppointmentType(t.id as any);
            }}
            className={cn(
              "flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer",
              appointmentType === t.id
                ? "bg-white text-[#1D1D1F] shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Action buttons: Direct in WhatsApp Chat OR Open Simulator */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            // Navigate to main qualification flow for lashes
            window.location.href = '/?tab=booking&service=lashes_foxy_hybrid';
          }}
          className="h-9 px-3 rounded-xl bg-[#FAF9F7] hover:bg-neutral-100 border border-black/[0.08] text-[#1D1D1F] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98 transition-all"
          title="Abrir Simulador 3D con Medidas y Ojo Completo"
        >
          <Sparkles className="size-3.5 text-rose-600" />
          <span className="hidden sm:inline">Simulador</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmAndProceed}
          className="flex-1 h-9 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
        >
          <span>Agendar {selectedPreset.name.split(' ')[0]}</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
