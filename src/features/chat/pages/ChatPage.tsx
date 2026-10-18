import React from 'react';
import { EmmeAiChatWidget } from '@/features/chat';
import { 
  Sparkles, ShieldCheck, Clock, Phone, MapPin, Award, 
  CalendarCheck, Camera, Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { Badge } from '@emme/ui/badge';
import { Button } from '@emme/ui/button';
import { useNavigate } from 'react-router-dom';

export function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-0 lg:h-[calc(100vh-4.5rem)] flex flex-col lg:flex-row gap-5 2xl:gap-6 animate-in fade-in duration-300 pb-0 lg:pb-4 max-w-[1700px] mx-auto">
      {/* Main Chat Interface */}
      <div className="flex-1 h-full min-w-0 flex flex-col min-h-0">
        <EmmeAiChatWidget isFloating={false} />
      </div>

      {/* Responsive Studio AI Companion Panel (Visible on Desktop / Large screens) */}
      <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-4 h-full overflow-y-auto custom-scrollbar shrink-0 pb-2">
        {/* Assistant Capabilities Card */}
        <div className="bg-white border border-black/[0.06] rounded-[24px] p-4.5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="size-4.5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#1D1D1F]">Asistente Emme AI</h4>
                <p className="text-[11px] text-[#86868B]">Asistente Virtual 24/7</p>
              </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
              En Línea
            </Badge>
          </div>

          <p className="text-xs text-[#86868B] leading-relaxed">
            Nuestra IA está entrenada con las técnicas de manicura rusa, soft gel y nail art más avanzadas para cotizar al instante.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/[0.04]">
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/[0.03]">
              <span className="text-[10px] font-bold text-[#86868B] uppercase block">Precisión Visión</span>
              <span className="text-sm font-extrabold text-[#1D1D1F]">99.4%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/[0.03]">
              <span className="text-[10px] font-bold text-[#86868B] uppercase block">Reserva en</span>
              <span className="text-sm font-extrabold text-primary">&lt; 1 min</span>
            </div>
          </div>
        </div>

        {/* Studio Direct Shortcuts */}
        <div className="bg-white border border-black/[0.06] rounded-[24px] p-4.5 shadow-sm space-y-3">
          <h5 className="font-display font-bold text-xs uppercase tracking-wider text-[#86868B]">
            Accesos Rápidos de Estudio
          </h5>

          <div className="space-y-1.5">
            <button 
              onClick={() => navigate('/booking')}
              className="w-full p-2.5 rounded-xl border border-black/[0.04] hover:border-primary/30 hover:bg-primary/5 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <CalendarCheck className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1D1D1F] group-hover:text-primary transition-colors">Centro de Reservas</p>
                  <p className="text-[10px] text-[#86868B]">Agenda guiada completa</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>

            <button 
              onClick={() => navigate('/quotes/new')}
              className="w-full p-2.5 rounded-xl border border-black/[0.04] hover:border-rose-500/30 hover:bg-rose-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7.5 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Camera className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1D1D1F] group-hover:text-rose-600 transition-colors">Cotizador con Foto</p>
                  <p className="text-[10px] text-[#86868B]">Sube inspiración de Instagram</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[#86868B] group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button 
              onClick={() => navigate('/services')}
              className="w-full p-2.5 rounded-xl border border-black/[0.04] hover:border-purple-500/30 hover:bg-purple-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7.5 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Layers className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1D1D1F] group-hover:text-purple-600 transition-colors">Menú de Tratamientos</p>
                  <p className="text-[10px] text-[#86868B]">Precios y duraciones</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[#86868B] group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* Studio Info & Security Card */}
        <div className="bg-white border border-black/[0.06] rounded-[24px] p-4.5 shadow-sm space-y-3 mt-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <ShieldCheck className="size-4" />
            <span>Garantía & Seguridad EMME</span>
          </div>

          <div className="space-y-2 text-[11px] text-[#86868B]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Garantía de 7 días en aplicaciones de Soft Gel y Polygel.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Instrumental 100% esterilizado en autoclave grado médico.</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="size-3.5 text-primary shrink-0 mt-0.5" />
              <span>Horario hoy: 9:00 AM - 8:00 PM (Lunes a Sábado).</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ChatPage;
