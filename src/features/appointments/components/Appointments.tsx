import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp, type Appointment } from '@/app/AppContext';
import { Button } from '@emme/ui/button';
import { cn } from '@emme/ui/lib/utils';
import { Plus, Calendar, Clock, Sparkles, History, CalendarDays, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { UpcomingAppointmentsList } from './UpcomingAppointmentsList';
import { PastAppointmentsHistory } from './PastAppointmentsHistory';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { NextAppointmentBanner } from './NextAppointmentBanner';
import { StudioHoursView } from './StudioHoursView';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';

export function Appointments() {
  const { appointments, clients, services, profile, updateAppointmentStatus } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  type TabType = 'upcoming' | 'next' | 'horario' | 'past';

  const [mainTab, setMainTab] = useState<TabType>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'next' || tabParam === 'proxima') return 'next';
    if (tabParam === 'horario' || tabParam === 'hours') return 'horario';
    if (tabParam === 'past' || tabParam === 'historial') return 'past';
    return 'upcoming';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'next' || tabParam === 'proxima') setMainTab('next');
    else if (tabParam === 'horario' || tabParam === 'hours') setMainTab('horario');
    else if (tabParam === 'past' || tabParam === 'historial') setMainTab('past');
    else if (tabParam === 'upcoming') setMainTab('upcoming');
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setMainTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);

  // Derived state with safe fallbacks
  const currentClient = clients[0] || { id: '1', name: 'Valeria Arriaza', phone: '+34 600 000 000', isVip: true };

  const myAppointments = useMemo(() => {
    return appointments.filter(apt => apt.clientId === currentClient?.id);
  }, [appointments, currentClient?.id]);

  const upcomingAppointments = useMemo(() => {
    return myAppointments
      .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
  }, [myAppointments]);

  const pastAppointments = useMemo(() => {
    return myAppointments
      .filter(apt => apt.status === 'completed' || apt.status === 'cancelled')
      .sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());
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
    <div className="animate-in fade-in duration-300 pb-36 lg:pb-16 w-full max-w-5xl mx-auto min-h-screen space-y-6">
      {/* Header & Primary Action (Flush / Breathable) */}
      <div className="px-1 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Control de Citas
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-[#1D1D1F] dark:text-foreground">
              Mi Agenda Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] font-medium mt-1">
              Consulta, añade o reprograma tus tratamientos en Emme Studio
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              data-tour="book-button"
              onClick={() => navigate('/book/service')} 
              className="h-10 px-5 rounded-2xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="size-4 stroke-[3]" />
              <span>Agendar Nueva Cita</span>
            </button>
          </div>
        </div>

        {/* Authentic Apple iOS Segmented Control */}
        <SegmentedCapsuleTabs<TabType>
          value={mainTab}
          onChange={(tab) => handleTabChange(tab)}
          layoutId="appointmentsTabPill"
          fullWidth
          containerClassName="max-w-2xl"
          items={[
            { id: 'upcoming', label: `Citas Activas (${upcomingAppointments.length})` },
            { id: 'next', label: 'Próxima Cita' },
            { id: 'horario', label: 'Horarios & Ubicación' },
            { id: 'past', label: `Historial (${pastAppointments.length})` },
          ]}
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {mainTab === 'next' && (
          <div className="space-y-4">
            {nextAppointment && nextService ? (
              <NextAppointmentBanner 
                nextAppointment={nextAppointment}
                nextService={nextService}
                profile={profile}
                generateGoogleCalendarLink={() => '#'}
                onRescheduleWithAi={() => navigate('/chat')}
              />
            ) : (
              <div className="p-8 text-center bg-white dark:bg-card rounded-3xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
                <Sparkles className="size-8 text-primary mx-auto opacity-50" />
                <h3 className="font-display font-bold text-base text-[#1D1D1F]">No tienes una próxima cita programada</h3>
                <p className="text-xs text-[#86868B] max-w-sm mx-auto">Selecciona un servicio de nuestro catálogo para asegurar tu lugar con tu especialista favorita.</p>
                <Button onClick={() => navigate('/book/service')} className="rounded-xl bg-primary text-white font-bold text-xs">
                  Agendar Ahora
                </Button>
              </div>
            )}
          </div>
        )}

        {mainTab === 'horario' && (
          <StudioHoursView profile={profile} />
        )}

        {mainTab === 'upcoming' && (
          <div className="bg-white dark:bg-card rounded-2xl sm:rounded-3xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            <UpcomingAppointmentsList 
              upcomingAppointments={upcomingAppointments}
              services={services}
              generateGoogleCalendarLink={() => '#'}
              onOpenAgendarModal={() => navigate('/book/service')}
              onSelectCancelApt={setCancelModalApt}
            />
          </div>
        )}

        {mainTab === 'past' && (
          <div className="bg-white dark:bg-card rounded-2xl sm:rounded-3xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            <PastAppointmentsHistory 
              pastAppointments={pastAppointments}
              services={services}
            />
          </div>
        )}
      </div>

      <CancelAppointmentModal 
        onClose={() => setCancelModalApt(null)}
        appointment={cancelModalApt}
        service={cancelModalApt ? services.find(s => s.id === cancelModalApt.serviceId) : undefined}
        onConfirmCancel={(id) => {
          if (updateAppointmentStatus) {
            updateAppointmentStatus(id, 'cancelled');
            toast.success('Tu cita ha sido cancelada exitosamente');
          }
          setCancelModalApt(null);
        }}
      />
    </div>
  );
}
