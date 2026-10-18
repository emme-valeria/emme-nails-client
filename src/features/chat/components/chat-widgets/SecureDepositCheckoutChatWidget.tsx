import React, { useState } from 'react';
import { useApp } from '@/app/AppContext';
import { useChatStore } from '../../state/useChatStore';
import { SalonPaymentCheckoutWidget, PaymentReceipt } from '@/shared/components/SalonPaymentCheckoutWidget';
import { format } from 'date-fns';
import { CheckCircle2, QrCode, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export interface DepositCheckoutData {
  serviceId: string;
  serviceName: string;
  staffName: string;
  dateStr: string;
  timeStr: string;
  totalPrice: number;
  depositAmount: number;
}

interface SecureDepositCheckoutChatWidgetProps {
  checkoutData?: Partial<DepositCheckoutData>;
  onPaymentSuccess: (receipt: {
    bookingRef: string;
    serviceName: string;
    staffName: string;
    depositPaid: number;
    remainingBalance: number;
    paymentMethod: string;
    dateStr: string;
    timeStr: string;
  }) => void;
}

export function SecureDepositCheckoutChatWidget({
  checkoutData,
  onPaymentSuccess
}: SecureDepositCheckoutChatWidgetProps) {
  const { clients, addAppointment } = useApp();
  const { reservation, confirmPayment } = useChatStore();
  const currentClient = clients[0] || { id: 'c1', name: 'Valeria Arriaza' };

  const serviceName = checkoutData?.serviceName || reservation.serviceName || 'Manicura Rusa + Esmaltado Semi-permanente';
  const staffName = checkoutData?.staffName || reservation.staffName || 'Valeria Arriaza';
  const dateStr = checkoutData?.dateStr || reservation.dateStr || format(new Date(), 'yyyy-MM-dd');
  const timeStr = checkoutData?.timeStr || reservation.timeStr || '11:30';
  const totalPrice = checkoutData?.totalPrice || reservation.totalPrice || 550;
  const depositAmount = checkoutData?.depositAmount || reservation.depositAmount || 150;

  const [receiptData, setReceiptData] = useState<PaymentReceipt | null>(null);

  const handlePaymentCompleted = (receipt: PaymentReceipt) => {
    setReceiptData(receipt);

    const apptId = `apt-${Date.now()}`;
    addAppointment({
      clientId: currentClient.id,
      serviceId: checkoutData?.serviceId || reservation.serviceId || 's1',
      date: receipt.dateStr || dateStr,
      startTime: receipt.timeStr || timeStr,
      endTime: reservation.endTimeStr || '12:30',
      status: 'confirmed',
      notes: `Pago Depósito Seguro: $${receipt.amountPaid} MXN (${receipt.methodLabel} - Ref: ${receipt.paymentId}). Saldo pendiente: $${receipt.remainingBalance} MXN.`
    });

    confirmPayment(receipt.method as any, receipt.paymentId, apptId);

    onPaymentSuccess({
      bookingRef: receipt.paymentId,
      serviceName,
      staffName,
      depositPaid: receipt.amountPaid,
      remainingBalance: receipt.remainingBalance,
      paymentMethod: receipt.methodLabel,
      dateStr: receipt.dateStr,
      timeStr: receipt.timeStr
    });
  };

  if (receiptData) {
    return (
      <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-2xs text-left w-full max-w-md my-2 p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center gap-2.5 text-emerald-600">
          <CheckCircle2 className="size-5 shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">¡Pago de Anticipo Confirmado!</h4>
            <p className="text-[11px] text-[#86868B]">Cód: {receiptData.authCode}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FBFBFD] border border-black/[0.05] space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#86868B]">Tratamiento:</span>
            <span className="font-bold text-[#1D1D1F]">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#86868B]">Especialista:</span>
            <span className="font-semibold text-[#1D1D1F]">{staffName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#86868B]">Fecha & Turno:</span>
            <span className="font-semibold text-[#1D1D1F]">{receiptData.dateStr} · {receiptData.timeStr}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-black/[0.04] font-bold text-emerald-700">
            <span>Anticipo Pagado:</span>
            <span>${receiptData.amountPaid} MXN</span>
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-[#86868B]">
            <span>Saldo en Salón:</span>
            <span>${receiptData.remainingBalance} MXN</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={`https://wa.me/?text=Hola!%20Acabo%20de%20pagar%20mi%20anticipo%20para%20${serviceName}%20el%20${dateStr}%20con%20${staffName}.%20Ref:%20${receiptData.authCode}`}
            target="_blank"
            rel="noreferrer"
            className="h-9 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <MessageSquare className="size-3.5" />
            <span>WhatsApp Salón</span>
          </a>
          <button
            type="button"
            onClick={() => toast.success('Invitación guardada en tu calendario')}
            className="h-9 px-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Calendar className="size-3.5" />
            <span>Calendario</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md my-2 animate-in fade-in duration-200">
      <SalonPaymentCheckoutWidget
        serviceTitle={serviceName}
        totalAmount={totalPrice}
        depositAmount={depositAmount}
        dateStr={dateStr}
        timeStr={timeStr}
        staffName={staffName}
        clientName={currentClient.name}
        onPaymentComplete={handlePaymentCompleted}
      />
    </div>
  );
}
