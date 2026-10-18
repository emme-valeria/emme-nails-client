import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Calendar, Clock, User, CheckCircle2, ChevronRight, 
  RotateCcw, DollarSign, Award, ShieldCheck, X, Wand2, Star, Check, 
  Gem, Layers, Sun, Flame, Leaf, ArrowLeft, Upload, Trash2, Camera,
  HelpCircle, AlertCircle, Info, Scissors, Heart, Plus, Minus, ArrowRight,
  MessageSquare, Send, Smartphone, ShieldAlert, CreditCard, Image as ImageIcon,
  FileText, Share2, Building2, AlertTriangle, Users, Lock, Palette
} from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';
import { useApp } from '@/app/AppContext';
import { STAFF_MEMBERS } from '@/features/staff';
import { toast } from 'sonner';
import { triggerSelectionVibration, triggerConfirmedVibration } from '@/shared/utils/haptics';
import { WizardShell } from '@/shared/wizard/WizardShell';
import { SummaryItem, PriceEstimate } from '@/shared/wizard/wizard.types';
import { LiveBookingSummary } from '@/shared/components/LiveBookingSummary';
import { 
  NailShapeType, 
  NailLengthType, 
  NailFinishType 
} from '@/shared/components/NailModelerVisualizerSVG';
import {
  SHAPE_OPTIONS,
  LENGTH_OPTIONS,
  FINISH_OPTIONS,
  SALON_EXTRAS_CATALOG
} from '@/widgets/service-qualification/ui/ServiceQualificationEngine';
import { 
  BookingStylePersonalizationStep,
  BookingStylePersonalizationStepHandle 
} from './BookingStylePersonalizationStep';
import {
  LookSelectionStep,
  LookType,
  ExtensionLengthOption,
  ExtensionTechOption,
  ColorSubTypeOption,
  RefillTimeOption,
  LastAppointmentData
} from './LookSelectionStep';
import {
  CurrentWearStep,
  CurrentWearType,
  CURRENT_WEAR_CATALOG
} from './CurrentWearStep';
import {
  DesignNailArtStep
} from './DesignNailArtStep';
import {
  DiagnosticTreeStep,
  DiagnosticData,
  DiagnosticComputed
} from './DiagnosticTreeStep';
import {
  MainServiceTechniqueStep,
  ServiceCategory,
  NaturalTechnique,
  ExtensionTechnique,
  RefillTechnique,
  NailLengthOption as TechNailLengthOption,
  NailShapeOption as TechNailShapeOption
} from './MainServiceTechniqueStep';

// ----------------------------------------------------
// TYPES & DATA STRUCTURES
// ----------------------------------------------------

export type CurrentProductOption = 'none' | 'same_salon' | 'other_salon';

export interface CurrentProductConfig {
  id: CurrentProductOption;
  title: string;
  subtitle: string;
  badge: string;
  removalFeeMXN: number;
  removalDurationMin: number;
  allowsRefill: boolean;
  requiresRemovalAndNewSet: boolean;
  policyNote?: string;
}

export const CURRENT_PRODUCT_OPTIONS: CurrentProductConfig[] = [
  {
    id: 'none',
    title: 'No (Uñas naturales limpias)',
    subtitle: 'No tienes producto previo en las uñas, listas desde cero',
    badge: '+$0 MXN · +0 min',
    removalFeeMXN: 0,
    removalDurationMin: 0,
    allowsRefill: false,
    requiresRemovalAndNewSet: false
  },
  {
    id: 'same_salon',
    title: 'Sí, de ESTE salón',
    subtitle: 'Esmaltado o estructura aplicada en Emme Studio',
    badge: 'Habilita Relleno o Retiro',
    removalFeeMXN: 50,
    removalDurationMin: 20,
    allowsRefill: true,
    requiresRemovalAndNewSet: false
  },
  {
    id: 'other_salon',
    title: 'Sí, de OTRO salón',
    subtitle: 'Acrílico, gel o producto de procedencia externa',
    badge: 'Retiro Externo + Set Nuevo (+$150)',
    removalFeeMXN: 150,
    removalDurationMin: 35,
    allowsRefill: false,
    requiresRemovalAndNewSet: true,
    policyNote: 'Por bioseguridad y adherencia de químicos, no trabajamos sobre producto de desconocida procedencia.'
  }
];

export type ServiceTypeOption = 'natural_manicure' | 'new_set' | 'refill' | 'only_removal';

export interface ServiceTypeConfig {
  id: ServiceTypeOption;
  title: string;
  subtitle: string;
  baseDurationMinutes: number;
  basePriceMXN: number;
  isExtension: boolean;
  tag: string;
  popular?: boolean;
}

export const SERVICE_TYPE_OPTIONS: ServiceTypeConfig[] = [
  {
    id: 'natural_manicure',
    title: 'Manicura en Uña Natural',
    subtitle: 'Esmaltado / Nivelación sin extensión',
    baseDurationMinutes: 60,
    basePriceMXN: 350,
    isExtension: false,
    tag: '60 min · $350 MXN'
  },
  {
    id: 'new_set',
    title: 'Set Nuevo / Esculpido',
    subtitle: 'Extensión completa desde cero',
    baseDurationMinutes: 80,
    basePriceMXN: 480,
    isExtension: true,
    tag: '80 min · $480 MXN',
    popular: true
  },
  {
    id: 'refill',
    title: 'Relleno / Mantenimiento',
    subtitle: 'Mantenimiento y rebalance de estructura (del salón)',
    baseDurationMinutes: 60,
    basePriceMXN: 340,
    isExtension: false,
    tag: '60 min · $340 MXN'
  },
  {
    id: 'only_removal',
    title: 'Solo Retiro',
    subtitle: 'Remoción sin reestructuración + tratamiento nutritivo',
    baseDurationMinutes: 30,
    basePriceMXN: 120,
    isExtension: false,
    tag: '30 min · $120 MXN'
  }
];

export type SystemTechniqueOption = 'semi_rubber' | 'soft_gel' | 'acrylic' | 'polygel';

export interface SystemTechniqueConfig {
  id: SystemTechniqueOption;
  title: string;
  subtitle: string;
  deltaPriceMXN: number;
  deltaDurationMin: number;
  badge: string;
  description: string;
}

export const SYSTEM_TECHNIQUE_OPTIONS: SystemTechniqueConfig[] = [
  {
    id: 'semi_rubber',
    title: 'Esmaltado Semipermanente / Rubber Base',
    subtitle: 'Refuerzo elástico y nivelación natural con base builder',
    deltaPriceMXN: 0,
    deltaDurationMin: 0,
    badge: 'Flexible & Natural',
    description: 'Ideal para uña natural, aportando curvatura y resistencia flexible.'
  },
  {
    id: 'soft_gel',
    title: 'Soft Gel / Press-On Gel',
    subtitle: 'Tips de gel pre-moldeados con curado UV instantáneo',
    deltaPriceMXN: 30,
    deltaDurationMin: 0,
    badge: 'Ligero & Rápido',
    description: 'Extensión ultraligera, acabado impecable por arriba y por abajo.'
  },
  {
    id: 'acrylic',
    title: 'Acrílico Tradicional',
    subtitle: 'Estructura clásica esculpida de máxima dureza y durabilidad',
    deltaPriceMXN: 40,
    deltaDurationMin: 15,
    badge: 'Máxima Resistencia',
    description: 'El estándar de oro para uñas largas y máxima protección contra golpes.'
  },
  {
    id: 'polygel',
    title: 'Polygel / Acrigel',
    subtitle: 'Híbrido moldeable, sin olor y alta resistencia estructural',
    deltaPriceMXN: 50,
    deltaDurationMin: 15,
    badge: 'Híbrido Premium',
    description: 'Lo mejor del acrílico y el gel: ligereza, cero calor y extrema firmeza.'
  }
];

export type NailLengthOption = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface NailLengthConfig {
  id: NailLengthOption;
  code: string;
  title: string;
  moldRef: string;
  subtitle: string;
  durationMinutes: number;
  priceMXN: number;
  badge: string;
  visualScale: number;
  mmRange: string;
}

export const NAIL_LENGTH_OPTIONS: NailLengthConfig[] = [
  {
    id: 'L0',
    code: 'L0',
    title: 'Natural',
    moldRef: 'Borde libre del dedo',
    subtitle: 'Alineado al borde libre natural del dedo',
    durationMinutes: 0,
    priceMXN: 0,
    badge: '+$0 MXN · +0 min',
    visualScale: 0,
    mmRange: '0 mm'
  },
  {
    id: 'L1',
    code: 'L1',
    title: 'Corto',
    moldRef: '#1 a #2 en molde esculpido',
    subtitle: 'Extensión discreta, funcional y cómoda',
    durationMinutes: 10,
    priceMXN: 40,
    badge: '+$40 MXN · +10 min',
    visualScale: 1,
    mmRange: '3 - 5 mm'
  },
  {
    id: 'L2',
    code: 'L2',
    title: 'Mediano',
    moldRef: '#3 a #4 en molde esculpido',
    subtitle: 'Largo clásico estilizado y elegante',
    durationMinutes: 15,
    priceMXN: 70,
    badge: '+$70 MXN · +15 min',
    visualScale: 2,
    mmRange: '6 - 8 mm'
  },
  {
    id: 'L3',
    code: 'L3',
    title: 'Largo',
    moldRef: '#5 a #6 en molde esculpido',
    subtitle: 'Largo pronunciado de alta presencia',
    durationMinutes: 30,
    priceMXN: 110,
    badge: '+$110 MXN · +30 min',
    visualScale: 3,
    mmRange: '10 - 12 mm'
  },
  {
    id: 'L4',
    code: 'L4',
    title: 'Extra Largo / XL',
    moldRef: '> #7 en molde esculpido',
    subtitle: 'Largo extremo XXL de impacto estético',
    durationMinutes: 45,
    priceMXN: 160,
    badge: '+$160 MXN · +45 min',
    visualScale: 4,
    mmRange: '14+ mm'
  }
];

export type NailShapeOption = 'Almond' | 'Square' | 'Coffin' | 'Stiletto' | 'Oval' | 'Squoval';

export interface NailShapeConfig {
  id: NailShapeOption;
  name: string;
  description: string;
  iconSvgPath: string;
  popular?: boolean;
}

export const NAIL_SHAPE_OPTIONS: NailShapeConfig[] = [
  {
    id: 'Almond',
    name: 'Almendra',
    description: 'Punta suave y estilizada que afina las manos',
    popular: true,
    iconSvgPath: 'M 10 32 C 10 20, 14 6, 20 2 C 26 6, 30 20, 30 32 Z'
  },
  {
    id: 'Square',
    name: 'Cuadrada',
    description: 'Líneas rectas clásicas con ángulos definidos',
    popular: true,
    iconSvgPath: 'M 10 32 L 10 4 L 30 4 L 30 32 Z'
  },
  {
    id: 'Coffin',
    name: 'Coffin / Ballerina',
    description: 'Bordes cónicos modernos con punta recta',
    popular: true,
    iconSvgPath: 'M 10 32 L 13 4 L 27 4 L 30 32 Z'
  },
  {
    id: 'Stiletto',
    name: 'Stiletto',
    description: 'Punta afilada y atrevida de gran impacto',
    iconSvgPath: 'M 10 32 L 20 1 L 30 32 Z'
  },
  {
    id: 'Oval',
    name: 'Ovalada',
    description: 'Curvatura suave, femenina y natural',
    iconSvgPath: 'M 10 32 C 10 14, 13 2, 20 2 C 27 2, 30 14, 30 32 Z'
  },
  {
    id: 'Squoval',
    name: 'Squoval',
    description: 'Cuadrada con esquinas suavemente redondeadas',
    iconSvgPath: 'M 10 32 L 10 8 C 10 4, 12 4, 16 4 L 24 4 C 28 4, 30 4, 30 8 L 30 32 Z'
  }
];

export type NailArtTierOption = 'A0' | 'A1' | 'A2' | 'A3';

export interface NailArtTierConfig {
  id: NailArtTierOption;
  code: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  priceMXN: number;
  examples: string;
  badge: string;
  requiresInspoPhoto: boolean;
}

export const NAIL_ART_TIER_OPTIONS: NailArtTierConfig[] = [
  {
    id: 'A0',
    code: 'A0',
    title: 'Liso / Monocromático',
    subtitle: 'Un solo color por mano',
    durationMinutes: 0,
    priceMXN: 0,
    examples: 'Esmaltado en tono sólido uniforme, nude o milky',
    badge: '+$0 MXN · +0 min',
    requiresInspoPhoto: false
  },
  {
    id: 'A1',
    code: 'A1',
    title: 'Básico',
    subtitle: 'French, efecto cromo, sticker, arte en 1-2 uñas',
    durationMinutes: 15,
    priceMXN: 80,
    examples: 'Francesita, líneas minimalistas, cromo glaseado o stickers en 1-2 dedos',
    badge: '+$80 MXN · +15 min',
    requiresInspoPhoto: false
  },
  {
    id: 'A2',
    code: 'A2',
    title: 'Intermedio',
    subtitle: 'Encapsulados, degradado/ombré, arte en 5 uñas',
    durationMinutes: 35,
    priceMXN: 150,
    examples: 'Baby boomer, degradé, efecto cat eye, encapsulados con glitter/foil',
    badge: '+$150 MXN · +35 min',
    requiresInspoPhoto: false
  },
  {
    id: 'A3',
    code: 'A3',
    title: 'Avanzado / Freestyle',
    subtitle: 'Efectos 3D, mano alzada 10 uñas, pedrería',
    durationMinutes: 60,
    priceMXN: 250,
    examples: 'Relieves en gel 3D, cristalería, micro-escultura o nail art complejo mano alzada',
    badge: '+$250 MXN · +60 min',
    requiresInspoPhoto: false
  }
];

// Presets del catálogo de la manicurista para selección rápida de inspiración
export const SALON_INSPO_PRESETS = [
  {
    id: 'preset_chrome',
    name: 'French Glazed Chrome',
    tier: 'A1' as NailArtTierOption,
    description: 'Puntas francesas con polvo cromo aperlado'
  },
  {
    id: 'preset_ombré',
    name: 'Baby Boomer Degradé',
    tier: 'A2' as NailArtTierOption,
    description: 'Difuminado suave de blanco lechoso a nude'
  },
  {
    id: 'preset_cateye',
    name: 'Cat Eye Aterciopelado',
    tier: 'A2' as NailArtTierOption,
    description: 'Efecto magnético 9D con reflejo seda'
  },
  {
    id: 'preset_3d',
    name: '3D Luxury Jewels & Bows',
    tier: 'A3' as NailArtTierOption,
    description: 'Relieves en gel constructor, lazos 3D y cristalería Swarovski'
  }
];

// Sanitization buffer constant
export const SANITIZATION_BUFFER_MINUTES = 15;

// Helper to format minutes into "X h Y min"
export function formatMinutesHuman(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} minutos`;
  if (mins === 0) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  return `${hours} ${hours === 1 ? 'hora' : 'horas'} ${mins} min`;
}

// Calculate end time string from start time 'HH:mm' + minutes
export function calculateEndTime(startTime: string, minutes: number): string {
  const [hStr, mStr] = startTime.split(':');
  const startH = parseInt(hStr, 10);
  const startM = parseInt(mStr, 10);
  const totalM = startH * 60 + startM + minutes;
  const endH = Math.floor(totalM / 60) % 24;
  const endM = totalM % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export function renderProductIcon(id: CurrentProductOption) {
  switch (id) {
    case 'none':
      return (
        <div className="p-2.5 rounded-xl bg-pink-50/80 dark:bg-pink-950/50 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0">
          <Sparkles className="size-5" />
        </div>
      );
    case 'same_salon':
      return (
        <div className="p-2.5 rounded-xl bg-pink-50/80 dark:bg-pink-950/50 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0">
          <Gem className="size-5" />
        </div>
      );
    case 'other_salon':
      return (
        <div className="p-2.5 rounded-xl bg-pink-50/80 dark:bg-pink-950/50 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0">
          <Layers className="size-5" />
        </div>
      );
  }
}

export function renderServiceIcon(id: ServiceTypeOption) {
  switch (id) {
    case 'natural_manicure':
      return <Sparkles className="size-5 text-primary" />;
    case 'new_set':
      return <Gem className="size-5 text-primary" />;
    case 'refill':
      return <RotateCcw className="size-5 text-primary" />;
    case 'only_removal':
      return <Scissors className="size-5 text-primary" />;
  }
}

export function renderTechniqueIcon(id: SystemTechniqueOption) {
  switch (id) {
    case 'semi_rubber':
      return <Leaf className="size-5 text-primary" />;
    case 'soft_gel':
      return <Layers className="size-5 text-primary" />;
    case 'acrylic':
      return <ShieldCheck className="size-5 text-primary" />;
    case 'polygel':
      return <Sun className="size-5 text-primary" />;
  }
}

interface DirectBookingFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function DirectBookingFlow({ onSuccess, onCancel, isModal = false }: DirectBookingFlowProps) {
  const navigate = useNavigate();
  const { clients, addAppointment } = useApp();

  // Active client
  const currentClient = clients[0] || { id: 'c1', name: 'Valeria Arriaza', phone: '+52 55 1234 5678' };

  // Current active step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // PASO 1: Tu look (en lugar de servicio/diagnóstico técnico inicial)
  const [selectedLook, setSelectedLook] = useState<LookType | null>(null);
  const [extensionLength, setExtensionLength] = useState<ExtensionLengthOption>('medium');
  const [extensionTech, setExtensionTech] = useState<ExtensionTechOption>('soft_gel');
  const [colorSubType, setColorSubType] = useState<ColorSubTypeOption>('semi');
  const [refillTimeOption, setRefillTimeOption] = useState<RefillTimeOption>('up_to_3_weeks');
  const [isRepeated, setIsRepeated] = useState<boolean>(false);

  // Clienta recurrente data & repetición instantánea
  const lastAppointment: LastAppointmentData = useMemo(() => ({
    id: 'apt-prev-valeria',
    dateStr: 'Hace 2 semanas',
    serviceTitle: 'Set Soft Gel (Medio)',
    technique: 'Soft Gel (Gel-X)',
    shape: 'Almendra',
    length: 'Medio (M)',
    finish: 'Glazed Chrome',
    colorName: 'Nude Rosé Ballet',
    staffName: 'Andrea Morales',
    priceMXN: 680,
    weeksAgo: 2
  }), []);

  const handleRepeatLastAppointment = () => {
    setSelectedLook('extensions');
    setExtensionTech('soft_gel');
    setExtensionLength('medium');
    setSelectedShape('almond');
    setSelectedFinish('glazed');
    setSelectedColorHex('#F3C5BA');
    setSelectedColorName('Nude Rosé Ballet');
    setCurrentWear('none');
    setIsRepeated(true);
    toast.success('¡Cita anterior precargada!', {
      description: 'Set Soft Gel Medio · Almendra · Glazed Chrome · Andrea M.'
    });
  };

  // PASO 2: Lo que traes puesto
  const [currentWear, setCurrentWear] = useState<CurrentWearType | null>(null);

  // STEP 3: Estética & Diseño (Selección de arte / foto de inspiración)
  const [selectedArtTier, setSelectedArtTier] = useState<NailArtTierOption | null>(null);
  const [selectedInspoPreset, setSelectedInspoPreset] = useState<string | null>(null);
  const [inspoPhotoUrl, setInspoPhotoUrl] = useState<string | null>(null);
  const [inspoPhotoName, setInspoPhotoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personalización: Silueta, Largo, Acabado, Color y Extras
  const [selectedShape, setSelectedShape] = useState<NailShapeType>('almond');
  const [selectedLength, setSelectedLength] = useState<NailLengthType>('medium');
  const [selectedFinish, setSelectedFinish] = useState<NailFinishType>('glossy');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#F3C5BA');
  const [selectedColorName, setSelectedColorName] = useState<string>('Nude Rosé Ballet');
  const [selectedTipHex, setSelectedTipHex] = useState<string>('#FFFFFF');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [designNotes, setDesignNotes] = useState<string>('');
  const personalizationStepRef = useRef<BookingStylePersonalizationStepHandle>(null);

  const toggleExtra = (extraId: string) => {
    triggerSelectionVibration();
    setSelectedExtras(prev => 
      prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
    );
  };

  // STEP 4: Staff, Schedule & Confirmation
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00');
  const [depositPercentage, setDepositPercentage] = useState<number>(50); // 30, 50, 100
  const [clientName, setClientName] = useState<string>(currentClient.name || 'Valeria Arriaza');
  const [clientPhone, setClientPhone] = useState<string>(currentClient.phone || '+52 55 1234 5678');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdAppointmentData, setCreatedAppointmentData] = useState<any | null>(null);

  // Flags lógicos clave
  const isOnlyRemoval = selectedLook === 'removal';
  const isRefill = selectedLook === 'refill' && refillTimeOption === 'up_to_3_weeks';
  const isConvertedToNewSet = selectedLook === 'refill' && refillTimeOption === 'more_than_3_weeks';
  const isNaturalManicure = selectedLook === 'care' || selectedLook === 'color';
  const isExtension = selectedLook === 'extensions' || isConvertedToNewSet;

  // Extras calculations
  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, extraId) => {
      const item = SALON_EXTRAS_CATALOG.find(e => e.id === extraId);
      return sum + (item ? item.priceMXN : 0);
    }, 0);
  }, [selectedExtras]);

  const extrasDurationMins = useMemo(() => {
    return selectedExtras.reduce((sum, extraId) => {
      const item = SALON_EXTRAS_CATALOG.find(e => e.id === extraId);
      return sum + (item ? item.durationMins : 0);
    }, 0);
  }, [selectedExtras]);

  // Cálculo de Look Base (Paso 1)
  const lookPriceCalc = useMemo(() => {
    if (!selectedLook) return 0;
    if (selectedLook === 'care') return 280;
    if (selectedLook === 'color') return colorSubType === 'rubber' ? 440 : 380;
    if (selectedLook === 'extensions') {
      return extensionTech === 'soft_gel' ? 480 : extensionTech === 'acrylic' ? 540 : 560;
    }
    if (selectedLook === 'refill') {
      if (refillTimeOption === 'more_than_3_weeks') return 480;
      return 340;
    }
    return 180; // removal
  }, [selectedLook, colorSubType, extensionTech, refillTimeOption]);

  const lookDurationCalc = useMemo(() => {
    if (!selectedLook) return 0;
    if (selectedLook === 'care') return 40;
    if (selectedLook === 'color') return colorSubType === 'rubber' ? 70 : 55;
    if (selectedLook === 'extensions') {
      return extensionTech === 'soft_gel' ? 70 : extensionTech === 'acrylic' ? 95 : 85;
    }
    if (selectedLook === 'refill') {
      if (refillTimeOption === 'more_than_3_weeks') return 85;
      return 60;
    }
    return 35; // removal
  }, [selectedLook, colorSubType, extensionTech, refillTimeOption]);

  // Multiplicador de Largo para extensiones (eliminado)
  const lengthDuration = 0;
  const lengthPrice = 0;

  // Cálculo de Lo Que Traes Puesto / Retiro (Paso 2)
  const wearOption = useMemo(() => {
    if (!currentWear) {
      return {
        id: 'none' as CurrentWearType,
        title: 'Por seleccionar',
        subtitle: 'Sin selección previa',
        badge: 'Sin costo adicional',
        durationMinutes: 0,
        costMXN: 0,
        isZeroRemoval: true,
        icon: Sparkles,
        iconBg: '',
        iconColor: ''
      };
    }
    return CURRENT_WEAR_CATALOG.find(w => w.id === currentWear) || CURRENT_WEAR_CATALOG[0];
  }, [currentWear]);

  const wearPrice = wearOption.costMXN;
  const wearDuration = wearOption.durationMinutes;

  // Step 3 Art calculation
  const selectedArtTierObj = selectedArtTier 
    ? (NAIL_ART_TIER_OPTIONS.find(a => a.id === selectedArtTier) || null)
    : null;
  const artPrice = (isOnlyRemoval || !selectedArtTierObj) ? 0 : selectedArtTierObj.priceMXN;
  const artDuration = (isOnlyRemoval || !selectedArtTierObj) ? 0 : selectedArtTierObj.durationMinutes;

  // Selected Objects
  const selectedShapeObj = SHAPE_OPTIONS.find(s => s.id === selectedShape) || SHAPE_OPTIONS[0];
  const selectedLengthObj = LENGTH_OPTIONS.find(l => l.id === (extensionLength === 'long' ? 'long' : extensionLength === 'medium' ? 'medium' : 'short')) || LENGTH_OPTIONS[1];
  const selectedFinishObj = FINISH_OPTIONS.find(f => f.id === selectedFinish) || FINISH_OPTIONS[0];

  const finishPrice = selectedFinish === 'glazed' ? 50 : selectedFinish === 'matte' ? 40 : selectedFinish === 'cat_eye' ? 60 : selectedFinish === 'french' ? 50 : 0;

  // Tiempo neto de servicio en cabina (para el cliente)
  const serviceDurationMinutes = Math.max(
    30, 
    lookDurationCalc + wearDuration + artDuration + extrasDurationMins
  );
  
  // Tiempo total bloqueado en agenda (incluye buffer de sanitización y preparación de instrumental)
  const totalBlockedMinutes = serviceDurationMinutes + SANITIZATION_BUFFER_MINUTES;
  const totalDurationMinutes = serviceDurationMinutes;

  // 2. Price Calculation (MXN)
  const totalPriceMXN = lookPriceCalc + wearPrice + finishPrice + artPrice + extrasTotal;

  // Anticipo / Depósito de Garantía (30% - 50% - 100%)
  const depositAmountMXN = isOnlyRemoval ? 100 : Math.round((totalPriceMXN * depositPercentage) / 100);
  const remainingBalanceMXN = Math.max(0, totalPriceMXN - depositAmountMXN);

  // Dynamic available continuous time slots based on totalBlockedMinutes
  const availableSlots = useMemo(() => {
    const baseSlots = ['09:30', '11:00', '13:00', '15:00', '16:45', '18:15'];
    return baseSlots.map(time => ({
      startTime: time,
      endTime: calculateEndTime(time, serviceDurationMinutes),
      blockedUntil: calculateEndTime(time, totalBlockedMinutes),
      available: true
    }));
  }, [serviceDurationMinutes, totalBlockedMinutes]);

  // Staff options
  const staffOptions = useMemo(() => [
    { id: 'any', name: 'Cualquier Especialista Disponible', role: 'Primera técnica libre', rating: 4.9, avatar: '' },
    ...STAFF_MEMBERS.map(m => ({
      id: m.id,
      name: m.name,
      role: m.role,
      rating: m.rating,
      avatar: m.avatar
    }))
  ], []);

  const selectedStaff = staffOptions.find(s => s.id === selectedStaffId) || staffOptions[0];

  // Full service title matching daily language look
  const fullServiceTitle = useMemo(() => {
    if (!selectedLook) return 'Por seleccionar';
    if (selectedLook === 'care') return 'Manicura Rusa / Uñas Cuidadas';
    if (selectedLook === 'color') {
      return colorSubType === 'rubber' 
        ? 'Nivelación Rubber Base (Color que dure)' 
        : 'Esmaltado Semipermanente (Color que dure)';
    }
    if (selectedLook === 'extensions') {
      const techName = extensionTech === 'soft_gel' ? 'Soft Gel (Gel-X)' : extensionTech === 'acrylic' ? 'Acrílico Escultural' : 'Polygel';
      return `Extensiones ${techName}`;
    }
    if (selectedLook === 'refill') {
      if (refillTimeOption === 'more_than_3_weeks') {
        return 'Set Nuevo (por crecimiento >3 semanas)';
      }
      return 'Relleno de Estructura (≤3 semanas)';
    }
    return 'Solo Retiro + Manicura de Descanso';
  }, [selectedLook, colorSubType, extensionTech, refillTimeOption]);

  const priceEstimateObj: PriceEstimate = {
    totalMXN: totalPriceMXN,
    depositMXN: depositAmountMXN,
    minMXN: totalPriceMXN,
    maxMXN: totalPriceMXN,
    isEstimateOnly: false,
    breakdown: [
      { label: fullServiceTitle, amountMXN: lookPriceCalc },
      ...(wearPrice > 0 ? [{ label: `Retiro (${wearOption.title})`, amountMXN: wearPrice }] : []),
      ...(artPrice > 0 && selectedArtTierObj ? [{ label: `Nail Art (${selectedArtTierObj.title})`, amountMXN: artPrice }] : []),
      ...(finishPrice > 0 ? [{ label: `Efecto (${selectedFinishObj.label})`, amountMXN: finishPrice }] : []),
      ...(extrasTotal > 0 ? [{ label: `Extras (${selectedExtras.length})`, amountMXN: extrasTotal }] : [])
    ]
  };

  // Summary Items for Live Summary in Sidebar
  const summaryItems: SummaryItem[] = [
    { label: 'Look', value: fullServiceTitle },
    { 
      label: 'Lo que traes puesto', 
      value: wearOption.title,
      detail: wearOption.durationMinutes > 0 ? `+${wearOption.durationMinutes} min` : 'Sin retiro'
    },
    ...(wearOption.isSafetyBuffer ? [{
      label: 'Margen seguridad',
      value: '+30 min en cabina'
    }] : []),
    ...(!isOnlyRemoval && selectedArtTierObj ? [{ label: 'Nail Art', value: selectedArtTierObj.title, detail: artPrice > 0 ? `+$${artPrice}` : 'Incluido' }] : []),
    ...(!isOnlyRemoval ? [{ label: 'Silueta', value: selectedShapeObj.label }] : []),
    ...(!isOnlyRemoval ? [{ label: 'Acabado', value: selectedFinishObj.label }] : []),
    ...(!isOnlyRemoval ? [{ label: 'Color', value: selectedColorName }] : []),
    ...(selectedExtras.length > 0 ? [{ label: 'Extras', value: `${selectedExtras.length} seleccionado(s)`, detail: `+$${extrasTotal}` }] : []),
    { label: 'Duración estimada', value: formatMinutesHuman(serviceDurationMinutes) },
    { label: `Anticipo (${depositPercentage}%)`, value: `$${depositAmountMXN} MXN` }
  ];

  // 3D Live Visualizer Config matching AI Quote Flow
  const livePreviewData = {
    shape: isOnlyRemoval ? 'squoval' : selectedShape,
    length: isExtension ? selectedLength : 'short',
    colorName: isOnlyRemoval ? 'Tratamiento Nutritivo' : selectedColorName,
    colorHex: isOnlyRemoval ? '#F2E8E5' : selectedColorHex,
    finish: isOnlyRemoval ? 'glossy' : selectedFinish,
    artStyle: selectedArtTierObj ? selectedArtTierObj.title : 'Por seleccionar',
    serviceTitle: fullServiceTitle,
    estimatedPrice: totalPriceMXN,
    estimatedDuration: serviceDurationMinutes
  };

  // Explicit 4-Step Navigation Handlers
  const goToNextStep = () => {
    triggerSelectionVibration();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleConfirmAppointment();
    }
  };

  const goToPreviousStep = () => {
    triggerSelectionVibration();
    if (currentStep === 1) {
      if (onCancel) onCancel();
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleNextStep = goToNextStep;
  const handlePrevStep = goToPreviousStep;

  const nextLabel = useMemo(() => {
    if (currentStep === 4) {
      return isSubmitting ? 'Confirmando...' : 'Confirmar Cita';
    }
    return 'Continuar';
  }, [currentStep, isSubmitting]);

  const canNext = currentStep === 1 
    ? Boolean(selectedLook || isRepeated) 
    : currentStep === 2 
    ? Boolean(currentWear) 
    : currentStep === 3
    ? Boolean(selectedArtTier)
    : true;

  const handleConfirmAppointment = () => {
    setIsSubmitting(true);
    triggerConfirmedVibration();

    setTimeout(() => {
      const notesArray: string[] = [];
      notesArray.push(`Look: ${fullServiceTitle}`);
      notesArray.push(`Lo que trae puesto: ${wearOption.title} (+${wearOption.durationMinutes} min)`);
      if (wearOption.isSafetyBuffer) {
        notesArray.push('Margen de seguridad: +30 min en cabina');
      }
      if (isConvertedToNewSet) {
        notesArray.push('Actualizado a Set Nuevo (>3 semanas de crecimiento)');
      }
      if (isExtension) {
        notesArray.push(`Técnica: ${extensionTech}`);
        notesArray.push(`Silueta: ${selectedShapeObj.label}`);
      }
      if (!isOnlyRemoval) {
        notesArray.push(`Acabado: ${selectedFinishObj.label}`);
        notesArray.push(`Color: ${selectedColorName}`);
        if (selectedArtTierObj) {
          notesArray.push(`Arte: ${selectedArtTierObj.title}`);
        }
      }
      if (selectedExtras.length > 0) {
        const extraNames = selectedExtras.map(id => SALON_EXTRAS_CATALOG.find(e => e.id === id)?.name || id).join(', ');
        notesArray.push(`Extras: ${extraNames}`);
      }
      if (designNotes.trim()) notesArray.push(`Detalle: ${designNotes.trim()}`);
      notesArray.push(`Buffer Sanitización: +${SANITIZATION_BUFFER_MINUTES} min incluido`);
      notesArray.push(`Anticipo programado: $${depositAmountMXN} MXN (${depositPercentage}%)`);

      let catalogServiceId = 'e1';
      if (isOnlyRemoval) {
        catalogServiceId = 's2';
      } else if (isRefill) {
        catalogServiceId = 'e3';
      } else if (selectedLook === 'care') {
        catalogServiceId = 'm1';
      } else if (selectedLook === 'color') {
        catalogServiceId = colorSubType === 'rubber' ? 'm3' : 'm2';
      } else if (isExtension) {
        catalogServiceId = extensionTech === 'acrylic' ? 'e2' : 'e1';
      }

      const apt = {
        clientId: currentClient.id,
        serviceId: catalogServiceId,
        date: selectedDate,
        startTime: selectedTimeSlot,
        endTime: calculateEndTime(selectedTimeSlot, totalBlockedMinutes),
        status: 'confirmed' as const,
        notes: notesArray.join(' • ')
      };

      addAppointment(apt);

      setIsSubmitting(false);
      setCreatedAppointmentData({
        ...apt,
        totalPriceMXN,
        serviceDurationMinutes,
        totalBlockedMinutes,
        depositAmountMXN,
        remainingBalanceMXN,
        depositPercentage,
        staffName: selectedStaff.name,
        serviceName: fullServiceTitle
      });

      toast.success('¡Cita agendada con éxito!', {
        description: `${fullServiceTitle} • ${selectedDate} a las ${selectedTimeSlot} hrs.`
      });

      if (onSuccess) onSuccess();
    }, 600);
  };

  // Step Titles and Descriptions (Mapeo de 4 Pasos Exactos)
  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: '¿Qué te gustaría hacerte hoy?',
      subtitle: 'Elige tu look o repite tu última cita'
    },
    2: {
      title: 'Lo que traes puesto',
      subtitle: '¿Qué tienes actualmente en tus uñas?'
    },
    3: {
      title: 'Diseño & Nail Art',
      subtitle: isOnlyRemoval ? 'Tratamiento nutritivo y notas de cabina' : 'Elige el nivel de diseño, silueta, color y acabados'
    },
    4: {
      title: 'Fecha, Hora & Especialista',
      subtitle: 'Elige tu horario y asegura tu cita'
    }
  };

  // SUCCESS SCREEN - Unboxed with comprehensive breakdown & notifications
  if (createdAppointmentData) {
    const formattedDateFull = format(new Date(`${selectedDate}T12:00:00`), "EEEE d 'de' MMMM, yyyy", { locale: es });
    
    // WhatsApp pre-filled message
    const whatsappMessage = encodeURIComponent(
      `*Confirmación de Cita - Nail Studio*\n\n` +
      `*Cliente:* ${clientName}\n` +
      `*Servicio:* ${fullServiceTitle}\n` +
      `*Silueta:* ${selectedShapeObj.label}\n` +
      `*Acabado:* ${selectedFinishObj.label}\n` +
      `*Color:* ${selectedColorName}\n` +
      `${selectedExtras.length > 0 ? `*Extras:* ${selectedExtras.length} adicional(es)\n` : ''}` +
      `*Especialista:* ${selectedStaff.name}\n` +
      `*Fecha:* ${formattedDateFull}\n` +
      `*Horario:* ${selectedTimeSlot} a ${calculateEndTime(selectedTimeSlot, serviceDurationMinutes)} hrs\n` +
      `*Bioseguridad:* Buffer de sanitización de 15m garantizado\n\n` +
      `*Inversión Total:* $${totalPriceMXN} MXN\n` +
      `*Anticipo:* $${depositAmountMXN} MXN (${depositPercentage}%)\n` +
      `*Saldo pendiente en salón:* $${remainingBalanceMXN} MXN\n\n` +
      `¡Nos vemos pronto!`
    );

    return (
      <div className="w-full max-w-xl mx-auto py-6 sm:py-10 text-center relative">
        {/* Dynamic Ambient Color Orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-pink-400/15 blur-3xl pointer-events-none -z-10" />

        <div className="liquid-glass rounded-[32px] p-6 sm:p-9 relative overflow-hidden backdrop-blur-2xl text-center space-y-6 shadow-2xl">
          <div className="size-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="size-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider inline-block">
              Cita Reservada y Confirmada
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              ¡Tu cita está registrada en la agenda!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Te esperamos el <strong className="text-foreground">{formattedDateFull}</strong> a las <strong className="text-foreground">{selectedTimeSlot} hrs</strong> con <strong className="text-foreground">{selectedStaff.name}</strong>.
            </p>
          </div>

          {/* Detailed Breakdown Card in Liquid Glass Sub */}
          <div className="liquid-glass-sub p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] text-xs text-foreground space-y-2.5 text-left max-w-md mx-auto shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Desglose de la Reserva</span>
              <span className="text-[10.5px] font-bold text-primary">ID #{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Servicio principal:</span>
              <span className="font-semibold text-foreground">{fullServiceTitle}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Silueta y Acabado:</span>
              <span className="font-semibold text-foreground">{selectedShapeObj.label} · {selectedFinishObj.label}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Tonalidad:</span>
              <span className="font-semibold text-foreground">{selectedColorName}</span>
            </div>

            {selectedExtras.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Extras incluidos:</span>
                <span className="font-semibold text-primary">{selectedExtras.length} adicional(es) (+${extrasTotal} MXN)</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo neto en cabina:</span>
              <span className="font-bold text-foreground">{formatMinutesHuman(serviceDurationMinutes)}</span>
            </div>

            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="size-3.5 stroke-[2.25]" />
                Buffer de Sanitización:
              </span>
              <span className="font-bold">+15 min (Incluido)</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-muted-foreground font-medium">Total del servicio:</span>
              <span className="font-bold text-foreground text-sm">${totalPriceMXN} MXN</span>
            </div>

            <div className="flex justify-between text-primary">
              <span className="font-semibold">Anticipo de Garantía ({depositPercentage}%):</span>
              <span className="font-bold text-sm">${depositAmountMXN} MXN</span>
            </div>

            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>Saldo a liquidar en salón:</span>
              <span className="font-bold text-foreground">${remainingBalanceMXN} MXN</span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp and Navigation */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 h-11 px-6 rounded-full apple-button bg-emerald-600 hover:brightness-105 font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/25 transition-all"
            >
              <Smartphone className="size-4 stroke-[2.25]" />
              <span>Enviar a WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => navigate('/agenda')}
              className="w-full sm:w-auto flex-1 h-11 px-6 rounded-full apple-button bg-primary hover:brightness-105 font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/25 transition-all"
            >
              <span>Ver en Agenda</span>
              <ArrowRight className="size-4 stroke-[2.25]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/inicio')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-block"
          >
            Volver a la Pantalla de Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <WizardShell
      currentStep={currentStep}
      totalSteps={4}
      stepTitle={stepTitles[currentStep]?.title || 'Agendar Cita'}
      stepSubtitle={stepTitles[currentStep]?.subtitle}
      onBack={currentStep > 1 ? handlePrevStep : onCancel}
      onNext={handleNextStep}
      canNext={canNext}
      nextLabel={nextLabel}
      isSubmitting={isSubmitting}
      summaryItems={summaryItems}
      priceEstimate={priceEstimateObj}
      livePreviewConfig={livePreviewData}
      showNavigation={true}
    >
      <AnimatePresence mode="wait">
        {/* ---------------------------------------------------- */}
        {/* PASO 1: Tu look (en lugar de servicio/diagnóstico)  */}
        {/* ---------------------------------------------------- */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-left"
          >
            <LookSelectionStep
              selectedLook={selectedLook}
              onSelectLook={(look) => {
                setSelectedLook(look);
                setIsRepeated(false);
              }}
              extensionTech={extensionTech}
              onSelectExtensionTech={setExtensionTech}
              colorSubType={colorSubType}
              onSelectColorSubType={setColorSubType}
              refillTimeOption={refillTimeOption}
              onSelectRefillTimeOption={setRefillTimeOption}
              isConvertedToNewSet={isConvertedToNewSet}
              lastAppointment={lastAppointment}
              onRepeatLastAppointment={handleRepeatLastAppointment}
              isRepeated={isRepeated}
            />
          </motion.div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PASO 2: Lo que traes puesto (después del deseo)      */}
        {/* ---------------------------------------------------- */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-left"
          >
            <CurrentWearStep
              currentWear={currentWear}
              onSelectCurrentWear={setCurrentWear}
              onAutoAdvanceIfNone={goToNextStep}
              isOnlyRemovalService={isOnlyRemoval}
              selectedLook={selectedLook}
              fullServiceTitle={fullServiceTitle}
              lookPrice={lookPriceCalc}
              lookDuration={lookDurationCalc}
              onChangeLook={() => setCurrentStep(1)}
              onContinue={goToNextStep}
            />
          </motion.div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PASO 3: Decoración & Nail Art                       */}
        {/* ---------------------------------------------------- */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-left"
          >
            <DesignNailArtStep
              selectedArtTier={selectedArtTier}
              onSelectArtTier={setSelectedArtTier}
              selectedFinish={selectedFinish}
              onSelectFinish={setSelectedFinish}
              selectedColorHex={selectedColorHex}
              selectedColorName={selectedColorName}
              onSelectColor={(hex, name) => {
                setSelectedColorHex(hex);
                setSelectedColorName(name);
              }}
              selectedExtras={selectedExtras}
              onToggleExtra={toggleExtra}
              designNotes={designNotes}
              onChangeDesignNotes={setDesignNotes}
              fullServiceTitle={fullServiceTitle}
              lookPrice={lookPriceCalc}
              lookDuration={lookDurationCalc}
              currentWear={currentWear}
              wearOption={wearOption}
              serviceDurationMinutes={serviceDurationMinutes}
              totalPriceMXN={totalPriceMXN}
              selectedLook={selectedLook}
              onChangePreviousStep={() => setCurrentStep(2)}
              onContinue={goToNextStep}
            />
          </motion.div>
        )}

      {/* ---------------------------------------------------- */}
      {/* STEP 4: Agenda y Confirmación (Especialista & Horario) */}
      {/* ---------------------------------------------------- */}
      {currentStep === 4 && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-5 text-left w-full max-w-lg md:max-w-none mx-auto"
        >
          {/* Header Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-card to-card border border-primary/20 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-primary block">
                Resumen de tu Cita
              </span>
              <h3 className="text-sm sm:text-base font-bold text-foreground truncate mt-0.5">
                {fullServiceTitle}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-medium">
                <span>~{formatMinutesHuman(serviceDurationMinutes)} en cabina</span>
                <span>·</span>
                <span className="font-bold text-foreground">${totalPriceMXN} MXN</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerSelectionVibration();
                const quoteShareText = encodeURIComponent(
                  `*Cotización - Emme Studio*\n\n` +
                  `*Servicio:* ${fullServiceTitle}\n` +
                  `*Silueta:* ${selectedShapeObj.label}\n` +
                  `${isExtension ? `*Largo:* ${selectedLengthObj.label} (${selectedLengthObj.mm})\n` : ''}` +
                  `*Acabado:* ${selectedFinishObj.label}\n` +
                  `*Color:* ${selectedColorName}\n` +
                  `${selectedExtras.length > 0 ? `*Extras:* ${selectedExtras.length} adicional(es)\n` : ''}` +
                  `*Total:* $${totalPriceMXN} MXN\n` +
                  `*Duración:* ~${formatMinutesHuman(serviceDurationMinutes)}`
                );
                window.open(`https://wa.me/?text=${quoteShareText}`, '_blank');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-card hover:bg-secondary px-3 py-2 rounded-xl border border-border transition-colors cursor-pointer shrink-0"
              title="Compartir cotización por WhatsApp"
            >
              <Share2 className="size-3.5" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>

          {/* Specialist Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Especialista
              </label>
              <span className="text-xs font-semibold text-primary">
                {selectedStaff.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {staffOptions.map((st) => {
                const isSelected = selectedStaffId === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedStaffId(st.id);
                    }}
                    className={cn(
                      "p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left active:scale-[0.99]",
                      isSelected 
                        ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-xs" 
                        : "bg-card/80 hover:bg-secondary/40 border-border/80 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "size-9 rounded-xl flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      )}>
                        {st.id === 'any' ? <Users className="size-4.5" /> : <User className="size-4.5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                          {st.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate font-medium">
                          {st.role}
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "size-5 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all",
                      isSelected ? "bg-primary text-white shadow-xs" : "border-2 border-muted-foreground/30 bg-background/50"
                    )}>
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-2.5 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Fecha
              </label>
              <span className="text-xs font-semibold text-primary capitalize">
                {format(new Date(`${selectedDate}T12:00:00`), "EEEE d 'de' MMMM", { locale: es })}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
              {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                const dateObj = addDays(new Date(), offset);
                const dateStr = format(dateObj, 'yyyy-MM-dd');
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedDate(dateStr);
                    }}
                    className={cn(
                      "flex-1 min-w-[68px] p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 active:scale-95",
                      isSelected 
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/25" 
                        : "bg-card/80 hover:bg-secondary/40 border-border/80 text-foreground"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] uppercase font-bold",
                      isSelected ? "text-white/90" : "text-muted-foreground"
                    )}>
                      {offset === 0 ? 'Hoy' : format(dateObj, 'EEE', { locale: es })}
                    </span>
                    <span className="text-base font-black">
                      {format(dateObj, 'd')}
                    </span>
                    <span className={cn(
                      "text-[9px] uppercase font-semibold",
                      isSelected ? "text-white/80" : "text-muted-foreground/70"
                    )}>
                      {format(dateObj, 'MMM', { locale: es })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="space-y-2.5 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Horario Disponible
              </label>
              <span className="text-xs font-semibold text-primary">
                {selectedTimeSlot} hrs
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.startTime;
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedTimeSlot(slot.startTime);
                    }}
                    className={cn(
                      "py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs active:scale-95",
                      isSelected 
                        ? "bg-primary text-white border-primary shadow-xs" 
                        : "bg-card/80 hover:bg-secondary/40 border-border/80 text-foreground"
                    )}
                  >
                    {slot.startTime}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anticipo & Client details */}
          <div className="pt-3 border-t border-border/40 space-y-4">
            {/* Trust badge anticipo */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11.5px] leading-relaxed">
                <strong>Garantía de cita:</strong> Tu anticipo del {depositPercentage}% (${depositAmountMXN} MXN) asegura el horario exclusivo de la manicurista y se descuenta del total. El saldo de ${remainingBalanceMXN} MXN se abona en cabina.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Porcentaje de Anticipo
                </label>
                <span className="text-xs font-bold text-primary">
                  ${depositAmountMXN} MXN ({depositPercentage}%)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([30, 50, 100] as const).map((pct) => {
                  const isSelected = depositPercentage === pct;
                  const calcAmt = Math.round((totalPriceMXN * pct) / 100);
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        triggerSelectionVibration();
                        setDepositPercentage(pct);
                      }}
                      className={cn(
                        "py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center active:scale-95",
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-card/80 hover:bg-secondary/40 border-border/80 text-foreground"
                      )}
                    >
                      <span className="text-xs font-bold">
                        {pct}% {pct === 50 && <span className="text-[10px] font-normal opacity-90">(Estándar)</span>}
                      </span>
                      <span className={cn("text-[11px] font-semibold mt-0.5", isSelected ? "text-white/90" : "text-muted-foreground")}>
                        ${calcAmt} MXN
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Datos de Contacto */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Datos de la Clienta
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="relative">
                  <User className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-2xs"
                  />
                </div>
                <div className="relative">
                  <Smartphone className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Teléfono / WhatsApp"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </WizardShell>
  );
}

export default DirectBookingFlow;
