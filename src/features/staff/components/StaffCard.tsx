import React from 'react';
import { Star, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { StaffMember } from '../domain/types/staff.types';
import { Button } from '@emme/ui';
import { cn } from '@emme/ui/lib/utils';

export interface StaffCardProps {
  key?: React.Key;
  staff: StaffMember;
  onSelect?: (staff: StaffMember) => void;
  isSelected?: boolean;
  compact?: boolean;
}

export function StaffCard({ staff, onSelect, isSelected, compact = false }: StaffCardProps) {
  if (compact) {
    return (
      <div 
        onClick={() => onSelect?.(staff)}
        className={cn(
          "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3",
          isSelected 
            ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/30" 
            : "bg-white border-black/[0.05] hover:border-black/15"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={staff.avatar} 
              alt={staff.name} 
              className="size-11 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
            {staff.isAvailableToday && (
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-display font-bold text-sm text-[#1D1D1F]">{staff.name}</h4>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Star className="size-2.5 fill-amber-400 text-amber-400" />
                {staff.rating}
              </span>
            </div>
            <p className="text-xs text-[#86868B] font-medium line-clamp-1">{staff.role}</p>
          </div>
        </div>
        {staff.extraFee ? (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0">
            +${staff.extraFee} Master
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white border border-black/[0.04] rounded-[24px] p-5 shadow-xs hover:border-black/15 transition-all flex flex-col justify-between space-y-4",
      isSelected && "ring-2 ring-primary border-primary bg-primary/[0.02]"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img 
              src={staff.avatar} 
              alt={staff.name} 
              className="size-14 rounded-2xl object-cover shadow-2xs border border-black/[0.04]"
              referrerPolicy="no-referrer"
            />
            {staff.isAvailableToday && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white">
                Hoy
              </span>
            )}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-base text-[#1D1D1F]">{staff.name}</h4>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {staff.rating}
              </span>
            </div>
            <p className="text-xs font-semibold text-primary">{staff.role}</p>
            <p className="text-[11px] text-[#86868B]">{staff.completedAppointments} citas realizadas</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#86868B] font-medium line-clamp-2 leading-relaxed">
        {staff.bio}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {staff.specialties.map((spec, i) => (
          <span key={i} className="text-[10px] font-bold text-[#1D1D1F] bg-[#FBFBFD] border border-black/[0.04] px-2.5 py-1 rounded-xl">
            {spec}
          </span>
        ))}
      </div>

      {onSelect && (
        <Button
          onClick={() => onSelect(staff)}
          className={cn(
            "w-full h-10 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 mt-2",
            isSelected 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-neutral-900 hover:bg-neutral-800 text-white"
          )}
        >
          {isSelected ? (
            <>
              <CheckCircle2 className="size-4" />
              <span>Especialista Seleccionada</span>
            </>
          ) : (
            <>
              <Calendar className="size-4" />
              <span>Agendar con {staff.name.split(' ')[0]}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
