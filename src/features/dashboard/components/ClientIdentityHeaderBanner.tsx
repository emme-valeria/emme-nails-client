import React, { useState } from 'react';
import { useApp, type Client } from '@/app/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  X,
  LogOut,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

export function ClientIdentityHeaderBanner() {
  const { currentClient, clients, setActiveClientId, linkEmailToCurrentClient, logout } = useApp();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(currentClient?.email || '');

  const hasEmail = Boolean(currentClient?.email);
  const hasPhone = Boolean(currentClient?.phone);

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }
    linkEmailToCurrentClient(emailInput);
    setIsEmailModalOpen(false);
  };

  const handleSelectClient = (clientId: string) => {
    setActiveClientId(clientId);
    setIsSwitchUserModalOpen(false);
    toast.success('Cuenta cambiada con éxito');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full liquid-glass rounded-[24px] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
      >
        {/* Left Side: Identifiers */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
            <User className="size-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#1D1D1F] truncate">
                {currentClient?.name || 'Cliente'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="size-3 text-emerald-600" />
                Identidad Activa
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#86868B] flex-wrap">
              {hasPhone ? (
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3 text-emerald-600 shrink-0" />
                  <strong className="text-[#1D1D1F] font-mono">{currentClient?.phone}</strong>
                </span>
              ) : (
                <span className="text-amber-600 font-semibold">Sin WhatsApp</span>
              )}

              <span className="size-1 rounded-full bg-black/20" />

              {hasEmail ? (
                <span className="flex items-center gap-1 text-[#1D1D1F]">
                  <Mail className="size-3 text-blue-600 shrink-0" />
                  <span className="truncate max-w-[160px] sm:max-w-[220px]">{currentClient?.email}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="flex items-center gap-1 text-primary font-bold hover:underline cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>Vincular Correo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {!hasEmail && (
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className="h-8 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-[#1D1D1F] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="size-3.5" />
              <span>Vincular Email</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSwitchUserModalOpen(true)}
            className="h-8 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-[#1D1D1F] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Users className="size-3.5 text-[#86868B]" />
            <span>Cambiar</span>
          </button>
        </div>
      </motion.div>

      {/* MODAL 1: Vincular Correo Electrónico */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/10 text-left space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-neutral-100 text-[#1D1D1F] flex items-center justify-center font-bold">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-[#1D1D1F]">
                      Vincular Correo Electrónico
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      Recibe confirmaciones, recibos y avisos de agenda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#86868B] cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEmail} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">
                    Tu correo electrónico:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#FBFBFD] border border-black/10 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-[11px] text-[#86868B] mt-1.5">
                    No enviamos spam. Solo tu pase de cita, comprobante de pago y recordatorios automáticos.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="flex-1 h-11 rounded-xl font-bold text-xs text-[#86868B] hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] h-11 rounded-xl bg-primary hover:brightness-105 active:scale-98 text-white font-bold text-xs shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Guardar y Vincular</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Cambiar Perfil / Switch User */}
      <AnimatePresence>
        {isSwitchUserModalOpen && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/10 text-left space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-display font-bold text-[#1D1D1F]">
                    Cambiar Perfil de Cliente
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    Selecciona una cuenta registrada o inicia sesión
                  </p>
                </div>
                <button
                  onClick={() => setIsSwitchUserModalOpen(false)}
                  className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#86868B] cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 pr-1 flex-1 divide-y divide-black/[0.04]">
                {clients.map((c) => {
                  const isSelected = c.id === currentClient?.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectClient(c.id)}
                      className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-neutral-50 border border-transparent'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#1D1D1F]">{c.name}</p>
                          {c.isVip && (
                            <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-200">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#86868B] font-mono">{c.phone}</p>
                        {c.email && <p className="text-[10.5px] text-[#86868B]">{c.email}</p>}
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                      ) : (
                        <ArrowRight className="size-4 text-[#86868B] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-black/[0.05] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitchUserModalOpen(false);
                    logout();
                  }}
                  className="w-full h-10 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="size-3.5" />
                  <span>Cerrar Sesión / Nuevo Registro</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
