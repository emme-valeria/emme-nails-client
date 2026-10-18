import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CalendarHeart, 
  MessageSquareText, 
  ChevronRight, 
  Zap, 
  CheckCircle2,
  CheckCheck,
  Clock,
  CreditCard
} from 'lucide-react';
import emmeMascotImg from '@/assets/images/emme_pet_clean_1786682432329.jpg';

interface OnboardingStepAiShowcaseProps {
  onNext?: () => void;
}

const AUTO_DURATION = 5000;
const intervalTime = 50;
const stepIncrement = (intervalTime / AUTO_DURATION) * 100;

export function OnboardingStepAiShowcase({ onNext }: OnboardingStepAiShowcaseProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'ai-quote',
      title: 'Tu inspiración, al instante',
      description: 'Sube la foto del diseño que amas. Nuestra IA te dirá la técnica exacta, el tiempo y el precio.',
      color: 'purple',
      widget: (
        <div className="w-full bg-white rounded-2xl border border-purple-100 shadow-xl shadow-purple-500/10 p-3.5 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">EMME Vision</p>
              <p className="text-xs font-black text-[#1D1D1F] flex items-center gap-1">Analizando diseño<span className="flex gap-0.5"><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5 }}>.</motion.span><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span></span></p>
            </div>
          </div>
          <div className="relative h-28 rounded-xl overflow-hidden border border-black/5">
            <img 
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=80" 
              alt="Nail Art" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            {/* Escáner láser en bucle */}
            <motion.div 
              animate={{ y: [-10, 120, -10] }} 
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute left-0 right-0 top-0 h-[2px] bg-purple-400 shadow-[0_0_12px_4px_rgba(168,85,247,0.6)] z-10" 
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" as any, stiffness: 300, damping: 20 }} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="size-3"/> Soft Gel
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring" as any, stiffness: 300, damping: 20 }} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <Clock className="size-3"/> 90 min
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, type: "spring" as any, stiffness: 300, damping: 20 }} className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <CreditCard className="size-3"/> $850 MXN
            </motion.div>
          </div>
        </div>
      )
    },
    {
      id: 'booking',
      title: 'Agenda en segundos',
      description: 'Encuentra el espacio perfecto y elige a tu especialista favorita. Confirmación inmediata, sin esperas.',
      color: 'pink',
      widget: (
        <div className="w-full bg-white rounded-2xl border border-pink-100 shadow-xl shadow-pink-500/10 p-3.5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-full bg-pink-100 text-[#E05286] flex items-center justify-center">
              <CalendarHeart className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Tu cita perfecta</p>
              <p className="text-xs font-black text-[#1D1D1F]">Octubre 2026</p>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-hidden pb-1">
            {[12, 13, 14, 15].map((day, i) => (
              <motion.div key={day} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`flex flex-col items-center justify-center flex-1 h-[48px] rounded-xl border ${i === 1 ? 'border-[#E05286] bg-[#E05286] text-white shadow-md shadow-pink-500/20' : 'border-black/5 bg-[#F8F8FA] text-[#1D1D1F]'}`}>
                <span className="text-[9px] font-bold opacity-80">{['Lu', 'Ma', 'Mi', 'Ju'][i]}</span>
                <span className="text-sm font-black">{day}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-2 rounded-xl border border-black/5 bg-[#F8F8FA] text-center">
              <p className="text-xs font-black text-black/40">15:00</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="p-2 rounded-xl border border-[#E05286] bg-pink-50 text-center shadow-xs relative overflow-hidden">
               <motion.div animate={{ opacity: [0, 0.2, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-[#E05286]" />
               <p className="text-xs font-black text-[#E05286] relative z-10">16:30</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="p-2 rounded-xl border border-black/5 bg-[#F8F8FA] text-center">
              <p className="text-xs font-black text-[#1D1D1F]">18:00</p>
            </motion.div>
          </div>

          <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: 1, type: "spring" as any }} className="bg-[#1D1D1F] p-2.5 rounded-xl flex items-center justify-between mt-2 shadow-lg">
            <span className="text-[11px] font-bold text-white">Confirmar Reserva</span>
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronRight className="size-4 text-white" />
            </motion.div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'assistant',
      title: 'Tu asistente personal 24/7',
      description: '¿Dudas sobre tu diseño? ¿Necesitas reagendar? EMME te asiste por WhatsApp en todo momento.',
      color: 'blue',
      widget: (
        <div className="w-full bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10 p-3.5 space-y-3">
          <div className="flex items-center gap-2 mb-1 border-b border-black/5 pb-2">
            <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden border border-blue-200 shrink-0">
              <img src={emmeMascotImg} alt="EMME Mascot" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">EMME AI</p>
              <p className="text-xs font-black text-[#1D1D1F] flex items-center gap-1">En línea <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"/></p>
            </div>
          </div>
          <div className="space-y-2.5 pt-1">
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, type: "spring" as any }} className="bg-[#F2F2F7] p-2.5 rounded-2xl rounded-tr-sm w-[85%] ml-auto text-[11px] font-medium text-[#1D1D1F]">
              ¡Hola! Me encantaría agendar un retoque para hoy. ¿Tienen espacio?
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1, type: "spring" as any }} className="bg-blue-50 border border-blue-100/60 p-2.5 rounded-2xl rounded-tl-sm w-[95%] text-[11px] font-medium text-blue-950 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-2">
                <Sparkles className="size-3.5 mt-0.5 shrink-0 text-blue-500 fill-blue-500" />
                <span className="leading-relaxed">¡Hola hermosa! ✨ Sí, claro. Tengo un espacio a las <strong>16:30</strong> con Valeria. ¿Te lo separo?</span>
              </div>
              <div className="flex justify-end w-full mt-1">
                 <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }}>
                   <CheckCheck className="size-3.5 text-blue-500"/>
                 </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleManualSlideSelect = (idx: number) => {
    setActiveSlide(idx);
    setProgress(0);
  };

  const getThemeColors = (color: string) => {
    switch (color) {
      case 'purple': return '#F3E8FF';
      case 'pink': return '#FCE7F3';
      case 'blue': return '#DBEAFE';
      default: return '#F3E8FF';
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto space-y-5">
      
      {/* Visual Widget Area (Sandboxed Viewport) */}
      <div 
        className="relative w-full aspect-[4/3.5] max-h-[320px] flex items-center justify-center overflow-hidden touch-pan-y"
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerLeave={() => setIsPaused(false)}
      >
        {/* Animated Background Blob */}
        <motion.div 
          animate={{ backgroundColor: getThemeColors(slides[activeSlide].color) }}
          className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-60 -z-10 transition-colors duration-700" 
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Curvas Bezier Nativas de iOS
            className="w-full px-5"
          >
            {slides[activeSlide].widget}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text & Indicators */}
      <div className="w-full text-center space-y-4 px-2">
        {/* Continuous Progress Feedback (Apple HIG Indicator) */}
        <div className="flex justify-center gap-1.5 mb-3 h-1.5">
          {slides.map((_, idx) => (
            <motion.div
              key={idx}
              onClick={() => handleManualSlideSelect(idx)}
              animate={{ width: activeSlide === idx ? 32 : 8 }}
              className="relative h-1.5 rounded-full overflow-hidden bg-black/10 cursor-pointer"
            >
              <div 
                className={`absolute left-0 top-0 bottom-0 rounded-full transition-colors ${activeSlide === idx ? 'bg-[#1D1D1F]' : 'bg-[#1D1D1F]/40'}`}
                style={{ 
                  width: idx === activeSlide 
                    ? `${progress}%` 
                    : idx < activeSlide ? '100%' : '0%' 
                }}
              />
            </motion.div>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-1.5 h-[85px] sm:h-[75px]" // Fixed height to prevent layout shift
          >
            <h3 className="text-xl font-black text-[#1D1D1F] tracking-tight">
              {slides[activeSlide].title}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-[#86868B] leading-relaxed px-2 font-medium">
              {slides[activeSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Advance Button - Thumb Zone Architecture w-full h-13 */}
      {onNext && (
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#d04377' }}
          whileTap={{ scale: 0.98 }} // Micro-interaction scale
          onClick={onNext}
          className="w-full h-13 sm:h-14 mt-2 rounded-2xl bg-[#E05286] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-colors cursor-pointer select-none"
        >
          <span>Configurar mi perfil</span>
          <ChevronRight className="size-4.5 stroke-[3]" />
        </motion.button>
      )}
    </div>
  );
}
