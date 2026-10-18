import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@emme/ui/button';
import { Calendar, Sparkles, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientWelcomeHeaderProps {
  clientName: string;
  isVip?: boolean;
  salonName?: string;
  todayDate?: Date;
}

export function ClientWelcomeHeader({
  clientName,
  isVip,
  salonName = 'Emme Studio',
  todayDate = new Date(),
}: ClientWelcomeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 sm:py-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {format(todayDate, "EEEE d 'de' MMMM", { locale: es })}
          </span>
          {isVip && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              <Star className="size-3 fill-amber-500 text-amber-500" />
              VIP
            </span>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
          <span>¡Hola, {clientName.split(' ')[0]}!</span>
          <Sparkles className="size-5 sm:size-6 text-primary shrink-0" />
        </h2>
        <p className="text-[#86868B] text-xs sm:text-sm font-medium">
          Bienvenida a tu espacio en <span className="text-[#1D1D1F] font-semibold">{salonName}</span>.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
        <Button
          type="button"
          onClick={() => navigate('/booking')}
          className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-[0_4px_14px_rgba(224,82,134,0.3)] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="size-4 stroke-[2.4]" />
          <span>Agendar Cita</span>
        </Button>
      </div>
    </div>
  );
}
