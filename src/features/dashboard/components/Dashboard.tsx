import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Camera, 
} from 'lucide-react';
import { useApp } from '@/app/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseLocalDate } from '@emme/ui/lib/utils';
import { triggerHapticFeedback } from '@/shared/utils/haptics';

export function Dashboard() {
  const navigate = useNavigate();
  const { appointments, services, clients } = useApp();

  // Active client (Valeria by default)
  const currentClient = clients[0] || { id: '1', name: 'Valeria Arriaza', phone: '+34 600 000 000', isVip: true };
  const clientFirstName = currentClient?.name ? currentClient.name.trim().split(' ')[0] : 'Valeria';

  // Filter client appointments
  const myAppointments = useMemo(() => {
    return appointments.filter(apt => apt.clientId === currentClient?.id);
  }, [appointments, currentClient?.id]);

  const upcomingAppointments = useMemo(() => {
    return myAppointments
      .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
  }, [myAppointments]);

  const nextAppointment = upcomingAppointments[0];
  const nextService = nextAppointment
    ? (services.find(s => s.id === nextAppointment.serviceId) || {
        id: nextAppointment.serviceId,
        name: nextAppointment.notes?.split('•')?.find(n => n.includes('Servicio:'))?.replace('Servicio:', '').trim() || 'Manicura & Nail Art',
        duration: 60,
        price: 480,
        category: 'Manicura y Uñas',
        isActive: true,
      })
    : null;

  return (
    <div className="relative min-h-[calc(100vh-6rem)] w-full max-w-[1600px] mx-auto text-left font-sans -mt-2 sm:-mt-3 lg:mt-0 bg-gradient-to-br from-[#FCF3F6] via-[#F8F9FA] to-[#F0F2F6] overflow-hidden flex flex-col m-0 p-0 lg:rounded-[32px] lg:border lg:border-white/70 lg:shadow-[0_18px_60px_rgba(37,27,34,0.06)]">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-100/40 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* HEADER SECTION */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-6 lg:pt-10 shrink-0 pb-8 lg:pb-12">
        
        {/* Mascot */}
        <div className="absolute top-0 right-[-20px] sm:right-0 lg:right-10 xl:right-16 z-0 pointer-events-none">
          <img 
            src="/conejomanicura.png" 
            alt="Mascot" 
            className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain drop-shadow-xl"
          />
        </div>

        {/* Logo in header */}
        <div className="relative z-10 flex items-center mt-3 sm:mt-4 mb-8 lg:mb-10">
          <h1 className="text-lg font-display tracking-tight font-extrabold flex items-center leading-none">
            <span className="text-[#E05286] mr-1">emme</span>
            <span className="text-[#1D1D1F] font-medium">studio</span>
          </h1>
        </div>

        {/* ENCABEZADO (Saludo Dinámico) */}
        <div className="relative z-10 max-w-[75%] sm:max-w-[65%] lg:max-w-[60%]">
          <h1 className="text-[28px] sm:text-4xl md:text-[40px] lg:text-5xl xl:text-6xl font-display font-bold tracking-tight text-[#1D1D1F] leading-[1.15]">
            {nextAppointment && nextService 
              ? <>¡Nos vemos,<br />{clientFirstName}!</>
              : (
                <span className="flex flex-col gap-1.5 mt-1">
                  <span>¡Estrena nuevo diseño!</span>
                  <span className="text-[16px] sm:text-xl font-medium text-[#86868B] tracking-normal leading-snug">
                    Tus uñas te lo piden
                  </span>
                </span>
              )}
          </h1>
        </div>
      </div>

      {/* BOTTOM SHEET CONTAINER */}
      <div className="relative z-20 flex-1 bg-[#F8F9FA] rounded-t-[32px] lg:rounded-[32px] px-5 sm:px-8 lg:px-10 xl:px-12 pt-8 lg:pt-10 pb-32 lg:pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] lg:shadow-none border-t border-white/60 lg:border lg:border-white/70 mt-5 sm:mt-7 lg:mt-0 lg:mx-8 xl:mx-12 lg:mb-8 flex flex-col space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8 lg:space-y-0">
        
        {/* SECCIÓN 1: ATAJOS RÁPIDOS */}
        <div className="space-y-4 lg:space-y-5">
          <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight px-1">
            ¿Cómo quieres agendar?
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:gap-5 items-stretch">
            {/* Card 1: Cotizar con IA */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHapticFeedback(10);
                navigate('/quotes/new');
              }}
              className="premium-card rounded-3xl bg-[#F5D6E0] p-6 sm:p-7 lg:p-8 flex flex-col items-center text-center cursor-pointer hover:bg-[#F1C9D6] h-full group"
            >
              <img src="/camara_frontal.png" alt="Cámara" className="w-20 h-20 object-contain mb-2 drop-shadow-sm" />
              <h3 className="text-base font-bold text-[#1D1D1F] leading-tight mb-1.5">
                Cotizar con IA
              </h3>
              <p className="text-[13px] text-[#86868B] leading-snug font-medium">
                Sube foto y cotiza al instante
              </p>
            </motion.div>

            {/* Card 2: Agendar Cita */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHapticFeedback(10);
                navigate('/book/service');
              }}
              className="premium-card p-6 sm:p-7 lg:p-8 flex flex-col items-center text-center cursor-pointer h-full group"
            >
              <img src="/calendario_frontal.png" alt="Calendario" className="w-20 h-20 object-contain mb-2 drop-shadow-sm" />
              <h3 className="text-base font-bold text-[#1D1D1F] leading-tight mb-1.5">
                Agendar Cita
              </h3>
              <p className="text-[13px] text-[#86868B] leading-snug font-medium">
                Elige técnica y horario
              </p>
            </motion.div>
          </div>
        </div>

        {/* SECCIÓN 2: PRÓXIMA CITA */}
        <div>
          {nextAppointment && nextService ? (
            <div className="premium-card rounded-3xl p-6 sm:p-7 lg:p-8 overflow-hidden lg:sticky lg:top-8">
              <div className="relative z-10 flex items-center gap-4 sm:gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-pink-50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center shrink-0">
                  <Calendar className="size-6 text-[#E05286] stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E05286]">
                    Próxima Cita
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight leading-tight mt-0.5">
                    {nextService.name}
                  </h2>
                  <p className="text-sm text-[#86868B] font-medium mt-1">
                    {nextService.duration} min de sesión en estudio
                  </p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 pt-5">
                <div className="bg-slate-50 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-[#1D1D1F] capitalize flex justify-center items-center">
                  {format(parseLocalDate(nextAppointment.date), "EEEE d 'de' MMMM", { locale: es })}
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-[#1D1D1F] flex justify-center items-center">
                  {nextAppointment.startTime} - {nextAppointment.endTime} hrs
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHapticFeedback(10);
                  navigate('/agenda');
                }}
                className="mt-5 w-full h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-[#D84C7B] to-[#F26B9D] text-white font-bold text-sm sm:text-base flex items-center justify-center transition-all shadow-md active:scale-[0.98]"
              >
                Gestionar Cita
              </button>
            </div>
          ) : (
            <div className="premium-card rounded-3xl p-6 sm:p-7 flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white border border-pink-50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center shrink-0">
                <Calendar className="size-6 text-[#E05286] stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-[17px] sm:text-lg font-bold text-[#1D1D1F] tracking-tight leading-snug">
                  No tienes citas próximas
                </h2>
                <p className="text-[13px] text-[#86868B] font-medium mt-0.5 leading-snug">
                  Tus reservas confirmadas aparecerán aquí
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
