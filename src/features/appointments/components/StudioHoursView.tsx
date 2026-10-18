import React from 'react';
import { Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import type { BusinessProfile } from '@/features/profile/domain';

interface StudioHoursViewProps {
  profile: BusinessProfile;
}

export function StudioHoursView({ profile }: StudioHoursViewProps) {
  const daysMap: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <Clock className="size-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-[#1D1D1F]">Horarios de Atención Studio</h3>
          <p className="text-xs text-[#86868B]">Disponibilidad general de especialistas</p>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(profile.workingHours || {}).map(([day, config]) => (
          <div 
            key={day}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#FBFBFD] border border-black/[0.02] text-xs font-semibold"
          >
            <span className="text-[#1D1D1F] capitalize">{daysMap[day] || day}</span>
            {config.active ? (
              <span className="text-primary font-bold">{config.open} - {config.close} hs</span>
            ) : (
              <span className="text-rose-500 font-extrabold uppercase text-[10px]">Cerrado</span>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-black/[0.04] space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#86868B] block">Ubicación del Estudio</span>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address || 'Av. Insurgentes Sur 142, CDMX')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-black/[0.03] transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <MapPin className="size-4 text-primary shrink-0" />
            <span className="text-xs font-bold text-[#1D1D1F] truncate group-hover:underline">
              {profile.address || 'Av. Insurgentes Sur 142, CDMX'}
            </span>
          </div>
          <ExternalLink className="size-3.5 text-primary opacity-60 group-hover:opacity-100 shrink-0" />
        </a>
      </div>
    </div>
  );
}
