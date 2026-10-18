import React, { useState } from 'react';
import { ClientDesignIntent, TargetNailDesign } from '@/domain/quotes/entities/NailTransformationDelta';
import { LengthCategory, NailShapeCategory, FinishType } from '@/domain/quotes/entities/NailArtSemanticTypes';
import { 
  Sliders, 
  Sparkles, 
  Palette, 
  Ruler, 
  Gem, 
  Clock, 
  DollarSign, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface ClientIntentCustomizerCardProps {
  initialTarget: TargetNailDesign;
  onIntentUpdated?: (intent: ClientDesignIntent, updatedTarget: TargetNailDesign) => void;
  className?: string;
}

const LENGTH_OPTIONS: { id: LengthCategory; label: string; sub: string }[] = [
  { id: 'S', label: 'Corta (S)', sub: 'Práctica & Cómoda' },
  { id: 'M', label: 'Mediana (M)', sub: 'Top #1 Más Pedida' },
  { id: 'L', label: 'Larga (L)', sub: 'Elegante & Estilizada' },
  { id: 'XL', label: 'Extra Larga (XL)', sub: 'Lienzo para Nail Art' },
];

const SHAPE_OPTIONS: { id: NailShapeCategory; label: string }[] = [
  { id: 'almond', label: 'Almendra' },
  { id: 'square', label: 'Cuadrada' },
  { id: 'coffin', label: 'Coffin' },
  { id: 'squoval', label: 'Squoval' },
  { id: 'stiletto', label: 'Stiletto' },
];

const COLOR_PRESETS = [
  { name: 'Rosa Glazed Donut', hex: '#EBB6C4' },
  { name: 'Nude Vainilla Francés', hex: '#EED9C4' },
  { name: 'Lila Pastel Lavanda', hex: '#D6C7E6' },
  { name: 'Rojo Carmesí Borgoña', hex: '#7A1C2C' },
  { name: 'Negro Obsidian Velvet', hex: '#1C1C1E' },
];

export const ClientIntentCustomizerCard: React.FC<ClientIntentCustomizerCardProps> = ({
  initialTarget,
  onIntentUpdated,
  className,
}) => {
  const [target, setTarget] = useState<TargetNailDesign>(initialTarget);
  const [intent, setIntent] = useState<ClientDesignIntent>({
    lengthPreference: 'as_reference',
    shapePreference: 'as_reference',
    embellishmentsPreference: 'keep_all',
  });

  const handleLengthChange = (len: LengthCategory) => {
    const updated = { ...target, lengthCategory: len };
    const updatedIntent = { ...intent, lengthPreference: len };
    setTarget(updated);
    setIntent(updatedIntent);
    onIntentUpdated?.(updatedIntent, updated);
  };

  const handleShapeChange = (shape: NailShapeCategory) => {
    const updated = { ...target, shape };
    const updatedIntent = { ...intent, shapePreference: shape };
    setTarget(updated);
    setIntent(updatedIntent);
    onIntentUpdated?.(updatedIntent, updated);
  };

  const handleColorChange = (hex: string, name: string) => {
    const updated = { ...target, dominantColorHex: hex, dominantColorName: name };
    const updatedIntent: ClientDesignIntent = {
      ...intent,
      colorPreference: { dominantHex: hex, dominantColorHex: hex, dominantName: name, preservePalette: false } as any,
    };
    setTarget(updated);
    setIntent(updatedIntent);
    onIntentUpdated?.(updatedIntent, updated);
  };

  const handleEmbellishmentToggle = (mode: ClientDesignIntent['embellishmentsPreference']) => {
    let charms = target.charms3DCount;
    let stones = target.rhinestoneCount;
    if (mode === 'remove_3d_charms') {
      charms = 0;
    } else if (mode === 'minimal_stones_only') {
      charms = 0;
      stones = 2;
    } else if (mode === 'no_stones') {
      charms = 0;
      stones = 0;
    } else {
      charms = initialTarget.charms3DCount;
      stones = initialTarget.rhinestoneCount;
    }

    const updated = { ...target, charms3DCount: charms, rhinestoneCount: stones };
    const updatedIntent = { ...intent, embellishmentsPreference: mode };
    setTarget(updated);
    setIntent(updatedIntent);
    onIntentUpdated?.(updatedIntent, updated);
  };

  return (
    <div id="client-intent-customizer-card" className={cn("bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sliders className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Personaliza el Diseño a tu Gusto
            </h3>
            <p className="text-xs text-muted-foreground">
              Ajusta longitud, silueta o pedrería sin perder la esencia de la foto
            </p>
          </div>
        </div>
      </div>

      {/* Length selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-primary" />
            Largo Preferido
          </span>
          <span className="text-muted-foreground font-mono">Actual: {target.lengthCategory}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LENGTH_OPTIONS.map(opt => {
            const isSelected = target.lengthCategory === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleLengthChange(opt.id)}
                className={cn(
                  "p-2.5 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                    : "border-border/60 hover:border-border bg-muted/20 text-muted-foreground"
                )}
              >
                <div className="font-semibold text-xs text-foreground">{opt.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{opt.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shape selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-foreground block">Silueta / Forma de Punta</span>
        <div className="flex flex-wrap gap-2">
          {SHAPE_OPTIONS.map(shape => {
            const isSelected = target.shape === shape.id;
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => handleShapeChange(shape.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/30 border-border/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {shape.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette Tuner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-primary" />
            Tono de Base
          </span>
          <span className="text-muted-foreground">{target.dominantColorName}</span>
        </div>
        <div className="flex items-center gap-3">
          {COLOR_PRESETS.map(c => {
            const isSelected = target.dominantColorHex.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleColorChange(c.hex, c.name)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center",
                  isSelected ? "border-primary scale-110 shadow-md ring-2 ring-primary/30" : "border-black/10 hover:scale-105"
                )}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-black drop-shadow-sm" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Embellishment Controls */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-primary" />
            Joyería & Pedrería
          </span>
          <span className="text-muted-foreground">
            {target.charms3DCount} dijes | {target.rhinestoneCount} piedras
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'keep_all', label: 'Igual a la Foto' },
            { id: 'remove_3d_charms', label: 'Sin Dijes 3D (-$70)' },
            { id: 'minimal_stones_only', label: 'Solo 2 Cristales' },
            { id: 'no_stones', label: 'Completamente Liso' },
          ].map(opt => {
            const isSelected = intent.embellishmentsPreference === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleEmbellishmentToggle(opt.id as any)}
                className={cn(
                  "p-2 rounded-xl border text-center text-xs font-medium transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
