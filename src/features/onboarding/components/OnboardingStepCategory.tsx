import React from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight } from 'lucide-react';
import { OnboardingGoalId } from '../types';
import { ServiceCategorySVG } from './OnboardingSVGs';

interface OnboardingStepCategoryProps {
  selectedGoal: OnboardingGoalId;
  onSelect: (goal: OnboardingGoalId) => void;
}

export function OnboardingStepCategory({
  selectedGoal,
  onSelect
}: OnboardingStepCategoryProps) {
  const categories = [
    {
      id: 'extensions' as OnboardingGoalId,
      title: 'Uñas & Manicura',
      desc: 'Soft Gel, Acrílico, PolyGel & Rubber Base',
      svgKey: 'nail'
    },
    {
      id: 'lashes_brows' as OnboardingGoalId,
      title: 'Pestañas & Cejas',
      desc: 'Lash Lifting, Extensiones Foxy & Laminado',
      svgKey: 'lash'
    },
    {
      id: 'pedi_spa' as OnboardingGoalId,
      title: 'Pedicure Spa',
      desc: 'Jelly Spa, Masaje Hidratante & Esmaltado',
      svgKey: 'pedi'
    },
    {
      id: 'natural_care' as OnboardingGoalId,
      title: 'Cuidado Natural',
      desc: 'Tratamiento IBX, Keratina & Fortalecedor',
      svgKey: 'natural'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto space-y-4 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-left px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          Paso 1 de Personalización
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿En qué te gustaría enfocarte?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una especialidad para personalizar tu experiencia de belleza.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {categories.map((cat) => {
          const isSelected = selectedGoal === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`w-full min-h-[58px] sm:min-h-[64px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-[#E05286] text-white shadow-2xs' : 'bg-pink-50 text-[#E05286]'
                }`}>
                  <ServiceCategorySVG category={cat.svgKey} className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className={`text-[14px] sm:text-[15px] font-bold leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                    {cat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#86868B] leading-tight mt-0.5 truncate">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isSelected ? (
                  <div className="size-5 rounded-full bg-[#E05286] text-white flex items-center justify-center shadow-2xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                ) : (
                  <ChevronRight className="size-4 text-[#C5C5C7] group-hover:text-primary transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

