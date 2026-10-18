import React from 'react';
import { DirectBookingProvider, useDirectBooking } from '../model/booking-context';
import { ServiceSelector } from '@/shared/components/ServiceSelector';
import { NailShapeSelector } from '@/shared/components/NailShapeSelector';
import { NailLengthSelector } from '@/shared/components/NailLengthSelector';
import { AddOnSelector, AVAILABLE_ADDONS } from '@/shared/components/AddOnSelector';
import { AvailabilitySelector, SALON_STAFF } from '@/shared/components/AvailabilitySelector';
import { PriceBreakdown } from '@/shared/components/PriceBreakdown';
import { CreateBookingUseCase } from '@/domain/appointments/application/use-cases/create-booking';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Calendar, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface DirectBookingWizardContentProps {
  onSwitchToCustomQuote: () => void;
}

function DirectBookingWizardContent({ onSwitchToCustomQuote }: DirectBookingWizardContentProps) {
  const { state, dispatch } = useQuoteFlowBooking();

  // Price calculations
  const basePrice = state.selectedService?.priceMXN || 0;
  const lengthModifier = state.selectedLength === 'medium' ? 80 : state.selectedLength === 'long' ? 150 : state.selectedLength === 'xl' ? 220 : 0;
  const addOnsTotal = state.selectedAddOnIds.reduce((sum, id) => {
    const found = AVAILABLE_ADDONS.find((a) => a.id === id);
    return sum + (found ? found.priceMXN : 0);
  }, 0);

  const totalPrice = basePrice + lengthModifier + addOnsTotal;
  const depositAmount = 250; // $250 MXN deposit

  const durationMinutes = (state.selectedService?.durationMinutes || 60) + (state.selectedLength !== 'short' ? 15 : 0);

  const breakdownItems = [
    { id: 'b1', label: state.selectedService?.title || 'Servicio Base', amount: basePrice },
    ...(lengthModifier > 0 ? [{ id: 'b2', label: `Largo (${state.selectedLength})`, amount: lengthModifier }] : []),
    ...state.selectedAddOnIds.map((id) => {
      const found = AVAILABLE_ADDONS.find((a) => a.id === id);
      return { id, label: found?.title || 'Adicional', amount: found?.priceMXN || 0 };
    }),
  ];

  const handleCreateAppointment = () => {
    const useCase = new CreateBookingUseCase();
    const appointment = useCase.execute({
      clientId: 'cli-123',
      clientName: 'Cliente Emme',
      serviceId: state.selectedService?.id || 'srv-gel-mani',
      serviceTitle: state.selectedService?.title || 'Manicura Gel Clásica',
      staffId: state.selectedStaff?.id || 'staff-1',
      staffName: state.selectedStaff?.name || 'Valeria R.',
      date: state.selectedDate || new Date().toISOString().split('T')[0],
      timeSlot: state.selectedTimeSlot || '10:00 AM',
      durationMinutes,
      totalPrice,
      depositAmount,
    });

    dispatch({ type: 'CONFIRM_BOOKING', payload: appointment });
  };

  const stepNum = state.currentStep === 'select-service' ? 1 : state.currentStep === 'configure-options' ? 2 : state.currentStep === 'select-schedule' ? 3 : 4;
  const totalSteps = 3;
  const percentage = Math.min(100, Math.round((stepNum / totalSteps) * 100));

  const stepMeta = {
    'select-service': {
      title: '¿Qué servicio base deseas realizarte?',
      subtitle: 'Selecciona entre los servicios del catálogo con precios cerrados.',
    },
    'configure-options': {
      title: 'Personaliza la forma y especificaciones',
      subtitle: `Configura el largo y adicionales para ${state.selectedService?.title || 'tu servicio'}.`,
    },
    'select-schedule': {
      title: 'Elige manicurista, fecha y turno',
      subtitle: 'Selecciona la técnica especialista y el horario que mejor te convenga.',
    },
    'confirmation': {
      title: '¡Cita confirmada con éxito!',
      subtitle: 'Tu pase de reserva y detalles han sido guardados.',
    },
  }[state.currentStep];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Stepper - Unboxed */}
      <div className="w-full space-y-3 pt-1">
        <div className="w-full space-y-2 sm:space-y-2.5">
          <div className="flex items-center justify-between">
            {state.currentStep !== 'select-service' && state.currentStep !== 'confirmation' ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_STEP', payload: state.currentStep === 'select-schedule' ? 'configure-options' : 'select-service' })}
                className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 px-1.5 sm:px-2 -ml-1 sm:-ml-2 rounded-lg hover:bg-secondary/60"
              >
                <ArrowLeft className="size-3.5 sm:size-4" />
                <span>Volver</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <Sparkles className="size-3.5" />
                <span>Agendar Cita Base</span>
              </div>
            )}

            {state.currentStep !== 'confirmation' && (
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-muted-foreground/80 bg-secondary/80 px-2.5 sm:px-3 py-1 rounded-full border border-border/40">
                Paso {stepNum} de {totalSteps}
              </span>
            )}
          </div>

          {/* Progress Bar Line */}
          {state.currentStep !== 'confirmation' && (
            <div className="w-full h-1 sm:h-1.5 bg-secondary/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Step Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {stepMeta.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {stepMeta.subtitle}
          </p>
        </div>
      </div>

      {/* STEP 1: Select Catalog Service */}
      {state.currentStep === 'select-service' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-foreground">1. Selecciona un Servicio del Catálogo</h3>
            <p className="text-[11px] text-muted-foreground">
              Nuestros servicios estándar cuentan con precios cerrados y confirmación de cita inmediata.
            </p>
          </div>

          <ServiceSelector
            selectedServiceId={state.selectedService?.id}
            onSelectService={(srv) => dispatch({ type: 'SELECT_SERVICE', payload: srv })}
            showCustomDesignOption={true}
            onSelectCustomDesign={onSwitchToCustomQuote}
          />
        </div>
      )}

      {/* STEP 2: Configure Length, Shape, and AddOns */}
      {state.currentStep === 'configure-options' && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-foreground">2. Personaliza la Forma & Largo</h3>
            <p className="text-[11px] text-muted-foreground">
              Configura las especificaciones para {state.selectedService?.title}.
            </p>
          </div>

          <NailShapeSelector
            selectedShape={state.selectedShape}
            onSelectShape={(shape) => dispatch({ type: 'SET_SHAPE', payload: shape })}
          />

          <NailLengthSelector
            selectedLength={state.selectedLength}
            onSelectLength={(length) => dispatch({ type: 'SET_LENGTH', payload: length })}
          />

          <AddOnSelector
            selectedAddOnIds={state.selectedAddOnIds}
            onToggleAddOn={(id) => dispatch({ type: 'TOGGLE_ADDON', payload: id })}
          />

          <PriceBreakdown
            items={breakdownItems}
            totalPrice={totalPrice}
            depositAmount={depositAmount}
            estimatedDurationMinutes={durationMinutes}
          />

          <Button
            type="button"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'select-schedule' })}
            className="w-full bg-primary text-white text-xs font-black h-11 rounded-2xl cursor-pointer"
          >
            <span>Elegir Horario & Manicurista</span>
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      )}

      {/* STEP 3: Select Schedule & Staff */}
      {state.currentStep === 'select-schedule' && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-foreground">3. Elige Fecha, Hora y Artista</h3>
            <p className="text-[11px] text-muted-foreground">
              Selecciona el horario disponible que mejor se adapte a ti.
            </p>
          </div>

          <AvailabilitySelector
            selectedStaffId={state.selectedStaff?.id}
            onSelectStaff={(staff) => dispatch({ type: 'SELECT_STAFF', payload: staff })}
            selectedDate={state.selectedDate}
            onSelectDate={(d) => dispatch({ type: 'SET_DATE', payload: d })}
            selectedTimeSlot={state.selectedTimeSlot}
            onSelectTimeSlot={(slot) => dispatch({ type: 'SET_TIME_SLOT', payload: slot })}
          />

          <PriceBreakdown
            items={breakdownItems}
            totalPrice={totalPrice}
            depositAmount={depositAmount}
            estimatedDurationMinutes={durationMinutes}
          />

          <Button
            type="button"
            disabled={!state.selectedDate || !state.selectedTimeSlot}
            onClick={handleCreateAppointment}
            className="w-full bg-primary text-white text-xs font-black h-11 rounded-2xl cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="size-4 mr-1.5" />
            <span>Confirmar Cita y Pagar Anticipo de ${depositAmount} MXN</span>
          </Button>
        </div>
      )}

      {/* STEP 4: Confirmation Pass */}
      {state.currentStep === 'confirmation' && state.confirmedAppointment && (
        <div className="p-5 rounded-3xl bg-primary/[0.04] border border-primary/20 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="size-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-foreground">¡Cita Confirmada con Éxito!</h3>
            <p className="text-xs text-muted-foreground">
              Pase de cita #{state.confirmedAppointment.id.slice(-6).toUpperCase()} guardado en tu cuenta.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/80 text-left space-y-2 text-xs">
            <div className="flex justify-between font-bold border-b border-border/40 pb-2">
              <span>Servicio:</span>
              <span className="text-primary">{state.confirmedAppointment.serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>Manicurista:</span>
              <span className="font-bold">{state.confirmedAppointment.staffName}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha & Hora:</span>
              <span className="font-bold">{state.confirmedAppointment.date} a las {state.confirmedAppointment.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span>Anticipo Pagado:</span>
              <span className="font-extrabold text-primary">${state.confirmedAppointment.depositPaid} MXN</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: 'RESET' })}
            className="w-full text-xs font-bold"
          >
            Agendar otra cita
          </Button>
        </div>
      )}
    </div>
  );
}

function useQuoteFlowBooking() {
  return useDirectBooking();
}

export function DirectBookingWizard(props: DirectBookingWizardContentProps) {
  return (
    <DirectBookingProvider>
      <DirectBookingWizardContent {...props} />
    </DirectBookingProvider>
  );
}
