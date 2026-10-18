import React, { useState } from 'react';
import { Switch } from '@emme/ui/switch';
import { Bell } from 'lucide-react';

export function NotificationPreferencesCard() {
  const [preferences, setPreferences] = useState({
    whatsappReminders: true,
    emailReceipts: true,
    promoAlerts: true,
  });

  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-3.5">
        <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
          <Bell className="size-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-[#1D1D1F]">Notificaciones & Recordatorios</h3>
          <p className="text-xs text-[#86868B]">Configura cómo deseas recibir tus avisos de cita y promociones</p>
        </div>
      </div>

      <div className="space-y-4 divide-y divide-black/[0.04]">
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-sm text-[#1D1D1F] block">Recordatorios por WhatsApp</span>
            <span className="text-xs text-[#86868B]">Recibe confirmación y aviso 24 hrs antes de tu cita</span>
          </div>
          <Switch
            checked={preferences.whatsappReminders}
            onCheckedChange={(c) => setPreferences({ ...preferences, whatsappReminders: c })}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-sm text-[#1D1D1F] block">Comprobantes Digitales</span>
            <span className="text-xs text-[#86868B]">Envío automático del ticket al finalizar cada servicio</span>
          </div>
          <Switch
            checked={preferences.emailReceipts}
            onCheckedChange={(c) => setPreferences({ ...preferences, emailReceipts: c })}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-sm text-[#1D1D1F] block">Promociones Exclusivas VIP</span>
            <span className="text-xs text-[#86868B]">Avisos de descuentos de temporada y lanzamientos de colección</span>
          </div>
          <Switch
            checked={preferences.promoAlerts}
            onCheckedChange={(c) => setPreferences({ ...preferences, promoAlerts: c })}
          />
        </div>
      </div>
    </div>
  );
}
