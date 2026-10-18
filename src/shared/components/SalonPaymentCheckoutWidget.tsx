import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, ShieldCheck, Check, Smartphone, 
  Building2, Store, Lock, Copy, CheckCircle2, 
  Clock, ArrowRight, Sparkles, QrCode, AlertCircle, 
  Tag, Heart, Zap, ChevronDown, ChevronUp, Eye, EyeOff, 
  Wallet, BadgeCheck, CircleDollarSign
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';

import { 
  triggerHaptic, 
  triggerStepVibration, 
  triggerSelectionVibration, 
  triggerSuccessVibration, 
  triggerConfirmedVibration 
} from '@/shared/utils/haptics';

export const triggerHapticFeedback = (pattern: number | number[] = [20, 35, 20]) => {
  triggerHaptic(pattern);
};

export interface PaymentReceipt {
  paymentId: string;
  authCode: string;
  method: 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'mercado_pago' | 'spei' | 'oxxo';
  methodLabel: string;
  amountPaid: number;
  remainingBalance: number;
  totalServicePrice: number;
  isDepositOnly: boolean;
  tipAmount: number;
  discountAmount: number;
  promoCodeApplied?: string;
  dateStr: string;
  timeStr: string;
  serviceTitle: string;
  staffName: string;
  clientName?: string;
  paidAt: string;
}

export interface SalonPaymentCheckoutWidgetProps {
  serviceTitle?: string;
  totalAmount?: number;
  depositAmount?: number;
  dateStr?: string;
  timeStr?: string;
  staffName?: string;
  clientName?: string;
  onPaymentComplete: (receipt: PaymentReceipt) => void;
  onCancel?: () => void;
  className?: string;
}

export function SalonPaymentCheckoutWidget({
  serviceTitle = 'Set de Uñas Esculpidas Custom',
  totalAmount = 650,
  depositAmount = 150,
  dateStr = '2026-08-20',
  timeStr = '11:00 AM',
  staffName = 'Diana Manicurista',
  clientName = 'Valeria Arriaza',
  onPaymentComplete,
  onCancel,
  className
}: SalonPaymentCheckoutWidgetProps) {
  // Payment Type: Deposit vs Full
  const [paymentPlan, setPaymentPlan] = useState<'deposit' | 'full'>('deposit');
  
  // Method selection: default is card
  const [method, setMethod] = useState<'card' | 'apple_pay' | 'paypal' | 'mercado_pago' | 'spei' | 'oxxo'>('card');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('4532 8920 1142 8829');
  const [cardHolder, setCardHolder] = useState(clientName ? clientName.toUpperCase() : 'VALERIA ARRIAZA');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('732');
  const [showCvv, setShowCvv] = useState(false);

  // Accordion Disclosures for Secondary items (Tip, Promo, Detailed Breakdown)
  const [showTipPromo, setShowTipPromo] = useState(false);

  // Tipping Engine
  const [selectedTip, setSelectedTip] = useState<number>(0);

  // Promo Code Engine
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountMXN: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // SPEI / OXXO Timer
  const [timeLeft, setTimeLeft] = useState(899);
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [copiedOxxo, setCopiedOxxo] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Card Brand Detection
  const cleanCardNumber = cardNumber.replace(/\s+/g, '');
  const cardBrand = cleanCardNumber.startsWith('4')
    ? 'VISA'
    : cleanCardNumber.startsWith('5')
    ? 'MASTERCARD'
    : cleanCardNumber.startsWith('3')
    ? 'AMEX'
    : 'CARD';

  // Discount for full payment: 5% off
  const fullPaymentDiscount = Math.round(totalAmount * 0.05);
  const baseServiceCharge = paymentPlan === 'deposit' ? depositAmount : (totalAmount - fullPaymentDiscount);
  
  // Apply Promo discount
  const discountMXN = appliedPromo ? appliedPromo.discountMXN : 0;
  const tipMXN = selectedTip;

  const currentPayAmount = Math.max(0, baseServiceCharge + tipMXN - discountMXN);
  const remainingInSalon = paymentPlan === 'deposit' ? Math.max(0, totalAmount - depositAmount) : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, type: 'clabe' | 'oxxo') => {
    triggerHapticFeedback(20);
    navigator.clipboard?.writeText(text);
    if (type === 'clabe') {
      setCopiedClabe(true);
      setTimeout(() => setCopiedClabe(false), 2000);
      toast.success('CLABE STP copiada al portapapeles');
    } else {
      setCopiedOxxo(true);
      setTimeout(() => setCopiedOxxo(false), 2000);
      toast.success('Referencia OXXO copiada al portapapeles');
    }
  };

  const loadDemoCard = () => {
    triggerHapticFeedback(15);
    setCardNumber('4532 8920 1142 8829');
    setCardHolder('VALERIA ARRIAZA');
    setCardExpiry('08/28');
    setCardCvv('732');
    toast.success('Tarjeta de prueba cargada');
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'EMME10') {
      triggerHapticFeedback([15, 30, 15]);
      const disc = Math.round(totalAmount * 0.10);
      setAppliedPromo({ code: clean, discountMXN: disc, label: '10% de descuento' });
      toast.success(`¡Cupón EMME10 aplicado! -$${disc} MXN`);
    } else if (clean === 'PRIMERAVISITA' || clean === 'BEAUTY50') {
      triggerHapticFeedback([15, 30, 15]);
      setAppliedPromo({ code: clean, discountMXN: 50, label: '$50 MXN de bienvenida' });
      toast.success('¡Cupón aplicado! -$50 MXN');
    } else {
      triggerHapticFeedback(30);
      setPromoError('Código no válido');
    }
  };

  const handleExecutePayment = (overrideMethod?: typeof method) => {
    triggerHapticFeedback([20, 40, 20]);
    const activeMethod = overrideMethod || method;
    setIsProcessing(true);
    setProcessingStep('Garantizando tu cita...');

    setTimeout(() => {
      setProcessingStep('Confirmando con ' + staffName.split(' ')[0] + '...');
    }, 700);

    setTimeout(() => {
      setIsProcessing(false);
      triggerHapticFeedback([30, 50, 30]);

      const generatedAuth = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedId = `EMME-PAY-${Date.now().toString().slice(-6)}`;
      
      const methodLabels: Record<string, string> = {
        card: `Tarjeta •••• ${cardNumber.slice(-4) || '8829'}`,
        apple_pay: 'Apple Pay / GPay',
        paypal: 'PayPal Express',
        mercado_pago: 'Mercado Pago / CoDi',
        spei: 'Transferencia SPEI',
        oxxo: 'OXXO Pay'
      };

      const receipt: PaymentReceipt = {
        paymentId: generatedId,
        authCode: generatedAuth,
        method: activeMethod as any,
        methodLabel: methodLabels[activeMethod] || 'Tarjeta',
        amountPaid: currentPayAmount,
        remainingBalance: remainingInSalon,
        totalServicePrice: totalAmount,
        isDepositOnly: paymentPlan === 'deposit',
        tipAmount: tipMXN,
        discountAmount: discountMXN,
        promoCodeApplied: appliedPromo?.code,
        dateStr,
        timeStr,
        serviceTitle,
        staffName,
        clientName: cardHolder,
        paidAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };

      toast.success('¡Cita Confirmada con Éxito!', {
        description: `Ref: ${generatedId} · Manicurista: ${staffName}`,
        icon: <CheckCircle2 className="size-5 text-emerald-500" />
      });

      onPaymentComplete(receipt);
    }, 1400);
  };

  return (
    <div className={cn("space-y-3 text-left max-w-lg mx-auto", className)}>
      
      {/* 1. Modalidad Compacta & Total Hero */}
      <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">
            Modalidad de Pago:
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            <Lock className="size-2.5 inline mr-0.5" /> Pago Seguro SSL
          </span>
        </div>

        {/* 2-Col Clean Pill Selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback(15);
              setPaymentPlan('deposit');
            }}
            className={cn(
              "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
              paymentPlan === 'deposit'
                ? "bg-primary/5 border-primary text-primary shadow-2xs ring-1 ring-primary/20"
                : "bg-neutral-50 border-black/[0.06] text-[#1D1D1F] hover:bg-neutral-100/60"
            )}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Anticipo</span>
              {paymentPlan === 'deposit' && <Check className="size-3 stroke-[2.5]" />}
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-base font-display font-bold text-[#1D1D1F] tabular-nums">${depositAmount}</span>
              <span className="text-[10px] text-[#86868B] font-medium">hoy</span>
            </div>
            <p className="text-[9.5px] text-[#86868B] font-medium truncate mt-0.5">
              Resta ${remainingInSalon} en salón
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback(15);
              setPaymentPlan('full');
            }}
            className={cn(
              "p-2.5 rounded-xl border text-left transition-all cursor-pointer relative",
              paymentPlan === 'full'
                ? "bg-primary/5 border-primary text-primary shadow-2xs ring-1 ring-primary/20"
                : "bg-neutral-50 border-black/[0.06] text-[#1D1D1F] hover:bg-neutral-100/60"
            )}
          >
            <span className="absolute -top-1.5 right-2 text-[8px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
              -5% OFF
            </span>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Pago Total</span>
              {paymentPlan === 'full' && <Check className="size-3 stroke-[2.5]" />}
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-base font-display font-bold text-emerald-600 tabular-nums">${totalAmount - fullPaymentDiscount}</span>
              <span className="text-[10px] text-[#86868B] line-through font-medium tabular-nums">${totalAmount}</span>
            </div>
            <p className="text-[9.5px] text-[#86868B] font-medium truncate mt-0.5">
              Sin pagos pendientes
            </p>
          </button>
        </div>
      </div>

      {/* 2. Fast 1-Tap Biometric (Apple / Google Pay) - High Contrast Black */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleExecutePayment('apple_pay')}
          className="h-11 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
        >
          <Smartphone className="size-4" />
          <span> Pay / G Pay (${currentPayAmount})</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleExecutePayment('paypal')}
          className="h-11 rounded-xl bg-[#003087] hover:bg-[#00256c] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
        >
          <span className="font-black italic text-sm tracking-tight text-[#0079C1] bg-white px-1.5 py-0.2 rounded">P</span>
          <span>PayPal (${currentPayAmount})</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#86868B] justify-center">
        <span className="h-px bg-black/[0.08] flex-1" />
        <span>O SELECCIONA OTRO MÉTODO</span>
        <span className="h-px bg-black/[0.08] flex-1" />
      </div>

      {/* 3. Segmented Method Tabs */}
      <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="p-1 bg-[#F5F5F7]">
          <SegmentedCapsuleTabs<'card' | 'apple_pay' | 'paypal' | 'mercado_pago' | 'spei' | 'oxxo'>
            size="sm"
            fullWidth
            value={method}
            onChange={(m) => {
              triggerHapticFeedback(10);
              setMethod(m);
            }}
            layoutId="checkoutPaymentMethodPill"
            items={[
              { id: 'card', label: 'Tarjeta', icon: CreditCard },
              { id: 'mercado_pago', label: 'M. Pago', icon: QrCode },
              { id: 'paypal', label: 'PayPal', icon: CircleDollarSign },
              { id: 'spei', label: 'SPEI', icon: Building2 },
              { id: 'oxxo', label: 'OXXO', icon: Store },
            ]}
          />
        </div>

        {/* Dynamic Content for active tab */}
        <div className="p-3.5 space-y-3">
          
          {/* TAB: CARD */}
          {method === 'card' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[#1D1D1F] flex items-center gap-1">
                  <span>Datos de Tarjeta</span>
                  <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.2 rounded-md font-black">
                    {cardBrand}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={loadDemoCard}
                  className="text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Zap className="size-3 text-amber-500" /> Autocompletar demo
                </button>
              </div>

              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="Nombre del Titular"
                className="w-full h-9 px-3 rounded-xl border border-black/[0.08] bg-neutral-50/50 text-xs font-semibold text-[#1D1D1F]"
              />

              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                  const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                  setCardNumber(formatted);
                  if (val.length === 16) triggerHapticFeedback(15);
                }}
                placeholder="4532 8920 1142 8829"
                className="w-full h-9 px-3 rounded-xl border border-black/[0.08] bg-neutral-50/50 text-xs font-mono font-semibold text-[#1D1D1F]"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                    setCardExpiry(val);
                  }}
                  placeholder="MM/AA"
                  className="w-full h-9 px-3 rounded-xl border border-black/[0.08] bg-neutral-50/50 text-xs font-mono font-semibold text-[#1D1D1F]"
                />
                <div className="relative">
                  <input
                    type={showCvv ? "text" : "password"}
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="CVV"
                    className="w-full h-9 px-3 pr-8 rounded-xl border border-black/[0.08] bg-neutral-50/50 text-xs font-mono font-semibold text-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-2.5 top-2.5 text-[#86868B]"
                  >
                    {showCvv ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYPAL */}
          {method === 'paypal' && (
            <div className="space-y-2.5 animate-in fade-in duration-150 text-center">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#003087]">
                  <CircleDollarSign className="size-4" />
                  <span>Protección al Comprador PayPal</span>
                </div>
                <p className="text-[10.5px] text-[#003087]/80">
                  Paga seguro con saldo PayPal o tus tarjetas guardadas sin compartir tus datos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExecutePayment('paypal')}
                className="w-full h-9 rounded-xl bg-[#003087] hover:bg-[#00256c] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="size-3.5 text-amber-300" />
                <span>Simular Autorización PayPal (${currentPayAmount} MXN)</span>
              </button>
            </div>
          )}

          {/* TAB: MERCADO PAGO */}
          {method === 'mercado_pago' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <QrCode className="size-4 text-sky-600" />
                  <span>Mercado Pago & CoDi QR</span>
                </div>
                <p className="text-[10.5px] text-sky-800">
                  Escanea desde tu app de Mercado Pago o banca móvil (BBVA, Santander, etc.).
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExecutePayment('mercado_pago')}
                className="w-full h-9 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <Zap className="size-3.5 text-amber-300" />
                <span>Simular Escaneo QR y Aprobación</span>
              </button>
            </div>
          )}

          {/* TAB: SPEI */}
          {method === 'spei' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/[0.05] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9.5px] text-[#86868B] block">CLABE STP (18 dígitos)</span>
                  <span className="font-mono font-bold text-xs text-[#1D1D1F]">646180112345678901</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('646180112345678901', 'clabe')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                    copiedClabe ? "bg-emerald-500 text-white" : "bg-white border border-black/[0.08] text-[#1D1D1F]"
                  )}
                >
                  {copiedClabe ? <Check className="size-3 stroke-[3]" /> : <Copy className="size-3" />}
                  <span>{copiedClabe ? 'Listo' : 'Copiar'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleExecutePayment('spei')}
                className="w-full h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="size-3.5 text-emerald-600" />
                <span>Simular Transferencia Enviada</span>
              </button>
            </div>
          )}

          {/* TAB: OXXO */}
          {method === 'oxxo' && (
            <div className="space-y-2.5 animate-in fade-in duration-150 text-center">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/[0.05]">
                <span className="text-[9.5px] text-[#86868B] block">Referencia OXXO:</span>
                <span className="font-mono font-bold text-sm text-[#1D1D1F]">9328-4019-2810-44</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard('93284019281044', 'oxxo')}
                  className="h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Copy className="size-3" />
                  <span>{copiedOxxo ? 'Copiada' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExecutePayment('oxxo')}
                  className="h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                >
                  <Zap className="size-3 text-red-600" />
                  <span>Simular Pago</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 4. Collapsible Option: Tip & Promo (Progressive Disclosure) */}
      <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs">
        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback(10);
            setShowTipPromo(!showTipPromo);
          }}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#86868B] hover:text-[#1D1D1F] cursor-pointer bg-[#FBFBFD]"
        >
          <span className="flex items-center gap-1.5 text-[#1D1D1F]">
            <Heart className="size-3.5 text-pink-500" />
            <span>¿Deseas agregar propina o cupón?</span>
          </span>
          {showTipPromo ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>

        <AnimatePresence>
          {showTipPromo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3.5 border-t border-black/[0.04] space-y-3"
            >
              {/* Tip Pills */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold text-[#1D1D1F] block">
                  Propina para {staffName.split(' ')[0]}:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 30, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        triggerHapticFeedback(15);
                        setSelectedTip(amt);
                      }}
                      className={cn(
                        "py-1.5 rounded-lg text-[10.5px] font-bold text-center transition-all cursor-pointer",
                        selectedTip === amt
                          ? "bg-primary text-white shadow-xs"
                          : "bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F]"
                      )}
                    >
                      {amt === 0 ? 'Sin propina' : `+$${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo input */}
              <div className="space-y-1 pt-1 border-t border-black/[0.04]">
                <span className="text-[10.5px] font-bold text-[#1D1D1F] block">
                  Cupón de Descuento:
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Ej: EMME10"
                    className="flex-1 h-8 px-2.5 rounded-lg border border-black/[0.08] text-xs font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="h-8 px-3 rounded-lg bg-neutral-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedPromo && (
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    ✓ {appliedPromo.code} (-${appliedPromo.discountMXN} MXN)
                  </span>
                )}
                {promoError && (
                  <span className="text-[10px] text-red-600 font-bold block">{promoError}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Main Action Guarantee Button - High Contrast Primary */}
      {method !== 'apple_pay' && method !== 'paypal' && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleExecutePayment()}
          className="w-full h-11 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>{processingStep}</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="size-4" />
              <span>
                Pagar ${currentPayAmount} MXN · Confirmar Cita
              </span>
            </>
          )}
        </button>
      )}

      {/* Reassurance Policy */}
      <p className="text-[10px] text-[#86868B] text-center">
        Garantía EMME: Reagenda o cancela gratis avisando con 24h de anticipación.
      </p>

      {onCancel && (
        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback(10);
            onCancel();
          }}
          className="w-full py-1 text-center text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          ← Volver al paso anterior
        </button>
      )}
    </div>
  );
}
