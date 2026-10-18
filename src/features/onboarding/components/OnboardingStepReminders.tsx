import React from 'react';
import { motion } from 'motion/react';
import { Bell, Calendar, MessageCircle, Smartphone, Download, Check, ShieldCheck, Share, PlusSquare } from 'lucide-react';
import { Switch } from '@emme/ui/switch';

interface OnboardingStepRemindersProps {
  googleSync: boolean;
  whatsappReminders: boolean;
  onToggleGoogleSync: (val: boolean) => void;
  onToggleWhatsapp: (val: boolean) => void;
}

export function OnboardingStepReminders({
  googleSync,
  whatsappReminders,
  onToggleGoogleSync,
  onToggleWhatsapp
}: OnboardingStepRemindersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 lg:space-y-7"
    >
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block">
          Paso 4 de 5 • Conexión & Recordatorios
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-foreground">
          Nunca pierdas una cita importante
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Activa recordatorios inteligentes para recibir avisos oportunos y sincronizar tus citas con tu calendario personal.
        </p>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        {/* WhatsApp Reminders */}
        <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border/80 flex items-center justify-between gap-4 shadow-xs hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="size-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-foreground">Avisos por WhatsApp</h4>
                <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Recomendado</span>
              </div>
              <p className="text-xs text-muted-foreground">Recordatorio de cortesía 24h y 2h antes con enlace de navegación GPS.</p>
            </div>
          </div>
          <Switch checked={whatsappReminders} onCheckedChange={onToggleWhatsapp} />
        </div>

        {/* Google Calendar Sync */}
        <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border/80 flex items-center justify-between gap-4 shadow-xs hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="size-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-foreground">Sincronizar con Google Calendar</h4>
                <span className="text-[9px] font-black bg-blue-500/15 text-blue-700 px-2 py-0.5 rounded-full uppercase">1 Clic</span>
              </div>
              <p className="text-xs text-muted-foreground">Crea automáticamente el evento en tu calendario con dirección y notas.</p>
            </div>
          </div>
          <Switch checked={googleSync} onCheckedChange={onToggleGoogleSync} />
        </div>
      </div>

      {/* PWA App Installation Guide Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/[0.08] via-secondary/40 to-card border border-primary/20 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
            <Smartphone className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-foreground">Instala EMME como App en tu Pantalla de Inicio</h4>
            <p className="text-[11px] text-muted-foreground">Disfruta de apertura a pantalla completa sin barras de navegador</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
          {/* iOS Safari tip */}
          <div className="p-3 rounded-2xl bg-card border border-border/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Share className="size-3.5 text-primary" />
              <span>En iPhone (Safari):</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Toca el botón <strong>Compartir</strong> y selecciona <strong>"Agregar al Inicio" <PlusSquare className="inline size-3 text-foreground" /></strong>.
            </p>
          </div>

          {/* Android Chrome tip */}
          <div className="p-3 rounded-2xl bg-card border border-border/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Download className="size-3.5 text-primary" />
              <span>En Android (Chrome):</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Toca los <strong>tres puntos (⋮)</strong> y pulsa <strong>"Instalar aplicación"</strong>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
