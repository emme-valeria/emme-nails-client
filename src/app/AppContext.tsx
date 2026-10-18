import React, { createContext, useContext, useEffect, useState } from 'react';
import { cacheService } from '@emme/infrastructure/cacheService';
import { toast } from 'sonner';
import { User } from 'firebase/auth';
import { buildAuthListener, googleSignIn, googleSignOut } from '@emme/infrastructure/googleAuth';
import {
  syncAppointmentToCalendar,
  createSpreadsheet,
  setupSpreadsheetTabs,
  exportClientsToSpreadsheet,
  exportAppointmentsToSpreadsheet,
  exportFinancesToSpreadsheet
} from '@emme/infrastructure/googleWorkspace';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  category: string;
  isActive: boolean;
  isPopular?: boolean;
  badge?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  allergies?: string;
  preferences?: string;
  isVip?: boolean;
  birthday?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  googleEventId?: string;
}

export interface UserStyleProfile {
  clientName: string;
  clientContact: string;
  goal: 'extensions' | 'natural_care' | 'pedi_spa' | 'lashes_brows' | string;
  specificService: string;
  shape: string;
  length: string;
  finish: string;
  artLevel: string;
  lashStyle: string;
  browStyle: string;
  colorName: string;
  colorHex: string;
  styleVibe: string;
  comfortPreferences: string[];
  lastUpdated?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  owner: string;
  instagram?: string;
  phone?: string;
  description?: string;
  address?: string;
  logo?: string;
  workingHours?: {
    [key: string]: { 
      open: string; 
      close: string; 
      active: boolean; 
      breakActive?: boolean; 
      breakStart?: string; 
      breakEnd?: string; 
    };
  };
  notifications?: {
    whatsappEnabled: boolean;
    reminderTime: number; // hours
    template: string;
  };
  language?: string;
  monthlyGoal?: number;
  promotions?: Array<{
    id: string;
    title: string;
    serviceId: string;
    startDate: string;
    endDate: string;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
    isActive: boolean;
  }>;
  whatsappBot?: {
    enabled: boolean;
    autoReply: boolean;
    welcomeMessage: string;
    keywords?: Array<{ trigger: string; response: string }>;
  };
  salonConfig?: {
    specialDates: Array<{
      id: string;
      date: string;
      endDate?: string;
      type: 'holiday' | 'reduced' | 'event' | 'vacation';
      hours?: { open: string; close: string };
      note: string;
      open?: string;
      close?: string;
    }>;
  };
}

interface AppContextType {
  services: Service[];
  clients: Client[];
  appointments: Appointment[];
  profile: BusinessProfile;
  isAuthenticated: boolean;
  isFirstTime: boolean;
  isTourActive: boolean;
  activeClientId: string;
  currentClient: Client;
  setActiveClientId: (id: string) => void;
  login: () => void;
  logout: () => void;
  signup: () => void;
  loginWithEmail: (email: string, name?: string, phone?: string) => Promise<void>;
  loginWithWhatsApp: (phone: string, name?: string) => Promise<void>;
  linkEmailToCurrentClient: (email: string) => void;
  linkPhoneToCurrentClient: (phone: string) => void;
  completeOnboarding: (startTourAfter?: boolean) => void;
  restartOnboarding: () => void;
  openStyleStudio: (startAtCategory?: boolean) => void;
  userStyleProfile: UserStyleProfile;
  updateUserStyleProfile: (updates: Partial<UserStyleProfile>) => void;
  startTour: () => void;
  endTour: () => void;
  addService: (s: Omit<Service, 'id'>) => void;
  addClient: (c: Omit<Client, 'id'>) => void;
  addAppointment: (a: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, a: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateProfile: (p: BusinessProfile) => void;
  deleteClient: (id: string) => void;
  deleteService: (id: string) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  toggleServiceStatus: (id: string) => void;

  // Google & Social Workspace Properties
  googleUser: User | null;
  googleToken: string | null;
  googleSpreadsheetId: string | null;
  isGoogleAutoSync: boolean;
  isGoogleSheetsAutoExport: boolean;
  socialAccounts: Array<{
    provider: 'google' | 'apple' | 'facebook' | 'instagram' | 'twitter';
    name: string;
    email?: string;
    handle?: string;
    connected: boolean;
    lastLogin?: string;
  }>;
  activeSocialProvider: string | null;
  connectGoogle: () => Promise<boolean>;
  disconnectGoogle: () => Promise<void>;
  loginWithProvider: (provider: 'google' | 'apple' | 'facebook' | 'instagram' | 'twitter') => Promise<void>;
  toggleSocialAccount: (provider: string) => void;
  toggleGoogleAutoSync: (val: boolean) => void;
  toggleGoogleSheetsAutoExport: (val: boolean) => void;
  setGoogleSpreadsheetId: (id: string | null) => void;
  syncAllAppointmentsToCalendar: () => Promise<void>;
  exportAllDataToSheets: () => Promise<void>;
}

const DEFAULT_SERVICES: Service[] = [
  // 1. Manicura y Uñas
  { id: 'm1', name: 'Manicura Express', description: 'Limpieza de cutícula, limado y brillo natural o esmalte tradicional.', price: 200, duration: 30, category: 'Manicura y Uñas', isActive: true },
  { id: 'm2', name: 'Manicura Rusa con Base Rubber', description: 'Limpieza profunda con torno y tijera, nivelación estructural y alta durabilidad.', price: 520, duration: 60, category: 'Manicura y Uñas', isActive: true },
  { id: 'm3', name: 'Esmaltado Semi-permanente (Gelish)', description: 'Aplicación de color en gel de alta resistencia curado en lámpara LED.', price: 380, duration: 45, category: 'Manicura y Uñas', isActive: true },
  { id: 'm4', name: 'Nivelación con Gel Estructurado', description: 'Refuerzo arquitectónico para uñas naturales frágiles.', price: 450, duration: 60, category: 'Manicura y Uñas', isActive: true },

  // 2. Extensiones y Estructura
  { id: 'e1', name: 'Soft Gel (Gel-X Full Cover)', description: 'Sistema de extensiones de gel ligero, colocadas sin daño a la uña natural.', price: 850, duration: 90, category: 'Extensiones y Estructura', isActive: true },
  { id: 'e2', name: 'Uñas de Acrílico Esculturales', description: 'Estructura personalizada sobre molde para máxima resistencia y largo a medida.', price: 920, duration: 105, category: 'Extensiones y Estructura', isActive: true },
  { id: 'e3', name: 'Retoque / Relleno de Crecimiento', description: 'Mantenimiento preventivo para sets de 2 a 3 semanas.', price: 450, duration: 60, category: 'Extensiones y Estructura', isActive: true },

  // 3. Pedicura & Jelly Spa
  { id: 'p1', name: 'Pedicura Jelly Spa Deluxe', description: 'Baño gelatinoso con aromaterapia, exfoliación de sales, masaje y esmaltado en gel.', price: 580, duration: 60, category: 'Pedicura & Jelly Spa', isActive: true },
  { id: 'p2', name: 'Pedicura Clínica / Rusa Podológica', description: 'Enfoque higiénico profundo en talones, cutículas y salud podal sin humedad previa.', price: 480, duration: 50, category: 'Pedicura & Jelly Spa', isActive: true },
  { id: 'p3', name: 'Esmaltado Permanente de Pies', description: 'Limpieza rápida y color en gel de larga duración.', price: 320, duration: 35, category: 'Pedicura & Jelly Spa', isActive: true },

  // 4. Pestañas (Lashes)
  { id: 'l1', name: 'Extensiones Clásicas (1 a 1)', description: 'Aplicación pelo a pelo para un alargamiento natural tipo rímel fino.', price: 750, duration: 80, category: 'Pestañas (Lashes)', isActive: true },
  { id: 'l2', name: 'Volumen Ruso / Híbrido Glamour', description: 'Abanicos multidimensionales ultralivianos para mirada densa y tupida.', price: 950, duration: 100, category: 'Pestañas (Lashes)', isActive: true },
  { id: 'l3', name: 'Lifting de Pestañas con Keratina', description: 'Curvatura natural de tus propias pestañas con botox de keratina y tinte negro.', price: 490, duration: 50, category: 'Pestañas (Lashes)', isActive: true },

  // 5. Cejas (Brows)
  { id: 'b1', name: 'Laminado de Cejas con Keratina + Diseño', description: 'Fijación direccional fluffy para cejas pobladas, simétricas y ordenadas.', price: 480, duration: 45, category: 'Cejas (Brows)', isActive: true },
  { id: 'b2', name: 'Diseño & Perfilado con Henna Orgánica', description: 'Visagismo facial y sombreado botánico con henna natural que tiñe pelo y piel.', price: 350, duration: 35, category: 'Cejas (Brows)', isActive: true },
  { id: 'b3', name: 'Perfilado & Depilación con Hilo', description: 'Limpieza milimétrica del arco de la ceja con técnica hindú.', price: 200, duration: 25, category: 'Cejas (Brows)', isActive: true },

  // 6. Tratamientos & Spa
  { id: 's1', name: 'Spa de Manos & Parafina Tibia', description: 'Exfoliación orgánica, mascarilla de colágeno y baño de parafina hidratante.', price: 320, duration: 30, category: 'Tratamientos & Spa', isActive: true },
  { id: 's2', name: 'Retiro Seguro de Producto + Keratina', description: 'Remoción cuidadosa con torno podológico e hidratación de capas naturales.', price: 220, duration: 30, category: 'Tratamientos & Spa', isActive: true },
];

const DEFAULT_CLIENTS: Client[] = [
  { id: '1', name: 'Valeria Arriaza', phone: '+34 600 000 000', isVip: true, allergies: 'Alergia al látex', preferences: 'Le gusta el café frío' },
  { id: '2', name: 'Elena García', phone: '+34 611 111 111', notes: 'Prefiere colores nude', preferences: 'Siempre pide música suave' },
  { id: '3', name: 'Maria Jose', phone: '+34 622 222 222', isVip: true, allergies: 'Sensibilidad a fuertes olores' },
  { id: '4', name: 'Carla Lopez', phone: '+34 633 333 333' },
  { id: '5', name: 'Sofia Martinez', phone: '+34 644 444 444' },
  { id: '6', name: 'Ana Smith', phone: '+34 655 555 555' },
  { id: '7', name: 'Lucia Perez', phone: '+34 666 666 666' },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { id: 'a0-valeria', clientId: '1', serviceId: 'e1', date: '2026-09-25', startTime: '11:00', endTime: '12:30', status: 'confirmed', notes: 'Servicio: Soft Gel (Gel-X Full Cover) • Silueta: Almendra • Acabado: Glazed Donut • Color: Nude Rosé Ballet' },
  { id: 'a1', clientId: '1', serviceId: 'm2', date: '2026-08-04', startTime: '09:00', endTime: '10:30', status: 'completed', notes: 'Manicura rusa con diseño minimalista nude' },
  { id: 'a2', clientId: '2', serviceId: 'm3', date: '2026-08-04', startTime: '11:00', endTime: '11:45', status: 'completed', notes: 'Esmaltado permanente rojo clásico' },
  { id: 'a3', clientId: '3', serviceId: 'e1', date: '2026-08-04', startTime: '12:30', endTime: '14:00', status: 'confirmed', notes: 'Soft Gel tono almendra suave' },
  { id: 'a4', clientId: '4', serviceId: 'm3', date: '2026-08-04', startTime: '15:15', endTime: '16:00', status: 'pending', notes: 'Cambio de color express' },
  { id: 'a5', clientId: '5', serviceId: 'e1', date: '2026-08-04', startTime: '16:30', endTime: '18:00', status: 'pending', notes: 'Retocado y encapsulado' },
  { id: 'a6', clientId: '1', serviceId: 'e1', date: '2026-08-02', startTime: '10:00', endTime: '11:30', status: 'completed', notes: 'Soft Gel Full Cover con foil dorado' },
  { id: 'a7', clientId: '3', serviceId: 'p2', date: '2026-08-01', startTime: '16:00', endTime: '17:30', status: 'completed', notes: 'Pedicura Spa completa con masajes' },
  { id: 'a8', clientId: '6', serviceId: 'm4', date: '2026-07-29', startTime: '11:30', endTime: '12:30', status: 'completed', notes: 'Nivelación Rubber Base tono baby boomer' },
  { id: 'a9', clientId: '7', serviceId: 'e2', date: '2026-07-26', startTime: '14:00', endTime: '16:00', status: 'completed', notes: 'Acrílico escultural largo 3 con diseño Cat Eye' },
  { id: 'a10', clientId: '2', serviceId: 'm2', date: '2026-07-22', startTime: '17:00', endTime: '18:30', status: 'completed', notes: 'Manicura Rusa de mantenimiento' },
  { id: 'a11', clientId: '5', serviceId: 'p1', date: '2026-07-18', startTime: '09:30', endTime: '10:30', status: 'completed', notes: 'Pedicura clínica' },
  { id: 'a12', clientId: '4', serviceId: 'c2', date: '2026-07-14', startTime: '12:00', endTime: '12:30', status: 'completed', notes: 'Retiro de Soft Gel e hidratación' },
];

const DEFAULT_PROFILE: BusinessProfile = {
  id: 'st-001-apple',
  name: 'EmmeStudio',
  owner: 'Valeria',
  instagram: '@emmestudio',
  description: 'Estudio especializado en cuidado de uñas y nail art de alta gama.',
  address: 'Calle Principal 123, Madrid',
  workingHours: {
    lunes: { open: '09:00', close: '20:00', active: true },
    martes: { open: '09:00', close: '20:00', active: true },
    miercoles: { open: '09:00', close: '20:00', active: true },
    jueves: { open: '09:00', close: '20:00', active: true },
    viernes: { open: '09:00', close: '20:00', active: true },
    sabado: { open: '10:00', close: '14:00', active: true },
    domingo: { open: '00:00', close: '00:00', active: false },
  },
  notifications: {
    whatsappEnabled: true,
    reminderTime: 24,
    template: 'Hola {cliente}, te recordamos tu cita en EmmeStudio para {servicio} el día {fecha} a las {hora}. ¡Te esperamos!'
  },
  language: 'es',
  monthlyGoal: 25000,
  promotions: [
    { id: '1', title: 'Descuento Primavera', serviceId: 'm2', startDate: '2026-05-01', endDate: '2026-05-31', discountValue: 15, discountType: 'percentage', isActive: true },
    { id: '2', title: 'Promo Soft Gel', serviceId: 'e1', startDate: '2026-06-01', endDate: '2026-06-15', discountValue: 10, discountType: 'fixed', isActive: false },
  ],
  whatsappBot: {
    enabled: true,
    autoReply: true,
    welcomeMessage: '¡Hola! Bienvenida a EmmeStudio. ¿En qué podemos ayudarte hoy?',
    keywords: [
      { trigger: 'precios', response: 'Puedes ver todos nuestros servicios y precios en la sección de Servicios de nuestra App.' },
      { trigger: 'ubicacion', response: 'Estamos ubicados en Calle Principal 123, Madrid.' }
    ]
  },
  salonConfig: {
    specialDates: [
      { id: 'sd1', date: '2026-12-25', type: 'holiday', note: 'Navidad' },
      { id: 'sd2', date: '2026-12-31', type: 'reduced', hours: { open: '09:00', close: '14:00' }, note: 'Fin de Año' }
    ]
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    return cacheService.get<Service[]>('services') || DEFAULT_SERVICES;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    return cacheService.get<Client[]>('clients') || DEFAULT_CLIENTS;
  });

  const [activeClientId, setActiveClientIdState] = useState<string>(() => {
    return cacheService.get<string>('activeClientId') || '1';
  });

  const setActiveClientId = (id: string) => {
    setActiveClientIdState(id);
    cacheService.set('activeClientId', id);
  };

  const currentClient: Client = clients.find(c => c.id === activeClientId) || clients[0] || {
    id: '1',
    name: 'Valeria Arriaza',
    phone: '+34 600 000 000',
    email: 'valeria@emmestudio.app',
    isVip: true
  };

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const cached = cacheService.get<Appointment[]>('appointments');
    return (cached && cached.length > 0) ? cached : DEFAULT_APPOINTMENTS;
  });

  const [profile, setProfile] = useState<BusinessProfile>(() => {
    return cacheService.get<BusinessProfile>('profile') || DEFAULT_PROFILE;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const cached = cacheService.get<boolean>('isAuthenticated');
    return cached === null ? false : cached; // Changed default to false to show auth flow
  });

  const [isFirstTime, setIsFirstTime] = useState<boolean>(() => {
    const cached = cacheService.get<boolean>('isFirstTime');
    return cached === null ? true : cached;
  });

  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  const startTour = () => {
    setIsTourActive(true);
  };

  const endTour = () => {
    setIsTourActive(false);
  };

  const completeOnboarding = (startTourAfter: boolean = true) => {
    setIsFirstTime(false);
    cacheService.set('isFirstTime', false);
    if (startTourAfter) {
      setIsTourActive(true);
    }
  };

  const restartOnboarding = () => {
    setIsFirstTime(true);
    cacheService.set('isFirstTime', true);
  };

  const [userStyleProfile, setUserStyleProfileState] = useState<UserStyleProfile>(() => {
    const cached = cacheService.get<UserStyleProfile>('userStyleProfile' as any);
    if (cached) return cached;
    return {
      clientName: 'Valeria Arriaza',
      clientContact: '+52 3331733925',
      goal: 'extensions',
      specificService: 'Soft Gel Tips',
      shape: 'Almendra',
      length: 'Medio',
      finish: 'Glossy',
      artLevel: 'Glazed Chrome',
      lashStyle: 'Foxy / Cat Eye',
      browStyle: 'Laminado de Cejas',
      colorName: 'Milky White',
      colorHex: '#FFFFFF',
      styleVibe: 'Clean Girl',
      comfortPreferences: ['Café frío o té', 'Música relajante'],
      lastUpdated: new Date().toISOString()
    };
  });

  const updateUserStyleProfile = (updates: Partial<UserStyleProfile>) => {
    setUserStyleProfileState(prev => {
      const next = { ...prev, ...updates, lastUpdated: new Date().toISOString() };
      cacheService.set('userStyleProfile' as any, next);
      return next;
    });
  };

  const openStyleStudio = (startAtCategory: boolean = true) => {
    setIsFirstTime(true);
    cacheService.set('isFirstTime', true);
  };
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const [googleSpreadsheetId, setGoogleSpreadsheetIdState] = useState<string | null>(() => {
    return cacheService.get<string>('googleSpreadsheetId') || null;
  });

  const [isGoogleAutoSync, setIsGoogleAutoSync] = useState<boolean>(() => {
    const val = cacheService.get<boolean>('isGoogleAutoSync');
    return val === null ? false : val;
  });

  const [isGoogleSheetsAutoExport, setIsGoogleSheetsAutoExport] = useState<boolean>(() => {
    const val = cacheService.get<boolean>('isGoogleSheetsAutoExport');
    return val === null ? false : val;
  });

  const [socialAccounts, setSocialAccounts] = useState<Array<{
    provider: 'google' | 'apple' | 'facebook' | 'instagram' | 'twitter';
    name: string;
    email?: string;
    handle?: string;
    connected: boolean;
    lastLogin?: string;
  }>>(() => {
    return cacheService.get('socialAccounts') || [
      { provider: 'google', name: 'Google', email: 'valeria@emmestudio.app', connected: true },
      { provider: 'apple', name: 'Apple ID', email: 'valeria.apple@icloud.com', connected: true },
      { provider: 'facebook', name: 'Facebook', handle: 'EmmeStudioStudio', connected: false },
      { provider: 'instagram', name: 'Instagram', handle: '@emmestudio.atelier', connected: true },
      { provider: 'twitter', name: 'Twitter / X', handle: '@EmmeStudioStudio', connected: false },
    ];
  });

  const [activeSocialProvider, setActiveSocialProvider] = useState<string | null>(() => {
    return cacheService.get<string>('activeSocialProvider') || 'google';
  });

  // Listen for Google Auth changes
  useEffect(() => {
    const unsub = buildAuthListener((user, token) => {
      setGoogleUser(user);
      setGoogleToken(token);
    });
    return unsub;
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    cacheService.set('isAuthenticated', true);

    const hasCompletedTour = cacheService.get<boolean>('hasCompletedTour');
    if (!hasCompletedTour || isFirstTime) {
      setIsTourActive(true);
      toast.info('¡Bienvenida! Iniciando Tour Guiado de EmmeStudio');
    }
  };

  const signup = () => {
    setIsAuthenticated(true);
    setIsFirstTime(true); // Ensure onboarding shows for new users
    cacheService.set('isAuthenticated', true);
    cacheService.set('isFirstTime', true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsFirstTime(false); // Reset to false so they don't see onboarding again if they were already logged in once
    cacheService.set('isAuthenticated', false);
    toast.error('Sesión cerrada');
    setTimeout(() => {
      window.location.hash = '#/';
    }, 100);
  };

  const loginWithProvider = async (provider: 'google' | 'apple' | 'facebook' | 'instagram' | 'twitter') => {
    if (provider === 'google') {
      try {
        const success = await connectGoogle();
        if (!success) {
          return;
        }
      } catch (e: any) {
        if (
          e?.code === 'auth/popup-closed-by-user' ||
          e?.code === 'auth/cancelled-popup-request' ||
          e?.message?.includes('popup-closed-by-user')
        ) {
          return;
        }
        console.warn('Google connect fallback', e);
        return;
      }
    }

    setActiveSocialProvider(provider);
    cacheService.set('activeSocialProvider', provider);
    
    // Update connected state for this provider
    setSocialAccounts(prev => prev.map(acc => {
      if (acc.provider === provider) {
        return { ...acc, connected: true, lastLogin: new Date().toISOString() };
      }
      return acc;
    }));
    
    login();
  };

  const loginWithEmail = async (email: string, name?: string, phone?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    let client = clients.find(c => c.email?.toLowerCase() === trimmedEmail);

    if (!client) {
      // Check if phone matches any existing client
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        client = clients.find(c => c.phone.replace(/\D/g, '').includes(cleanPhone));
      }
    }

    if (client) {
      // Update with email if missing
      if (!client.email && trimmedEmail) {
        updateClient(client.id, { email: trimmedEmail });
      }
      setActiveClientId(client.id);
    } else {
      // Create a new client
      const newClientId = crypto.randomUUID();
      const newClient: Client = {
        id: newClientId,
        name: name || trimmedEmail.split('@')[0] || 'Cliente Emme',
        email: trimmedEmail,
        phone: phone || '+34 600 000 000',
        isVip: false
      };
      setClients(prev => [...prev, newClient]);
      setActiveClientId(newClientId);
    }

    login();
  };

  const loginWithWhatsApp = async (phone: string, name?: string) => {
    const cleanDigits = phone.replace(/\D/g, '');
    let client = clients.find(c => c.phone.replace(/\D/g, '').includes(cleanDigits) || cleanDigits.includes(c.phone.replace(/\D/g, '')));

    if (client) {
      setActiveClientId(client.id);
    } else {
      const newClientId = crypto.randomUUID();
      const newClient: Client = {
        id: newClientId,
        name: name || 'Cliente WhatsApp',
        phone: phone,
        isVip: false
      };
      setClients(prev => [...prev, newClient]);
      setActiveClientId(newClientId);
    }

    login();
  };

  const linkEmailToCurrentClient = (email: string) => {
    if (!currentClient) return;
    const trimmed = email.trim().toLowerCase();
    updateClient(currentClient.id, { email: trimmed });
    toast.success(`Correo vinculado: ${trimmed}. ¡Recibirás confirmaciones y recordatorios por email!`);
  };

  const linkPhoneToCurrentClient = (phone: string) => {
    if (!currentClient) return;
    updateClient(currentClient.id, { phone });
    toast.success(`Teléfono vinculado: ${phone}`);
  };

  const toggleSocialAccount = (provider: string) => {
    setSocialAccounts(prev => prev.map(acc => {
      if (acc.provider === provider) {
        const nextState = !acc.connected;
        toast.info(nextState ? `Cuenta de ${acc.name} conectada` : `Cuenta de ${acc.name} desconectada`);
        return { ...acc, connected: nextState };
      }
      return acc;
    }));
  };

  useEffect(() => {
    cacheService.set('services', services);
    cacheService.set('clients', clients);
    cacheService.set('appointments', appointments);
    cacheService.set('profile', profile);
    cacheService.set('googleSpreadsheetId', googleSpreadsheetId);
    cacheService.set('isGoogleAutoSync', isGoogleAutoSync);
    cacheService.set('isGoogleSheetsAutoExport', isGoogleSheetsAutoExport);
    cacheService.set('socialAccounts', socialAccounts);
  }, [services, clients, appointments, profile, googleSpreadsheetId, isGoogleAutoSync, isGoogleSheetsAutoExport, socialAccounts]);

  const addService = (s: Omit<Service, 'id' | 'isActive'>) => {
    setServices([...services, { ...s, id: crypto.randomUUID(), isActive: true }]);
  };

  const addClient = (c: Omit<Client, 'id'>) => {
    setClients([...clients, { ...c, id: crypto.randomUUID() }]);
  };

  // Google Sync helpers inside Provider
  const triggerGoogleCalendarSync = async (apt: Appointment, tokenToUse?: string) => {
    const token = tokenToUse || googleToken;
    if (!isGoogleAutoSync || !token) return;
    const client = clients.find(c => c.id === apt.clientId);
    const service = services.find(s => s.id === apt.serviceId);
    if (!client || !service) return;
    const res = await syncAppointmentToCalendar(token, apt, client, service);
    if (res.googleEventId && res.googleEventId !== apt.googleEventId) {
      setAppointments(prev => prev.map(item => item.id === apt.id ? { ...item, googleEventId: res.googleEventId } : item));
    }
  };

  const triggerSheetsAutoExport = async (customAppointmentsList?: Appointment[]) => {
    const token = googleToken;
    if (!isGoogleSheetsAutoExport || !token) return;
    try {
      let sheetId = googleSpreadsheetId;
      if (!sheetId) {
        sheetId = await createSpreadsheet(token, `EmmeStudio - Sincronización de Negocio`);
        setGoogleSpreadsheetIdState(sheetId);
        cacheService.set('googleSpreadsheetId', sheetId);
      }
      await setupSpreadsheetTabs(token, sheetId);
      await exportClientsToSpreadsheet(token, sheetId, clients);
      await exportAppointmentsToSpreadsheet(token, sheetId, customAppointmentsList || appointments, clients, services);
      await exportFinancesToSpreadsheet(token, sheetId, customAppointmentsList || appointments, services);
    } catch (e) {
      console.warn('Silent auto sheets export warning:', e);
    }
  };

  const connectGoogle = async (): Promise<boolean> => {
    try {
      const result = await googleSignIn();
      if (result) {
        toast.success(`Google conectado como ${result.user.displayName || result.user.email}`);

        // Link client account if email is available
        const userEmail = result.user.email?.toLowerCase().trim();
        if (userEmail) {
          let client = clients.find(c => c.email?.toLowerCase() === userEmail);
          if (client) {
            setActiveClientId(client.id);
          } else {
            const newClientId = crypto.randomUUID();
            const newClient: Client = {
              id: newClientId,
              name: result.user.displayName || userEmail.split('@')[0] || 'Cliente Google',
              email: userEmail,
              phone: result.user.phoneNumber || '+34 600 000 000',
              isVip: false
            };
            setClients(prev => [...prev, newClient]);
            setActiveClientId(newClientId);
          }
        }

        // Post connection: export spreadsheets if sheet id doesn't exist yet
        if (isGoogleSheetsAutoExport) {
          let sheetId = googleSpreadsheetId;
          if (!sheetId) {
            sheetId = await createSpreadsheet(result.accessToken, `EmmeStudio - Sincronización de Negocio`);
            setGoogleSpreadsheetIdState(sheetId);
            cacheService.set('googleSpreadsheetId', sheetId);
          }
          await setupSpreadsheetTabs(result.accessToken, sheetId);
          await exportClientsToSpreadsheet(result.accessToken, sheetId, clients);
          await exportAppointmentsToSpreadsheet(result.accessToken, sheetId, appointments, clients, services);
          await exportFinancesToSpreadsheet(result.accessToken, sheetId, appointments, services);
        }
        return true;
      }
      return false;
    } catch (e: any) {
      if (
        e?.code === 'auth/popup-closed-by-user' ||
        e?.code === 'auth/cancelled-popup-request' ||
        e?.code === 'auth/user-cancelled' ||
        e?.message?.includes('popup-closed-by-user')
      ) {
        return false;
      }
      toast.error(`Error al conectar con Google: ${e.message}`);
      return false;
    }
  };

  const disconnectGoogle = async () => {
    try {
      await googleSignOut();
      setGoogleSpreadsheetIdState(null);
      cacheService.set('googleSpreadsheetId', null);
      toast.success('Cuenta de Google desconectada.');
    } catch (e: any) {
      toast.error(`Error al desconectar Google: ${e.message}`);
    }
  };

  const setGoogleSpreadsheetId = (id: string | null) => {
    setGoogleSpreadsheetIdState(id);
    cacheService.set('googleSpreadsheetId', id);
  };

  const toggleGoogleAutoSync = (val: boolean) => {
    setIsGoogleAutoSync(val);
    cacheService.set('isGoogleAutoSync', val);
  };

  const toggleGoogleSheetsAutoExport = (val: boolean) => {
    setIsGoogleSheetsAutoExport(val);
    cacheService.set('isGoogleSheetsAutoExport', val);
  };

  const syncAllAppointmentsToCalendar = async () => {
    if (!googleToken) {
      toast.error('Conecta primero tu cuenta de Google.');
      return;
    }
    const activeApts = appointments.filter(a => a.status !== 'cancelled');
    if (activeApts.length === 0) {
      toast.info('No hay citas para sincronizar.');
      return;
    }

    const toastId = toast.loading('Sincronizando todas las citas con Google Calendar...');
    try {
      let successCount = 0;
      const updatedApts = [...appointments];

      for (let i = 0; i < updatedApts.length; i++) {
        const a = updatedApts[i];
        if (a.status !== 'cancelled') {
          const client = clients.find(c => c.id === a.clientId);
          const service = services.find(s => s.id === a.serviceId);
          const res = await syncAppointmentToCalendar(googleToken, a, client, service);
          if (res.googleEventId) {
            a.googleEventId = res.googleEventId;
            successCount++;
          }
        }
      }

      setAppointments(updatedApts);
      toast.dismiss(toastId);
      toast.success(`Google Calendar Sincronizado: ${successCount} citas procesadas.`);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(`Error en la sincronización: ${err.message}`);
    }
  };

  const exportAllDataToSheets = async () => {
    if (!googleToken) {
      toast.error('Conecta primero tu cuenta de Google.');
      return;
    }
    const toastId = toast.loading('Exportando todo el negocio a Google Sheets...');
    try {
      let sheetId = googleSpreadsheetId;
      if (!sheetId) {
        sheetId = await createSpreadsheet(googleToken, `EmmeStudio - Sincronización de Negocio`);
        setGoogleSpreadsheetIdState(sheetId);
        cacheService.set('googleSpreadsheetId', sheetId);
      }
      await setupSpreadsheetTabs(googleToken, sheetId);
      await exportClientsToSpreadsheet(googleToken, sheetId, clients);
      await exportAppointmentsToSpreadsheet(googleToken, sheetId, appointments, clients, services);
      await exportFinancesToSpreadsheet(googleToken, sheetId, appointments, services);
      toast.dismiss(toastId);
      toast.success('¡Google Sheets sincronizado con éxito!');
    } catch (e: any) {
      toast.dismiss(toastId);
      toast.error(`Error al exportar: ${e.message}`);
    }
  };

  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    const newApt = { ...a, id: crypto.randomUUID() };
    setAppointments(prev => {
      const updated = [...prev, newApt];
      triggerGoogleCalendarSync(newApt);
      triggerSheetsAutoExport(updated);
      return updated;
    });
  };

  const updateAppointment = (id: string, updatedFields: Partial<Appointment>) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updatedFields } : a);
      const found = updated.find(a => a.id === id);
      if (found) {
        triggerGoogleCalendarSync(found);
        triggerSheetsAutoExport(updated);
      }
      return updated;
    });
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status } : a);
      const found = updated.find(a => a.id === id);
      if (found) {
        triggerGoogleCalendarSync(found);
        triggerSheetsAutoExport(updated);
      }
      return updated;
    });
  };

  const updateProfile = (p: BusinessProfile) => {
    setProfile(p);
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const updateClient = (id: string, updatedFields: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const updateService = (id: string, updatedFields: Partial<Service>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <AppContext.Provider value={{
      services, clients, appointments, profile, isAuthenticated, isFirstTime, isTourActive, activeClientId, currentClient, setActiveClientId, login, logout, signup, completeOnboarding, restartOnboarding, openStyleStudio, userStyleProfile, updateUserStyleProfile, startTour, endTour,
      loginWithEmail, loginWithWhatsApp, linkEmailToCurrentClient, linkPhoneToCurrentClient,
      addService, addClient, addAppointment, updateAppointment, updateAppointmentStatus, updateProfile, deleteClient, deleteService, updateClient, updateService, toggleServiceStatus,
      googleUser, googleToken, googleSpreadsheetId, isGoogleAutoSync, isGoogleSheetsAutoExport, socialAccounts, activeSocialProvider, connectGoogle, disconnectGoogle, loginWithProvider, toggleSocialAccount, toggleGoogleAutoSync, toggleGoogleSheetsAutoExport, setGoogleSpreadsheetId, syncAllAppointmentsToCalendar, exportAllDataToSheets
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
