import React, { useState } from 'react';
import { DirectBookingWizard } from '@/features/direct-booking/ui/DirectBookingWizard';
import { CustomQuoteWizard } from '@/features/quote-request/ui/CustomQuoteWizard';
import { InspirationExplorerWidget } from '@/features/assisted-design/ui/InspirationExplorerWidget';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export type EntryPointPath = 'hub' | 'direct-booking' | 'structured-quote' | 'inspiration';

export function BookingHubEntryPoint() {
  const [activePath, setActivePath] = useState<EntryPointPath>('hub');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Shared Entry Point Top Navigation */}
      <div className="flex p-1 rounded-2xl bg-secondary/80 border border-border/60 text-xs font-black shadow-xs">
        <button
          type="button"
          onClick={() => setActivePath('direct-booking')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activePath === 'direct-booking'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="size-3.5" />
          <span>Reserva Directa</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePath('structured-quote')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activePath === 'structured-quote'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="size-3.5" />
          <span>Cotizar Diseño</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePath('inspiration')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activePath === 'inspiration'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="size-3.5 text-amber-300" />
          <span>Inspiración & IA</span>
        </button>
      </div>

      {/* Main Hub Landing */}
      {activePath === 'hub' && (
        <Card className="p-6 rounded-3xl border border-border/80 shadow-md bg-card space-y-6 text-center">
          <div className="space-y-2 max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
              Bienvenida a Emme Studio
            </span>
            <h2 className="text-xl font-black text-foreground">¿Qué te gustaría realizar hoy?</h2>
            <p className="text-xs text-muted-foreground">
              Elige el camino que mejor se adapte a lo que necesitas para tu siguiente cita.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {/* Path 1: Direct Booking */}
            <div
              onClick={() => setActivePath('direct-booking')}
              className="p-4 rounded-3xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-foreground">Reserva Directa</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Para Gel, Acrílico o French estándar. Precio cerrado e historial inmediato.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Confirmación Inmediata
              </span>
            </div>

            {/* Path 2: Custom Quote */}
            <div
              onClick={() => setActivePath('structured-quote')}
              className="p-4 rounded-3xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-foreground">Cotizar Diseño Exclusivo</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Para arte en 3D, mano alzada o fotos personalizadas de Pinterest/Instagram.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-primary flex items-center gap-1">
                <Sparkles className="size-3" />
                Motor Determinista + IA
              </span>
            </div>

            {/* Path 3: Inspiration & AI */}
            <div
              onClick={() => setActivePath('inspiration')}
              className="p-4 rounded-3xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-foreground">Inspiración & IA</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Explora las tendencias 2026 de Guadalajara o sube una foto para recibir sugerencias.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 flex items-center gap-1">
                <Sparkles className="size-3" />
                Asistente Opcional
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Path 1: Direct Booking Wizard */}
      {activePath === 'direct-booking' && (
        <DirectBookingWizard onSwitchToCustomQuote={() => setActivePath('structured-quote')} />
      )}

      {/* Path 2: Structured Custom Quote Wizard */}
      {activePath === 'structured-quote' && (
        <CustomQuoteWizard onSwitchToDirectBooking={() => setActivePath('direct-booking')} />
      )}

      {/* Path 3: Inspiration Explorer */}
      {activePath === 'inspiration' && (
        <InspirationExplorerWidget
          onStartDirectBooking={() => setActivePath('direct-booking')}
          onStartCustomQuote={() => setActivePath('structured-quote')}
        />
      )}
    </div>
  );
}
