import React from 'react';
import { Joyride, Step, EventData, STATUS } from 'react-joyride';
import { useApp } from '@/app/AppContext';
import { toast } from 'sonner';

export function ClientTourModal() {
  const { isTourActive, endTour } = useApp();

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: '¡Bienvenida a Emme Studio!',
      content: 'Explora tu nuevo sistema integral de gestión de belleza y portal VIP. Te guiaremos paso a paso por las herramientas clave de tu estudio y los menús principales.',
      skipBeacon: true,
    },
    {
      target: '[data-tour="nav-inicio"]',
      title: 'Panel Principal / Inicio',
      content: 'Tu centro de control en tiempo real. Revisa tus puntos acumulados en Emme Club, citas próximas confirmadas y acceso directo a reserva rápida.',
    },
    {
      target: '[data-tour="nav-chat"]',
      title: 'Asistente EMME AI con Análisis de Foto',
      content: '¿Tienes una foto de Instagram o Pinterest? Súbela en el chat y EMME AI calculará automáticamente precios estimados, tiempos y estilos ideales.',
    },
    {
      target: '[data-tour="nav-agenda"]',
      title: 'Agenda & Sincronización Google Calendar',
      content: 'Consulta la disponibilidad de días y horas, reserva tus turnos y sincroniza automáticamente todas tus citas con Google Calendar.',
    },
    {
      target: '[data-tour="nav-history"]',
      title: 'Catálogo & Historial de Tratamientos',
      content: 'Explora todos los precios de manicura rusa, soft gel, acrílico y pedicura spa. Vuelve a agendar cualquier servicio previo con 1 solo clic.',
    },
    {
      target: '[data-tour="nav-profile"]',
      title: 'Perfil & Ajustes del Estudio',
      content: 'Gestiona tus recordatorios de WhatsApp, cuentas de Google Workspace vinculadas y personaliza tus preferencias VIP de uñas.',
    },
    {
      target: '[data-tour="vip-card"]',
      title: 'Club VIP Emme Gold & Lealtad',
      content: 'Acumula puntos con cada visita y canjéalos por mascarillas hidratantes, exfoliación de manos gratis o descuentos en nail art.',
    },
    {
      target: '[data-tour="next-appointment"]',
      title: 'Próxima Cita & Sincronización Calendar',
      content: 'Visualiza la fecha, hora e instructivo de preparación para tu próxima manicura. Sincroniza al instante con tu Google Calendar.',
    },
    {
      target: '[data-tour="ai-designer"]',
      title: 'Asesor de Estilo AI & Cotizador Express',
      content: 'Calcula precios adicionales de efectos especiales (Chrome, Aurora, Swarovski, 3D) antes de tu cita.',
    },
    {
      target: '[data-tour="express-booking"]',
      title: 'Reserva Express en 1-Clic',
      content: 'Agenda turnos para hoy o esta semana de la forma más rápida y directa posible.',
    },
    {
      target: '[data-tour="previous-services"]',
      title: 'Re-agendar Atenciones Anteriores',
      content: 'Repite tus combinaciones de colores o esmaltados favoritos sin tener que llenar todo el formulario de nuevo.',
    },
    {
      target: '[data-tour="ai-floating-btn"]',
      title: 'Botón Flotante Asistente AI',
      content: 'Accede al chat inteligente desde cualquier sección del sitio para cotizar o resolver dudas al instante.',
    },
    {
      target: '[data-tour="logout-btn"]',
      title: 'Cierre de Sesión Seguro',
      content: 'Sal de tu portal VIP de forma segura. Tu sesión está resguardada con autenticación oficial de Google.',
    }
  ];

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      endTour();
      toast.success('¡Tour completado con éxito! 🎉', {
        description: 'Ya estás lista para gestionar tu estudio y agendar tus citas.'
      });
    }
  };

  if (!isTourActive) return null;

  const JoyrideComponent = Joyride as any;

  return (
    <JoyrideComponent
      steps={steps}
      run={isTourActive}
      continuous
      locale={{
        back: 'Anterior',
        close: 'Cerrar',
        last: '¡Entendido!',
        next: 'Siguiente',
        skip: 'Omitir Tour',
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#E05286',
          textColor: '#1D1D1F',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        tooltip: {
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 25px 70px -15px rgba(0,0,0,0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: 'min(380px, calc(100vw - 32px))',
          boxSizing: 'border-box',
        },
        tooltipTitle: {
          fontSize: '18px',
          fontWeight: '700',
          color: '#1D1D1F',
          marginBottom: '8px',
        },
        tooltipContent: {
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#515154',
          marginBottom: '16px',
        },
        buttonPrimary: {
          borderRadius: '14px',
          backgroundColor: '#E05286',
          color: '#FFFFFF',
          fontWeight: '700',
          fontSize: '13px',
          padding: '12px 22px',
          outline: 'none',
          boxShadow: '0 10px 25px -5px rgba(224,82,134,0.4)',
        },
        buttonBack: {
          marginRight: '12px',
          color: '#86868B',
          fontWeight: '700',
          fontSize: '13px',
        },
        buttonSkip: {
          color: '#86868B',
          fontWeight: '600',
          fontSize: '13px',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}
