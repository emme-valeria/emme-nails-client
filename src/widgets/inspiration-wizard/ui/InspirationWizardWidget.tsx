import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INSPIRATION_DESIGNS } from '@/entities/inspiration/data';
import { InspirationItem } from '@/entities/inspiration/types';
import { InspirationCategorySelector, InspirationStyle } from '@/features/select-inspiration/ui/InspirationCategorySelector';
import { InspirationGrid } from '@/features/select-inspiration/ui/InspirationGrid';
import { Sparkles, ArrowRight, CheckCircle2, Sliders, ArrowLeft, Upload } from 'lucide-react';
import { NailPhotoVisualFlow } from '@/features/assisted-design/ui/NailPhotoVisualFlow';
import { NailShape } from '@/shared/components/NailShapeSelector';
import { NailLength } from '@/shared/components/NailLengthSelector';

export function InspirationWizardWidget() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<InspirationStyle | 'All'>('All');
  const [selectedDesign, setSelectedDesign] = useState<InspirationItem | null>(INSPIRATION_DESIGNS[0]);
  const [isVisualFlowActive, setIsVisualFlowActive] = useState<boolean>(false);

  const filteredItems = selectedCategory === 'All'
    ? INSPIRATION_DESIGNS
    : INSPIRATION_DESIGNS.filter((item) => item.styleCategory === selectedCategory);

  const handleUseDesign = () => {
    if (!selectedDesign) return;
    setIsVisualFlowActive(true);
  };

  const handleProceedToBooking = (data: {
    imageUrl: string;
    shape: NailShape;
    length: NailLength;
    removal: string;
    totalPriceMXN: number;
    depositMXN: number;
    durationMins: number;
  }) => {
    navigate('/quotes/new', {
      state: {
        prefilledData: {
          baseServiceId: 'gel-extensions',
          length: data.length,
          shape: data.shape,
          imageUrl: data.imageUrl,
          removal: data.removal,
          descriptionText: `Inspirado en diseño personalizado • Forma: ${data.shape}, Largo: ${data.length}`
        }
      }
    });
  };

  if (isVisualFlowActive && selectedDesign) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => setIsVisualFlowActive(false)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#86868B] hover:text-[#1D1D1F] px-3 py-1.5 rounded-xl bg-white border border-black/[0.08] shadow-2xs cursor-pointer transition-all"
        >
          <ArrowLeft className="size-3.5" />
          <span>Volver al Catálogo de Inspiración</span>
        </button>

        <NailPhotoVisualFlow
          initialImageUrl={selectedDesign.imageUrl}
          initialShape={(selectedDesign.understoodTags.shape.toLowerCase() as NailShape) || 'almond'}
          initialLength={(selectedDesign.understoodTags.length.toLowerCase() as NailLength) || 'medium'}
          onProceedToAvailability={handleProceedToBooking}
          onCancel={() => setIsVisualFlowActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Containerless */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block">
              Inspiration Flow & Catálogo
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1D1D1F]">
              ¿Qué estilo te gusta más?
            </h2>
            <p className="text-xs sm:text-sm text-[#86868B] font-medium max-w-xl">
              Explora por categoría o sube tu referencia. En solo 4 pasos definirás silueta, largo, retiro y verás el precio exacto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedDesign(INSPIRATION_DESIGNS[0]);
              setIsVisualFlowActive(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-black/10 text-xs font-bold text-[#1D1D1F] flex items-center gap-2 shadow-2xs cursor-pointer transition-all self-start shrink-0"
          >
            <Upload className="size-3.5 text-primary" />
            <span>Subir Mi Propia Foto</span>
          </button>
        </div>

        {/* Category Pills */}
        <InspirationCategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {/* Grid of Designs */}
      <InspirationGrid
        items={filteredItems}
        selectedId={selectedDesign?.id}
        onSelectImage={(item) => {
          setSelectedDesign(item);
        }}
      />

      {/* "We Understood" Bottom Bar */}
      {selectedDesign && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between gap-2 border-b border-black/[0.04] pb-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
                <Sparkles className="size-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">
                  Diseño seleccionado: <span className="text-primary">{selectedDesign.title}</span>
                </h3>
                <p className="text-[11px] text-[#86868B]">
                  Especificaciones detectadas para cotización en tiempo real
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseDesign}
              className="hidden sm:inline-flex h-10 px-5 rounded-xl bg-primary hover:brightness-105 font-bold text-xs text-white shadow-xs items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Sliders className="size-3.5" />
              <span>Configurar Silueta & Cotizar</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* Understood Tag Pills */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-[11px]">
              Acabado: {selectedDesign.understoodTags.finish}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-black/[0.05] text-[#1D1D1F] font-semibold text-[11px]">
              Tono: {selectedDesign.understoodTags.color}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-black/[0.05] text-[#1D1D1F] font-semibold text-[11px]">
              Forma: {selectedDesign.understoodTags.shape}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-black/[0.05] text-[#1D1D1F] font-semibold text-[11px]">
              Largo: {selectedDesign.understoodTags.length}
            </span>
            {selectedDesign.understoodTags.details.map((dt, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-black/[0.05] text-[#1D1D1F] font-semibold text-[11px]"
              >
                {dt}
              </span>
            ))}
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF5EC] border border-[#ECDCC2] text-[#845E1B] font-semibold text-[11px]">
              {selectedDesign.understoodTags.complexity}
            </span>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden pt-2">
            <button
              type="button"
              onClick={handleUseDesign}
              className="w-full h-10 rounded-xl bg-primary hover:brightness-105 font-bold text-xs text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Sliders className="size-3.5" />
              <span>Configurar Silueta & Cotizar</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
