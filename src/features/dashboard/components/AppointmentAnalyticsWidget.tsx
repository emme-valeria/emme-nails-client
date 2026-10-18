import React, { useState, useMemo } from 'react';
import { CalendarDays, TrendingUp, CheckCircle2, Clock, Target, Percent, Sparkles, Award, Star, Building2, UserCheck, ChevronRight } from 'lucide-react';
import { useApp } from '@/app/AppContext';
import { cn } from '@emme/ui/lib/utils';
import { Button } from '@emme/ui/button';

export function AppointmentAnalyticsWidget() {
  const { appointments, services, profile, clients } = useApp();
  const [viewMode, setViewMode] = useState<'client' | 'studio'>('client');

  // Active client
  const currentClient = clients.find(c => c.isVip) || clients[0] || {
    id: '1',
    name: 'Valeria Arriaza',
    isVip: true
  };

  const clientAppointments = appointments.filter(a => a.clientId === currentClient.id || true);
  const completedClientApts = clientAppointments.filter(a => a.status === 'completed');
  const upcomingClientApts = clientAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');

  const studioMetrics = useMemo(() => {
    const totalAppointments = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed');
    const pending = appointments.filter(a => a.status === 'pending');
    const confirmed = appointments.filter(a => a.status === 'confirmed');

    let totalRevenue = 0;
    appointments.forEach(apt => {
      if (apt.status === 'completed' || apt.status === 'confirmed') {
        const s = services.find(srv => srv.id === apt.serviceId);
        if (s) totalRevenue += s.price;
      }
    });

    const monthlyGoal = profile.monthlyGoal || 25000;
    const goalPercentage = Math.min(100, Math.round((totalRevenue / monthlyGoal) * 100));
    const avgTicket = totalAppointments > 0 ? Math.round(totalRevenue / (completed.length + confirmed.length || 1)) : 0;
    const capacityOccupancy = Math.min(95, Math.round(((completed.length + confirmed.length + pending.length) / 30) * 100));

    return {
      totalAppointments,
      completedCount: completed.length,
      pendingCount: pending.length,
      confirmedCount: confirmed.length,
      totalRevenue,
      monthlyGoal,
      goalPercentage,
      avgTicket,
      capacityOccupancy,
    };
  }, [appointments, services, profile]);

  return (
    <div className="space-y-4">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between bg-neutral-100/80 p-1.5 rounded-2xl border border-black/[0.03] max-w-fit">
        <button
          onClick={() => setViewMode('client')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2",
            viewMode === 'client'
              ? "bg-\[#1D1D1F\] text-white shadow-xs font-black"
              : "text-[#86868B] hover:text-[#1D1D1F]"
          )}
        >
          <Sparkles className={cn("size-3.5", viewMode === 'client' ? "text-white" : "text-primary")} />
          <span>Mi Portal Clienta VIP</span>
        </button>
        <button
          onClick={() => setViewMode('studio')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2",
            viewMode === 'studio'
              ? "bg-\[#1D1D1F\] text-white shadow-xs"
              : "text-[#86868B] hover:text-[#1D1D1F]"
          )}
        >
          <Building2 className="size-3.5" />
          <span>Métricas Studio Tenant</span>
        </button>
      </div>

      {/* Client View Widgets */}
      {viewMode === 'client' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {/* Card 1: Mis Citas Programadas */}
          <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-primary" />
                Mis Citas Activas
              </span>
              <span className="text-[10px] font-extrabold text-[#845E1B] bg-[#FAF5EC] border border-[#845E1B]/20 px-2 py-0.5 rounded-full">
                {upcomingClientApts.length} Reservadas
              </span>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                {upcomingClientApts.length > 0 ? 'Cita Confirmada' : 'Sin Cita Proxima'}
              </div>
              <p className="text-xs text-[#86868B] mt-1 font-medium">
                {upcomingClientApts.length > 0 ? `Atención programada en studio` : 'Reserva tu espacio ideal'}
              </p>
            </div>
          </div>

          {/* Card 2: Puntos & Nivel Club */}
          <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                <Award className="size-3.5 text-[#845E1B]" />
                Puntos Emme Club
              </span>
              <span className="text-[10px] font-bold text-[#845E1B] bg-[#FAF5EC] border border-[#ECDCC2]/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Star className="size-3 fill-[#C59B4E] text-[#C59B4E]" />
                VIP Platinum
              </span>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                250 <span className="text-xs font-normal text-[#86868B]">/ 500 pts</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#C59B4E] rounded-full w-[50%]" />
              </div>
            </div>
          </div>

          {/* Card 3: Sesiones Completadas */}
          <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-primary" />
                Sesiones Realizadas
              </span>
              <span className="text-[10px] font-bold text-[#1D1D1F] bg-neutral-100 border border-black/[0.04] px-2.5 py-0.5 rounded-full">
                Frecuente
              </span>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                {completedClientApts.length} <span className="text-xs font-normal text-[#86868B]">visitas</span>
              </div>
              <p className="text-xs text-[#86868B] mt-1 font-medium">
                Garantía y cuidado en cada servicio
              </p>
            </div>
          </div>

          {/* Card 4: Retoque Recomendado */}
          <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                Retoque Sugerido
              </span>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Cada 21 días
              </span>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                Soft Gel / Rusa
              </div>
              <p className="text-xs text-[#86868B] mt-1 font-medium">
                Mantén tus uñas impecables
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Studio Tenant View Widgets */}
      {viewMode === 'studio' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="p-3 bg-neutral-100/80 rounded-2xl border border-black/[0.04] text-[11px] font-semibold text-[#1D1D1F] flex items-center gap-2">
            <Building2 className="size-4 text-primary shrink-0" />
            <span>
              <strong>Modo Administración Studio:</strong> Estas métricas muestran los objetivos financieros y rendimiento operativo global de {profile.name || 'Emme Studio'}.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Monthly Goal Progress */}
            <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                  <Target className="size-3.5 text-primary" />
                  Meta Mensual Studio
                </span>
                <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {studioMetrics.goalPercentage}%
                </span>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                  ${studioMetrics.totalRevenue.toLocaleString()} <span className="text-xs font-normal text-[#86868B]">/ ${studioMetrics.monthlyGoal.toLocaleString()} MXN</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${studioMetrics.goalPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 2: Capacity Utilization */}
            <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                  <Percent className="size-3.5 text-primary" />
                  Ocupación de Agenda
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                  Alta Demanda
                </span>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                  {studioMetrics.capacityOccupancy}%
                </div>
                <p className="text-xs text-[#86868B] mt-1 font-medium">
                  Porcentaje de capacidad agendada
                </p>
              </div>
            </div>

            {/* Metric 3: Active & Completed Citas */}
            <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-primary" />
                  Citas de la Agenda
                </span>
                <span className="text-[10px] font-bold text-[#1D1D1F] bg-neutral-100 border border-black/[0.04] px-2.5 py-0.5 rounded-full">
                  {studioMetrics.totalAppointments} Totales
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#FBFBFD] p-2.5 rounded-xl border border-black/[0.03]">
                  <span className="text-[10px] text-[#86868B] font-bold block">Confirmadas</span>
                  <span className="text-lg font-display font-bold text-[#1D1D1F]">{studioMetrics.confirmedCount + studioMetrics.completedCount}</span>
                </div>
                <div className="flex-1 bg-[#FBFBFD] p-2.5 rounded-xl border border-black/[0.03]">
                  <span className="text-[10px] text-[#86868B] font-bold block">Pendientes</span>
                  <span className="text-lg font-display font-bold text-[#86868B]">{studioMetrics.pendingCount}</span>
                </div>
              </div>
            </div>

            {/* Metric 4: Ticket Promedio */}
            <div className="bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-primary" />
                  Ticket Promedio Studio
                </span>
                <span className="text-[10px] font-bold text-[#1D1D1F] bg-neutral-100 border border-black/[0.04] px-2.5 py-0.5 rounded-full">
                  Por Cita
                </span>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-[#1D1D1F]">
                  ${studioMetrics.avgTicket} MXN
                </div>
                <p className="text-xs text-[#86868B] mt-1 font-medium">
                  Valor medio por servicio realizado
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

