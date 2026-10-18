import React, { useState } from 'react';
import { ARTISTS, AVAILABLE_SLOTS } from '@/domains/availability/availability';
import { User, Calendar, Clock, Check } from 'lucide-react';
import { AvailabilityStepTabs, AvailabilitySubStep } from '@/shared/components/AvailabilityStepTabs';

interface AppointmentSlotSelectorProps {
  selectedArtistId: string;
  selectedDate: string; // ISO format e.g. YYYY-MM-DD
  selectedSlot: string;
  onSelectArtist: (artistId: string) => void;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
}

export function AppointmentSlotSelector({
  selectedArtistId,
  selectedDate,
  selectedSlot,
  onSelectArtist,
  onSelectDate,
  onSelectSlot
}: AppointmentSlotSelectorProps) {
  const [subStep, setSubStep] = useState<AvailabilitySubStep>('staff');

  const selectedArtist = ARTISTS.find(a => a.id === selectedArtistId);

  // Generate next 7 available dates
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-MX', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('es-MX', { month: 'short' });
    return { iso, dayName, dayNum, monthName };
  });

  return (
    <div className="space-y-4">
      {/* Reusable Segmented Capsule Sub-Step Bar */}
      <AvailabilityStepTabs
        activeSubStep={subStep}
        onChange={setSubStep}
        staffName={selectedArtist?.name}
        dateLabel={selectedDate}
        timeSlot={selectedSlot}
        hasStaffSelected={Boolean(selectedArtistId)}
        hasDateSelected={Boolean(selectedDate)}
        hasTimeSelected={Boolean(selectedSlot)}
      />

      {/* Substep 1: Artist Selection */}
      {subStep === 'staff' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
            <User className="size-3.5 text-primary" /> Selecciona Manicurista / Especialista
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ARTISTS.map((artist) => {
              const isSelected = selectedArtistId === artist.id;

              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => {
                    onSelectArtist(artist.id);
                    setSubStep('date');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-xs ring-2 ring-primary/20'
                      : 'bg-card border-border/70 hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-foreground">{artist.name}</span>
                    {isSelected && <Check className="size-3.5 text-primary stroke-[3]" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{artist.specialty}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Substep 2: Date Picker Horizontal Slider */}
      {subStep === 'date' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" /> Selecciona Fecha Preferida
          </label>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {dates.map((d) => {
              const isSelected = selectedDate === d.iso;

              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => {
                    onSelectDate(d.iso);
                    setSubStep('time');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer shrink-0 min-w-[76px] ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-card border-border/70 hover:bg-secondary/40 text-foreground'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block opacity-80">
                    {d.dayName}
                  </span>
                  <span className="text-lg font-black block leading-none my-1">
                    {d.dayNum}
                  </span>
                  <span className="text-[10px] uppercase font-bold block opacity-80">
                    {d.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Substep 3: Available Time Slots */}
      {subStep === 'time' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" /> Horarios Disponibles
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AVAILABLE_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`p-3 rounded-2xl border text-center font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/30'
                      : 'bg-card border-border/70 hover:bg-secondary/40 text-foreground'
                  }`}
                >
                  <span>{slot}</span>
                  {isSelected && <Check className="size-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
