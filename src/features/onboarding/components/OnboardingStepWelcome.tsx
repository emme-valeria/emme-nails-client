import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Zap, Gift } from 'lucide-react';

interface OnboardingStepWelcomeProps {
  onContinue: () => void;
}

export function OnboardingStepWelcome({ onContinue }: OnboardingStepWelcomeProps) {
  const perks = [
    {
      icon: Calendar,
      title: 'Reserva Directa 24/7',
      desc: 'Elige técnica, hora y especialista sin esperas.',
      badge: 'Inmediato'
    },
    {
      icon: Zap,
      title: 'Cotizador IA por Foto',
      desc: 'Sube tu foto de Pinterest y calcula el precio.',
      badge: 'IA Exclusiva'
    },
    {
      icon: Gift,
      title: 'Puntos & Regalos VIP',
      desc: 'Acumula beneficios y servicios de cortesía.',
      badge: '+100 Puntos'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto space-y-6 text-[#1D1D1F]"
    >
      {/* Big Hero Image Card with subtle pink glow */}
      <div className="relative w-full h-56 sm:h-72 rounded-3xl overflow-hidden shadow-md border border-pink-100 group">
        <img
          src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1000&auto=format&fit=crop&q=80"
          alt="EMME Studio Experience"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E05286]/80 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold w-fit mb-2 shadow-xs">
            <Sparkles className="size-3 text-pink-200" />
            <span>Studio Oficial • Manicura & Pestañas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Tu estudio de belleza de alta gama en tu bolsillo
          </h2>
        </div>
      </div>

      {/* Headline & Clean Intro */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Bienvenida a <span className="text-[#E05286]">EMME Studio</span>
        </h1>
        <p className="text-sm text-[#86868B] leading-relaxed">
          Personaliza tu estilo favorito y asegura tu cita con atención personalizada y materiales de alta gama.
        </p>
      </div>

      {/* 3 Clear Benefit Cards (White with rose pink accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {perks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-pink-100/80 shadow-xs flex flex-col justify-between gap-2 transition-all hover:border-pink-300"
            >
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#E05286] shadow-xs">
                  <Icon className="size-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-[#E05286] border border-pink-100">
                  {item.badge}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1D1D1F]">{item.title}</h4>
                <p className="text-[11px] text-[#86868B] mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
