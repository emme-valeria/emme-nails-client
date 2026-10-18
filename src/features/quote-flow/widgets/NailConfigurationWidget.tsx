import React, { useState } from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { Sparkles, RefreshCw, Wrench } from 'lucide-react';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';
import { NailColorSwatchSelector, NailColorKey } from '@/shared/components/NailColorSwatchSelector';
import { InteractiveNailPreviewCard } from '@/shared/components/InteractiveNailPreviewCard';
import { cn } from '@emme/ui/lib/utils';

export function NailConfigurationWidget() {
  const { state, dispatch } = useQuoteFlow();
  const { nailConfig } = state;

  const [selectedColor, setSelectedColor] = useState<NailColorKey>('Pink');

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-1.5">
          <Sparkles className="size-4 text-primary" />
          <span>Configuración Visual de la Uña</span>
        </h3>
        <p className="text-[11px] text-[#86868B]">
          Selecciona estructura, forma, largo y tono para previsualizar tu diseño en tiempo real.
        </p>
      </div>

      {/* Live Interactive Previsualization Stage */}
      <InteractiveNailPreviewCard
        shape={nailConfig.shape}
        length={nailConfig.length}
        colorName={selectedColor}
        finish={state.designDetails?.finish || 'Glossy'}
        artStyle={state.designDetails?.complexity || 'Minimalist'}
        serviceTitle="Acrílico & Esculpido Personalizado"
      />

      <div className="divide-y divide-black/[0.05] border-y border-black/[0.05]">
        {/* Nail Type Selection */}
        <div className="py-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block mb-2">
            1. Tipo de Estructura Base:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'extension',
                label: 'Extensiones / Esculpido',
                desc: 'Gel-X, Acrílico o Poligel',
                imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&auto=format&fit=crop&q=80'
              },
              {
                id: 'natural',
                label: 'Uñas Naturales (Kapping)',
                desc: 'Nivelación sobre uña propia',
                imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=300&auto=format&fit=crop&q=80'
              },
            ].map((type) => {
              const isSelected = nailConfig.nailType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { nailType: type.id as any } })}
                  className={cn(
                    "p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer",
                    isSelected
                      ? "bg-primary/5 border-primary shadow-2xs"
                      : "bg-[#FBFBFD] border-black/[0.05] hover:bg-white"
                  )}
                >
                  <img src={type.imageUrl} alt={type.label} className="size-9 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#1D1D1F] block truncate">{type.label}</span>
                    <span className="text-[10px] text-[#86868B] block truncate">{type.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Nail Shape Selector (Segmented Row) */}
        <div className="py-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block mb-2">
            2. Forma de la Uña:
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F5F5F7] rounded-xl">
            {[
              { id: 'almond', label: 'Almond' },
              { id: 'coffin', label: 'Coffin' },
              { id: 'square', label: 'Square' },
              { id: 'oval', label: 'Oval' },
            ].map((shapeOpt) => {
              const isSelected = nailConfig.shape.toLowerCase() === shapeOpt.id.toLowerCase();
              return (
                <button
                  key={shapeOpt.id}
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { shape: shapeOpt.id as any } })}
                  className={cn(
                    "py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1",
                    isSelected
                      ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  )}
                >
                  <NailShapeSVG shape={shapeOpt.id} fillColor={isSelected ? '#E05286' : '#86868B'} className="w-5 h-8" />
                  <span className="text-[10px] truncate">{shapeOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Nail Length Selector (Segmented Row) */}
        <div className="py-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block mb-2">
            3. Largo Deseado:
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F5F5F7] rounded-xl">
            {[
              { id: 'short', label: 'Corta' },
              { id: 'medium', label: 'Mediana (+50)' },
              { id: 'long', label: 'Larga (+100)' },
              { id: 'xl', label: 'XL (+150)' },
            ].map((lenOpt) => {
              const isSelected = nailConfig.length.toLowerCase() === lenOpt.id.toLowerCase();
              return (
                <button
                  key={lenOpt.id}
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { length: lenOpt.id as any } })}
                  className={cn(
                    "py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1",
                    isSelected
                      ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  )}
                >
                  <NailLengthSVG length={lenOpt.id} fillColor={isSelected ? '#E05286' : '#86868B'} className="w-4 h-7" />
                  <span className="text-[10px] truncate">{lenOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Swatch Selector */}
      <NailColorSwatchSelector
        selectedColor={selectedColor}
        onSelectColor={(c) => setSelectedColor(c)}
        selectedShape={nailConfig.shape}
      />

      {/* Condition & Removal Flush Toggles */}
      <div className="divide-y divide-black/[0.05] border-t border-black/[0.05]">
        <label className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#F8F8FA] px-1 rounded-xl transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <RefreshCw className="size-4 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1D1D1F] block">Remoción de producto previo</span>
              <span className="text-[10.5px] text-[#86868B] block">Retiro seguro con torno y remojo orgánico</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-primary">+$100 MXN</span>
            <input
              type="checkbox"
              checked={nailConfig.existingProductToRemove}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_NAIL_CONFIG',
                  payload: { existingProductToRemove: e.target.checked },
                })
              }
              className="size-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </label>

        <div className="py-2.5 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <Wrench className="size-4 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1D1D1F] block">Uñas rotas a reparar</span>
              <span className="text-[10.5px] text-[#86868B] block">Soporte estructural o extensión sobre uña fisurada</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-primary">+$35 c/u</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_NAIL_CONFIG',
                    payload: { brokenNailsCount: Math.max(0, nailConfig.brokenNailsCount - 1) },
                  })
                }
                className="size-7 rounded-lg bg-[#F5F5F7] hover:bg-neutral-200 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-bold w-4 text-center">{nailConfig.brokenNailsCount}</span>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_NAIL_CONFIG',
                    payload: { brokenNailsCount: nailConfig.brokenNailsCount + 1 },
                  })
                }
                className="size-7 rounded-lg bg-[#F5F5F7] hover:bg-neutral-200 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
