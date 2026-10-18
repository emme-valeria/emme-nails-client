import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Palette, Layers, Check, RefreshCw } from 'lucide-react';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';

interface OnboardingStepAestheticsProps {
  shape: string;
  length: string;
  colorName: string;
  colorHex: string;
  finish: string;
  onUpdate: (updates: { shape?: string; length?: string; colorName?: string; colorHex?: string; finish?: string }) => void;
}

export function OnboardingStepAesthetics({
  shape,
  length,
  colorName,
  colorHex,
  finish,
  onUpdate
}: OnboardingStepAestheticsProps) {
  const shapes = [
    { id: 'Almendra', label: 'Almendra', iconShape: 'almond', tag: 'Elegante' },
    { id: 'Coffin', label: 'Coffin', iconShape: 'coffin', tag: 'Estilizada' },
    { id: 'Cuadrada', label: 'Cuadrada', iconShape: 'square', tag: 'Clásica' },
    { id: 'Squoval', label: 'Squoval', iconShape: 'squoval', tag: 'Natural' },
    { id: 'Ovalada', label: 'Ovalada', iconShape: 'oval', tag: 'Suave' },
    { id: 'Stiletto', label: 'Stiletto', iconShape: 'stiletto', tag: 'Audaz' }
  ];

  const lengths = [
    { id: 'Corto', label: 'Corto', mm: '+0mm', desc: 'Cómodo al ras' },
    { id: 'Medio', label: 'Medio', mm: '+5mm', desc: 'Equilibrio perfecto' },
    { id: 'Largo', label: 'Largo', mm: '+10mm', desc: 'Efecto estilizado' },
    { id: 'Extralargo', label: 'XL', mm: '+16mm', desc: 'Glamour escultural' }
  ];

  const colors = [
    { name: 'Nude Rose', hex: '#E8C5B0', vibe: 'Clean Girl' },
    { name: 'Baby Pink', hex: '#F4A2B8', vibe: 'Chic Suave' },
    { name: 'Rojo Carmesí', hex: '#C8102E', vibe: 'Clásico Sexy' },
    { name: 'Blanco Milky', hex: '#F8F9FA', vibe: 'Minimalista' },
    { name: 'Glazed Chrome', hex: '#E5D9F2', vibe: 'Viral Hailey' },
    { name: 'Negro Azabache', hex: '#201B1E', vibe: 'Dark Elegance' }
  ];

  const finishes = [
    { id: 'Glossy', label: 'Brillo Espejo (Glossy)', desc: 'Top coat ultra brillante' },
    { id: 'Mate', label: 'Mate Terciopelo (Matte)', desc: 'Tacto sedoso sin reflejo' },
    { id: 'Chrome', label: 'Efecto Glazed Chrome', desc: 'Polvo aperlado nacarado' },
    { id: 'Cat Eye', label: 'Ojo de Gato Magnético', desc: 'Partículas con destellos 3D' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 lg:space-y-7"
    >
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block">
          Paso 2 de 5 • Perfil Estético Personal
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-foreground">
          Define tu estilo insignia
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Tus manicuristas verán tus preferencias guardadas en su terminal antes de comenzar tu atención.
        </p>
      </div>

      {/* 1. Forma de la uña */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center justify-between">
          <span>1. Forma de Uña Favorita:</span>
          <span className="text-primary font-bold lowercase">({shape})</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {shapes.map((s) => {
            const isSelected = shape.toLowerCase() === s.id.toLowerCase();
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onUpdate({ shape: s.id })}
                className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer relative ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border/70 bg-card hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="w-7 h-10 flex items-center justify-center">
                  <NailShapeSVG shape={s.iconShape} fillColor={isSelected ? colorHex : '#D4A090'} className="w-6 h-9" />
                </div>
                <span className="text-[11px] font-black text-foreground">{s.label}</span>
                <span className="text-[9px] text-muted-foreground">{s.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Largo de la uña */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center justify-between">
          <span>2. Largo Habitual:</span>
          <span className="text-primary font-bold lowercase">({length})</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {lengths.map((l) => {
            const isSelected = length.toLowerCase() === l.id.toLowerCase();
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onUpdate({ length: l.id })}
                className={`p-3 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border/70 bg-card hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-foreground">{l.label}</span>
                  <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded-md bg-primary/15">{l.mm}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{l.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tono & Paleta de Color */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center justify-between">
          <span>3. Gama de Color Predilecta:</span>
          <span className="text-primary font-bold lowercase">({colorName})</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {colors.map((c) => {
            const isSelected = colorHex.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onUpdate({ colorName: c.name, colorHex: c.hex })}
                className={`p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border/70 bg-card hover:bg-secondary/60'
                }`}
              >
                <div
                  className="size-7 rounded-full border border-black/10 shadow-inner shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && <Check className={`size-3.5 stroke-[3] ${c.hex === '#F8F9FA' ? 'text-black' : 'text-white'}`} />}
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[11px] font-black text-foreground block truncate">{c.name}</span>
                  <span className="text-[9px] text-muted-foreground block truncate">{c.vibe}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Acabado de Superficie */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center justify-between">
          <span>4. Acabado / Textura de Uña:</span>
          <span className="text-primary font-bold lowercase">({finish})</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {finishes.map((f) => {
            const isSelected = finish.toLowerCase().includes(f.id.toLowerCase());
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onUpdate({ finish: f.id })}
                className={`p-3 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border/70 bg-card hover:bg-secondary/60'
                }`}
              >
                <div>
                  <span className="text-xs font-black text-foreground block">{f.label}</span>
                  <span className="text-[10px] text-muted-foreground">{f.desc}</span>
                </div>
                <div className={`size-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-border'}`}>
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
