import React from 'react';
import { Shield, Sparkles, Layers, Check } from 'lucide-react';

export type StructureType = 'kapping' | 'gel_x' | 'acrylic' | 'polygel';

interface StructureOption {
  id: StructureType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  durability: string;
  recommendation: string;
}

const STRUCTURE_OPTIONS: StructureOption[] = [
  {
    id: 'kapping',
    title: 'Nivelación Kapping Gel',
    subtitle: 'Uña Natural Reforzada',
    description: 'Capa protectora de gel de alta densidad sobre tu uña natural para prevenir quiebres.',
    badge: 'Uña Natural',
    durability: '3 - 4 semanas',
    recommendation: 'Ideal para uñas cortas/medianas que quieren crecer sanas.'
  },
  {
    id: 'gel_x',
    title: 'Soft Gel / Gel-X Tips',
    subtitle: 'Extensión Flexible Ligera',
    description: 'Tips de gel flexible pre-moldeados adheridos con base gel sin limado agresivo.',
    badge: 'Popular',
    durability: '3 - 4 semanas',
    recommendation: 'Perfecto para largo inmediato con aspecto 100% natural.'
  },
  {
    id: 'acrylic',
    title: 'Esculpido en Acrílico',
    subtitle: 'Máxima Resistencia & Estructura',
    description: 'Polímero de alta durabilidad construido a mano para formas extravagantes y largas.',
    badge: 'Alta Durabilidad',
    durability: '4 - 5 semanas',
    recommendation: 'Recomendado para uñas XL y manos con alta actividad física.'
  },
  {
    id: 'polygel',
    title: 'Polygel Híbrido',
    subtitle: 'Ligereza + Resistencia',
    description: 'Combinación entre gel uv y acrílico. Ligero como gel, fuerte como acrílico.',
    badge: 'Técnica Pro',
    durability: '3 - 4 semanas',
    recommendation: 'Excelente para uñas sensibles o reconstrucciones.'
  }
];

interface NailStructureSelectorProps {
  selectedStructure: StructureType;
  onSelectStructure: (structure: StructureType) => void;
}

export function NailStructureSelector({
  selectedStructure,
  onSelectStructure
}: NailStructureSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
          2. Selecciona el Tipo de Estructura o Extensión:
        </label>
        <p className="text-xs text-muted-foreground">
          Define la base técnica sobre la cual aplicaremos el diseño de tus uñas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STRUCTURE_OPTIONS.map((opt) => {
          const isSelected = selectedStructure === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectStructure(opt.id)}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md shadow-primary/10'
                  : 'bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-1 inline-block">
                    {opt.badge}
                  </span>
                  <h4 className="text-sm font-black text-foreground">{opt.title}</h4>
                  <span className="text-[11px] font-extrabold text-muted-foreground block">
                    {opt.subtitle}
                  </span>
                </div>

                <div
                  className={`size-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-border/60 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="size-3.5 stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {opt.description}
              </p>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                <span>Duración: {opt.durability}</span>
                <span className="text-primary font-black">Emme Certified</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
