import React, { useState } from 'react';
import { Button } from '@emme/ui/button';
import { RefreshCw, LogOut, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cacheService } from '@emme/infrastructure/cacheService';
import { cn } from '@emme/ui/lib/utils';
import { useApp } from '@/app/AppContext';

interface SystemUtilitiesCardProps {
  onLogout: () => void;
}

export function SystemUtilitiesCard({ onLogout }: SystemUtilitiesCardProps) {
  const { startTour } = useApp();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      cacheService.clear();
      setIsClearing(false);
      toast.success('Caché de la aplicación liberada');
      setTimeout(() => window.location.reload(), 1000);
    }, 800);
  };

  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 sm:p-7 shadow-xs space-y-4">
      <h4 className="font-display font-bold text-base text-[#1D1D1F]">Herramientas de la Aplicación</h4>

      <div className="space-y-3">
        <Button
          onClick={() => {
            startTour();
            toast.info('Iniciando Tour Guiado de Bienvenida');
          }}
          variant="outline"
          className="w-full h-11 rounded-2xl border-black/10 font-bold text-xs flex items-center justify-between hover:bg-neutral-50 active:scale-95 transition-all text-primary"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>Ver Tour Guiado de Nuevo</span>
          </div>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">4 Pasos</span>
        </Button>

        <Button
          onClick={handleClearCache}
          disabled={isClearing}
          variant="outline"
          className="w-full h-11 rounded-2xl border-black/10 font-bold text-xs flex items-center justify-between hover:bg-neutral-50 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className={cn("size-4 text-primary", isClearing && "animate-spin")} />
            <span>Liberar Caché Local</span>
          </div>
          <span className="text-[10px] text-[#86868B]">Optimizar</span>
        </Button>

        <Button
          onClick={() => {
            onLogout();
            toast.success('Sesión cerrada correctamente');
          }}
          className="w-full h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50 font-bold text-xs flex items-center justify-between active:scale-95 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <LogOut className="size-4 text-rose-600" />
            <span>Cerrar Sesión</span>
          </div>
          <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider bg-rose-200/40 px-2 py-0.5 rounded-full">
            Salir
          </span>
        </Button>
      </div>
    </div>
  );
}
