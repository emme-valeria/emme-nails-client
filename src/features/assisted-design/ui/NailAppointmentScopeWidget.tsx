import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Check,
  Scissors,
  Layers,
  Palette,
  HeartHandshake,
  Sparkle,
  Info,
  Droplet
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { NailPhotoDetailedAnalysis } from '@/domain/quotes/entities/Inspiration';

export interface NailAppointmentScopeWidgetProps {
  analysis: NailPhotoDetailedAnalysis;
  className?: string;
}

export function NailAppointmentScopeWidget({
  analysis,
  className = '',
}: NailAppointmentScopeWidgetProps) {
  const layers = analysis.layers;
  const estimate = analysis.estimateRange;

  const dominantName = layers.chromatics.dominantColorName || 'Tono Principal';
  const dominantHex = layers.chromatics.dominantColorHex || '#F7D2DE';

  const milestones = [
    {
      id: 'm1',
      number: '1',
      title: 'Diagnóstico & Manicura Rusa e-File',
      time: '~15 min',
      icon: Scissors,
      color: 'text-primary bg-primary/10',
      description:
        'Sanitización clínica, retiro suave de cutícula con fresa diamantada y preparación de la placa ungueal sin daño mecánico.',
      included: true,
    },
    {
      id: 'm2',
      number: '2',
      title: `Arquitectura: ${layers.structure.label}`,
      time: '~25 min',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-500/10 dark:text-indigo-400',
      description:
        layers.structure.description ||
        'Nivelación y refuerzo de uña natural para crear un ápice balanceado y resistente.',
      included: true,
    },
    {
      id: 'm3',
      number: '3',
      title: `Esculpido: Forma ${layers.shape.label.split('(')[0].trim()} & Largo ${layers.length.label.split('(')[0].trim()}`,
      time: '~15 min',
      icon: Sparkle,
      color: 'text-amber-600 bg-amber-500/10 dark:text-amber-400',
      description:
        'Alineación simétrica de bordes libres y limado fino de precisión para estilizar tus manos.',
      included: true,
    },
    {
      id: 'm4',
      number: '4',
      title: `Colorimetría & Diseño: ${layers.finish.label.split('(')[0].trim()}`,
      time: '~25 min',
      icon: Palette,
      color: 'text-rose-600 bg-rose-500/10 dark:text-rose-400',
      description:
        layers.nailArt.elements.length > 0
          ? `Aplicación de 2 capas de esmalte ${dominantName} + acentos de ${layers.nailArt.elements.join(', ')}.`
          : `Esmaltado de alta pigmentación en tono ${dominantName} con acabado ${layers.finish.label.split('(')[0].trim()}.`,
      included: true,
    },
    {
      id: 'm5',
      number: '5',
      title: 'Sellado Diamond Shield & Terapia de Óleo',
      time: '~10 min',
      icon: Droplet,
      color: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
      description:
        'Top coat ultra resistente con filtro anti-amarilleo y masaje nutritivo con óleo botánico de almendras y jojoba.',
      included: true,
    },
  ];

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-5 sm:p-6 shadow-sm text-left transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Tu Cita en Emme
            </span>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="size-3.5 text-primary" />
              ~{estimate.estimatedDurationMinutes} minutos en cabina
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white">
            Lo que Realizaremos en tu Cita
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="size-4 shrink-0" />
          <span>Garantía de Durabilidad 21 Días</span>
        </div>
      </div>

      {/* Timeline Steps (Non-boxity, clean flow) */}
      <div className="space-y-4 py-4 relative before:absolute before:left-[17px] sm:before:left-[21px] before:top-8 before:bottom-8 before:w-0.5 before:bg-black/[0.06] dark:before:bg-white/[0.08]">
        {milestones.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="relative flex items-start gap-3.5 sm:gap-4 group">
              {/* Step indicator */}
              <div
                className={cn(
                  'size-9 sm:size-10 rounded-xl flex items-center justify-center shrink-0 z-10 border border-white dark:border-[#1C1C1E] shadow-2xs font-extrabold text-xs',
                  m.color
                )}
              >
                <Icon className="size-4 sm:size-4.5" />
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F] dark:text-white">
                    {m.title}
                  </h4>
                  <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                    {m.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Inclusions & Clarity Section - Clean unboxed flush layout */}
      <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-[#1D1D1F] dark:text-white block">
            Todo incluido en tu cotización estimada (${estimate.minPrice} – ${estimate.maxPrice} MXN)
          </span>
          <p className="text-[11px] text-muted-foreground">
            Kit de limado esterilizado individual, preparación rusa y sellado de larga duración.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            <Check className="size-3" />
            Sin Cargos Ocultos
          </span>
        </div>
      </div>
    </div>
  );
}
