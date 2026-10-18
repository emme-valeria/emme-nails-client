import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RotateCcw,
  Check,
  ChevronRight,
  Calendar,
  Camera,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/app/AppContext';
import { toast } from 'sonner';
import { triggerHapticFeedback } from '@/shared/utils/haptics';
import { motion } from 'motion/react';

export function BookingEntryWidget() {
  const navigate = useNavigate();
  const { addAppointment } = useApp();

  const handleQuickRebook = (serviceName: string, price: number) => {
    triggerHapticFeedback(15);
    const dateIso = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    addAppointment({
      clientId: '1',
      serviceId: 'm3',
      date: dateIso,
      startTime: '11:00',
      endTime: '12:15',
      status: 'confirmed',
      notes: `Re-booking 1-tap habitual: ${serviceName} con Valeria R.`
    });

    toast.success('¡Cita agendada exitosamente!', {
      description: `${serviceName} • Sábado a las 11:00 AM ($${price} MXN)`,
      icon: <Check className="size-4 text-emerald-500" />
    });
    navigate('/appointments');
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] pb-28 lg:pb-16 w-full max-w-2xl mx-auto space-y-6 text-left">
      
      {/* Sutil Fondo Difuminado (Idéntico a Inicio) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/[0.04] dark:bg-primary/[0.08] blur-[80px]" />
        <div className="absolute top-1/3 -right-24 size-80 rounded-full bg-amber-500/[0.03] dark:bg-amber-500/[0.06] blur-[90px]" />
        <div className="absolute -bottom-24 left-1/4 size-96 rounded-full bg-primary/[0.03] dark:bg-primary/[0.06] blur-[100px]" />
      </div>

      {/* ENCABEZADO (iOS Large Title idéntico a Inicio) */}
      <div className="pt-2 sm:pt-4 space-y-1">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-[-0.035em] text-[#1D1D1F] dark:text-white">
          Agendar Cita
        </h1>
        <p className="text-xs sm:text-sm text-[#86868B] dark:text-[#8E8E93] max-w-xl font-normal">
          Selecciona cómo prefieres programar tu servicio hoy:
        </p>
      </div>

      {/* TOP CARD: REPETIR ÚLTIMA CITA (Mismo estilo, blur, sombra y animación de Inicio) */}
      <motion.div
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <button
          type="button"
          onClick={() => handleQuickRebook('Gel-X Estructura & Relleno', 450)}
          className="w-full group p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.05)] hover:border-black/[0.08] dark:hover:border-white/[0.12] transition-all duration-300 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-between gap-3"
        >
          {/* Main Info: Icon Squircle + Title + Price & Sub-details */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="size-11 rounded-2xl bg-[#F5F5F7] dark:bg-white/[0.06] text-[#1D1D1F] dark:text-white flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-black/[0.04] shrink-0">
              <RotateCcw className="size-5 stroke-[1.8] group-hover:-rotate-45 transition-transform duration-300" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                  Repetir cita anterior
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] dark:text-white group-hover:text-primary transition-colors tracking-tight truncate">
                Gel-X Estructura & Relleno
              </h3>
              <p className="text-[11.5px] text-[#86868B] dark:text-[#8E8E93] font-normal flex items-center gap-1.5 truncate leading-snug">
                <span className="font-semibold text-[#1D1D1F] dark:text-white">$450 MXN</span>
                <span>•</span>
                <span>Valeria R.</span>
                <span>•</span>
                <span>60 min</span>
              </p>
            </div>
          </div>

          {/* Action CTA Button con efecto de Inicio */}
          <div 
            className="h-9 px-4 rounded-2xl bg-primary hover:brightness-105 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-[0_8px_20px_-4px_rgba(224,82,134,0.30)] pointer-events-none tracking-tight"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), transparent)'
            }}
          >
            <span>Repetir</span>
            <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </motion.div>

      {/* SECCIÓN PRINCIPAL: GRID DE OPCIONES (Mismo diseño, squircle, sombras y efectos de Inicio) */}
      <div className="space-y-3 pt-1">
        <h2 className="text-base font-bold text-[#1D1D1F] dark:text-white tracking-tight px-1">
          Opciones de Reserva
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* Opción A — Catálogo Completo */}
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <button
              type="button"
              onClick={() => {
                triggerHapticFeedback(10);
                navigate('/book/service');
              }}
              className="w-full h-full group p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.05)] hover:border-black/[0.08] dark:hover:border-white/[0.12] transition-all duration-300 cursor-pointer text-left overflow-hidden flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Contenido tipográfico alineado con Inicio */}
              <div className="space-y-2 flex-1 pt-1">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-primary/20 shrink-0">
                    <Calendar className="size-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white group-hover:text-primary transition-colors tracking-tight leading-snug">
                      Elegir Servicio
                    </h3>
                    <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-wider">
                      Catálogo Directo
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#86868B] dark:text-[#8E8E93] font-normal leading-relaxed pt-1">
                  Explora el catálogo completo: Gel, Acrílico, Pedicura, Estructura y Retoques.
                </p>
              </div>

              {/* Footer con precio y botón idéntico a Inicio */}
              <div className="pt-3 flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] gap-2">
                <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                  Desde $320 MXN
                </span>
                <div 
                  className="h-8 px-3.5 rounded-2xl bg-primary hover:brightness-105 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-[0_8px_20px_-4px_rgba(224,82,134,0.30)] shrink-0 tracking-tight"
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), transparent)'
                  }}
                >
                  <span>Ver Catálogo</span>
                  <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Opción B — Cotizar con Foto / IA */}
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <button
              type="button"
              onClick={() => {
                triggerHapticFeedback(10);
                navigate('/quotes/new');
              }}
              className="w-full h-full group p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.05)] hover:border-black/[0.08] dark:hover:border-white/[0.12] transition-all duration-300 cursor-pointer text-left overflow-hidden flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Contenido tipográfico alineado con Inicio */}
              <div className="space-y-2 flex-1 pt-1">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-primary/20 shrink-0">
                    <Camera className="size-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white group-hover:text-primary transition-colors tracking-tight leading-snug">
                      Cotizar Diseño con IA
                    </h3>
                    <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-wider">
                      Asistente Inteligente
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#86868B] dark:text-[#8E8E93] font-normal leading-relaxed pt-1">
                  Sube una foto de referencia de Instagram o Pinterest y obtén tu presupuesto en 30s.
                </p>
              </div>

              {/* Footer con precio y botón idéntico a Inicio */}
              <div className="pt-3 flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] gap-2">
                <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                  Diagnóstico en 30s
                </span>
                <div 
                  className="h-8 px-3.5 rounded-2xl bg-primary hover:brightness-105 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-[0_8px_20px_-4px_rgba(224,82,134,0.30)] shrink-0 tracking-tight"
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), transparent)'
                  }}
                >
                  <span>Subir Foto</span>
                  <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

