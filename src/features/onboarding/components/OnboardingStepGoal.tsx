import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Sparkles } from 'lucide-react';
import { OnboardingGoalId } from '../types';

interface OnboardingStepGoalProps {
  selectedGoal: OnboardingGoalId;
  selectedService: string;
  onSelect: (goal: OnboardingGoalId, serviceName: string) => void;
}

export function OnboardingStepGoal({
  selectedGoal,
  selectedService,
  onSelect
}: OnboardingStepGoalProps) {
  const emmeServices = [
    {
      goalId: 'extensions' as OnboardingGoalId,
      name: 'Soft Gel (Full Cover Tips)',
      category: 'Extensiones',
      price: '$50',
      duration: '90 min',
      description: 'Tips de gel pre-formados, máxima ligereza y durabilidad 3-4 semanas.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
      badge: 'Más Popular'
    },
    {
      goalId: 'natural_care' as OnboardingGoalId,
      name: 'Manicura Rusa con Torno',
      category: 'Cuidado Natural',
      price: '$45',
      duration: '90 min',
      description: 'Limpieza profunda de cutícula con fresas de diamante y esmaltado bajo cutícula.',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80',
      badge: 'Técnica Estrella'
    },
    {
      goalId: 'extensions' as OnboardingGoalId,
      name: 'Uñas de Acrílico Esculturales',
      category: 'Estructura',
      price: '$60',
      duration: '120 min',
      description: 'Estructura sobre molde con polímeros de alta resistencia para cualquier largo.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
      badge: 'Máxima Fuerza'
    },
    {
      goalId: 'natural_care' as OnboardingGoalId,
      name: 'Nivelación con Base Rubber',
      category: 'Cuidado Natural',
      price: '$35',
      duration: '60 min',
      description: 'Alineación del ápice y refuerzo flexible para uñas débiles o quebradizas.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      badge: 'Salud Uñas'
    },
    {
      goalId: 'pedi_spa' as OnboardingGoalId,
      name: 'Pedicura Spa & Jelly Spa',
      category: 'Spa & Pies',
      price: '$50',
      duration: '90 min',
      description: 'Tina de hidromasaje, exfoliación profunda, jelly relajante y esmaltado.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
      badge: 'Relax Total'
    },
    {
      goalId: 'lashes_brows' as OnboardingGoalId,
      name: 'Lash Lift & Mirada EMME',
      category: 'Pestañas & Cejas',
      price: '$45',
      duration: '60 min',
      description: 'Lifting con botox de keratina, tinte y laminado de cejas orgánico.',
      image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&auto=format&fit=crop&q=80',
      badge: 'Tendencia'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto space-y-4 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-left">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#E05286]">Paso 1 de 6</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Elige tu servicio en <span className="text-[#E05286]">EMME</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Servicios profesionales con esterilización grado hospitalario y garantía de 7 días.
        </p>
      </div>

      {/* Grid of Real EMME Services (Clean White Card + Rose Pink Outline when selected) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {emmeServices.map((item) => {
          const isSelected = selectedService.toLowerCase() === item.name.toLowerCase();
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelect(item.goalId, item.name)}
              className={`relative h-40 sm:h-44 rounded-2xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                isSelected
                  ? 'border-[#E05286] shadow-lg shadow-pink-500/15 ring-2 ring-[#E05286]/30'
                  : 'border-pink-100 hover:border-pink-300'
              }`}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

              {/* Top Details & Check */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#E05286]/90 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-[#E05286] shadow-xs">
                    {item.price}
                  </span>
                </div>

                <div className={`size-6 rounded-full flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-[#E05286] text-white border-[#E05286] shadow-xs'
                    : 'border-white/50 bg-black/30 text-transparent'
                }`}>
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                <div className="flex items-center gap-1 text-[10px] text-pink-200 font-bold mb-0.5">
                  <Clock className="size-3" />
                  <span>{item.duration}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-black leading-tight">{item.name}</h3>
                <p className="text-[10px] text-neutral-200 leading-tight mt-0.5 line-clamp-1">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
