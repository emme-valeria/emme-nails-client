import { NavCategory } from '../types';

export const DEFAULT_NAV_CATEGORIES: NavCategory[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    iconName: 'LayoutDashboard',
    defaultPath: '/inicio',
    subItems: [
      { id: 'inicio-repetir', path: '/inicio?tab=repetir', label: 'Repetir Cita', description: 'Reagendar tu servicio favorito rápido' },
      { id: 'inicio-cita', path: '/inicio?tab=cita', label: 'Próxima Cita', description: 'Detalles de tu cita confirmada' },
      { id: 'inicio-historial', path: '/inicio?tab=historial', label: 'Historial', description: 'Visitas y servicios anteriores' },
    ]
  },
  {
    id: 'agenda',
    label: 'Mis Citas',
    iconName: 'Calendar',
    defaultPath: '/agenda',
    subItems: [
      { id: 'agenda-next', path: '/agenda?tab=next', label: 'Próxima Cita', description: 'Horario y ubicación inmediata' },
      { id: 'agenda-upcoming', path: '/agenda?tab=upcoming', label: 'Citas Programadas', description: 'Calendario de reservas activas' },
      { id: 'agenda-horario', path: '/agenda?tab=horario', label: 'Horarios Salón', description: 'Días y horas de atención' },
      { id: 'agenda-past', path: '/agenda?tab=past', label: 'Historial', description: 'Citas completadas' },
    ]
  },
  {
    id: 'asistente',
    label: 'Emme Chat',
    iconName: 'Sparkles',
    defaultPath: '/chat',
    badge: 'Gemini',
    badgeType: 'ai',
    subItems: [
      { id: 'chat-asesor', path: '/chat', label: 'Chat Asesor Gemini', description: 'Asistencia experta, servicios y citas' },
      { id: 'chat-cotizar', path: '/chat?mode=quote', label: 'Cotizar con Foto IA', badge: 'Visión', badgeType: 'ai', description: 'Multimodal Gemini para cotización de uñas' },
      { id: 'chat-aftercare', path: '/chat?mode=aftercare', label: 'Guía de Cuidados', description: 'Recomendaciones post-servicio' },
    ]
  },
  {
    id: 'servicios',
    label: 'Servicios',
    iconName: 'ClipboardList',
    defaultPath: '/services',
    subItems: [
      { id: 'servicios-mani', path: '/services?cat=manicura', label: 'Manicura', description: 'Esmaltado semi, esculpidas, nail art' },
      { id: 'servicios-pedi', path: '/services?cat=pedicura', label: 'Pedicura & Spa', description: 'Tratamientos y embellecimiento de pies' },
      { id: 'servicios-lashes', path: '/services?cat=lashes', label: 'Pestañas & Cejas', description: 'Lifting, extensiones y perfilado' },
    ]
  },
  {
    id: 'perfil',
    label: 'Perfil',
    iconName: 'User',
    defaultPath: '/profile',
    subItems: [
      { id: 'perfil-datos', path: '/profile?tab=perfil', label: 'Datos Personales', description: 'Nombre, teléfono y contacto' },
      { id: 'perfil-estilo', path: '/profile?tab=estilo', label: 'Preferencias Uñas', description: 'Formas, largos y tonos favoritos' },
      { id: 'perfil-config', path: '/profile?tab=configuracion', label: 'Configuración', description: 'Ajustes, notificaciones y tema' },
    ]
  },
];
