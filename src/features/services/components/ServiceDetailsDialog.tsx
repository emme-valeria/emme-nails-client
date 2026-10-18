import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@emme/ui/dialog';
import { Button } from '@emme/ui/button';
import { Calendar, Clock, X } from 'lucide-react';
import type { Service } from '@/app/AppContext';

interface ServiceDetailsDialogProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceDetailsDialog({ service, onClose }: ServiceDetailsDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={!!service} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl outline-none w-full max-h-[88vh] flex flex-col">
        {service && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="p-5 flex items-start justify-between border-b border-black/[0.05]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {service.category}
                </span>
                <h2 className="text-lg sm:text-xl font-display font-bold text-[#1D1D1F]">
                  {service.name}
                </h2>
              </div>

              <button 
                onClick={onClose}
                className="size-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content Flush Details */}
            <div className="p-5 space-y-4 text-xs">
              <div className="divide-y divide-black/[0.05] border-y border-black/[0.05]">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[#86868B] flex items-center gap-1.5"><Clock className="size-3.5 text-primary" /> Duración:</span>
                  <span className="font-semibold text-[#1D1D1F]">{service.duration} Minutos</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[#86868B]">Inversión:</span>
                  <span className="font-bold text-base text-primary">${service.price} MXN</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                  Descripción:
                </span>
                <p className="text-[#1D1D1F] leading-relaxed font-normal">
                  {service.description || "Tratamiento profesional meticuloso con acabados garantizados por Emme Studio."}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-black/[0.05] bg-[#FBFBFD] flex items-center gap-2">
              <Button 
                onClick={() => {
                  const srvId = service.id;
                  onClose();
                  navigate(`/agenda?add=true&serviceId=${srvId}`);
                }}
                className="flex-1 h-10 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="size-3.5" />
                <span>Agendar Tratamiento</span>
              </Button>
              <Button 
                variant="outline"
                onClick={onClose}
                className="h-10 rounded-xl text-xs font-semibold px-3 cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
