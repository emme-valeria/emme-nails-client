import React, { useState } from 'react';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { Label } from '@emme/ui/label';
import { User, Star, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ClientAccountCardProps {
  currentClient: {
    id: string;
    name: string;
    phone: string;
    isVip?: boolean;
  };
}

export function ClientAccountCard({ currentClient }: ClientAccountCardProps) {
  const [clientData, setClientData] = useState({
    name: currentClient.name,
    phone: currentClient.phone,
    email: 'valeria.arriaza@gmail.com',
    preferredStyle: 'Soft Gel Almendrado con Foil Dorado',
  });

  const handleSaveClientProfile = () => {
    toast.success('Perfil de clienta actualizado correctamente', {
      icon: <CheckCircle2 className="size-4 text-emerald-500" />
    });
  };

  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User className="size-6" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-[#1D1D1F]">Información de la Clienta</h3>
            <p className="text-xs text-[#86868B]">Tus datos registrados para atención en el estudio</p>
          </div>
        </div>

        {currentClient.isVip && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-800 text-xs font-black uppercase tracking-wider">
            <Star className="size-3.5 fill-amber-500 text-amber-500" />
            VIP Platinum
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">Nombre Completo</Label>
            <Input 
              value={clientData.name}
              onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
              className="h-12 rounded-2xl bg-[#FBFBFD] border-black/5 text-sm font-semibold focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">Teléfono WhatsApp</Label>
            <Input 
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={clientData.phone}
              onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              className="h-12 rounded-2xl bg-[#FBFBFD] border-black/5 text-sm font-semibold focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">Correo Electrónico</Label>
            <Input 
              value={clientData.email}
              onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              className="h-12 rounded-2xl bg-[#FBFBFD] border-black/5 text-sm font-semibold focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">Estilo & Forma Preferida</Label>
            <Input 
              value={clientData.preferredStyle}
              onChange={(e) => setClientData({ ...clientData, preferredStyle: e.target.value })}
              className="h-12 rounded-2xl bg-[#FBFBFD] border-black/5 text-sm font-semibold focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSaveClientProfile}
          className="h-11 px-6 rounded-2xl bg-primary hover:bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>Guardar Cambios de Perfil</span>
        </Button>
      </div>
    </div>
  );
}
