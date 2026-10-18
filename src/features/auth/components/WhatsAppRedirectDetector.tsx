import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, CheckCircle2, UserCheck, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppRedirectDetector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clients, activeClientId, setActiveClientId, loginWithWhatsApp, isAuthenticated } = useApp();
  
  const [detectedData, setDetectedData] = useState<{
    phone?: string;
    name?: string;
    clientId?: string;
    action?: string;
  } | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const waPhone = searchParams.get('phone') || searchParams.get('tel') || searchParams.get('whatsapp');
    const waName = searchParams.get('name') || searchParams.get('cliente');
    const waClientId = searchParams.get('client') || searchParams.get('clientId');
    const waRef = searchParams.get('ref');
    const magicToken = searchParams.get('magic') || searchParams.get('token') || searchParams.get('magic_token');

    if (waPhone || waClientId || waRef === 'whatsapp' || magicToken) {
      let resolvedName = waName || '';
      let resolvedPhone = waPhone || '';

      if (waClientId) {
        const found = clients.find(c => c.id === waClientId);
        if (found) {
          resolvedName = found.name;
          resolvedPhone = found.phone;
        }
      } else if (waPhone) {
        const clean = waPhone.replace(/\D/g, '');
        const found = clients.find(c => c.phone.replace(/\D/g, '').includes(clean));
        if (found) {
          resolvedName = found.name;
          resolvedPhone = found.phone;
        }
      }

      setDetectedData({
        phone: resolvedPhone || '+34 600 000 000',
        name: resolvedName || 'Cliente VIP',
        clientId: waClientId || undefined,
        action: searchParams.get('action') || 'inicio'
      });
      setIsOpen(true);
    }
  }, [searchParams, clients]);

  const handleConfirmIdentity = async () => {
    if (!detectedData) return;
    try {
      if (detectedData.clientId) {
        setActiveClientId(detectedData.clientId);
      } else if (detectedData.phone) {
        await loginWithWhatsApp(detectedData.phone, detectedData.name);
      }
      toast.success(`¡Identidad confirmada como ${detectedData.name}!`);
      setIsOpen(false);

      // Clean query params so modal doesn't pop up again
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('phone');
      newParams.delete('tel');
      newParams.delete('whatsapp');
      newParams.delete('name');
      newParams.delete('cliente');
      newParams.delete('client');
      newParams.delete('clientId');
      newParams.delete('ref');
      newParams.delete('magic');
      newParams.delete('token');
      newParams.delete('magic_token');
      setSearchParams(newParams, { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('phone');
    newParams.delete('tel');
    newParams.delete('whatsapp');
    newParams.delete('name');
    newParams.delete('client');
    newParams.delete('clientId');
    newParams.delete('ref');
    newParams.delete('magic');
    newParams.delete('token');
    newParams.delete('magic_token');
    setSearchParams(newParams, { replace: true });
  };

  if (!isOpen || !detectedData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/10 text-left space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Enlace de WhatsApp
                </span>
                <h3 className="text-lg font-display font-bold text-[#1D1D1F] mt-0.5">
                  Confirmar Identidad
                </h3>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#86868B] cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body message */}
          <div className="bg-[#FBFBFD] border border-black/[0.06] rounded-2xl p-4 space-y-2">
            <p className="text-xs text-[#86868B] leading-relaxed">
              Detectamos que abriste el enlace exclusivo de <strong className="text-[#1D1D1F]">Emme Studio</strong> desde WhatsApp.
            </p>
            <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <UserCheck className="size-4 text-emerald-600" />
                  {detectedData.name}
                </p>
                <p className="text-[11px] text-[#86868B] font-mono mt-0.5">
                  {detectedData.phone}
                </p>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Cliente Verificado
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#86868B] leading-tight">
            Al confirmar, accederás de inmediato a tu agenda, historial de diseños y puntos VIP sin necesidad de contraseñas.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleConfirmIdentity}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="size-4" />
              <span>Sí, soy {detectedData.name.split(' ')[0]} (Continuar)</span>
              <ArrowRight className="size-4 ml-auto" />
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 text-xs font-bold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
              No soy yo / Usar otra cuenta
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
