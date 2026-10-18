import { NailCustomizerStep, NailCustomizerStepHandle } from '@/shared/components/NailCustomizerStep';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QUALIFIED_SERVICES, 
  calculateDeterministicQuote 
} from '@/domain/intent/service-catalog';
import { 
  QualifiedServiceDefinition, 
  ServiceConfiguration, 
  PriceAndDurationBreakdownItem
} from '@/domain/intent/types';
import { AiIntentResolver } from '@/domain/intent/ai-intent-resolver';
import { LiveBookingSummary } from '@/shared/components/LiveBookingSummary';
import { AvailabilitySelector, StaffOption, SALON_STAFF } from '@/shared/components/AvailabilitySelector';
import { 
  NailModelerVisualizerSVG,
  SingleNailMiniPreviewSVG,
  NailShapeType, 
  NailLengthType, 
  NailFinishType,
  FINISH_COLOR_PALETTES,
  NailColorOption,
  SkinToneType,
  AccentNailType,
  SKIN_TONES,
} from '@/shared/components/NailModelerVisualizerSVG';
import {
  PersonalizationStepTabs,
  ExtrasCategoryTabs,
} from '@/shared/components';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Camera, Clock, 
  ShieldCheck,
  Palette, Upload, Ruler,
  Sparkle, Flame, CheckCircle, Leaf, RotateCcw,
  QrCode, Download, MessageSquare, Gem, HeartHandshake,
  ChevronRight, ChevronLeft, CheckCircle2,
  Layers, Eye, Feather, Footprints, Flower2,
  LayoutGrid, List, Star, SlidersHorizontal
} from 'lucide-react';
import { 
  SalonPaymentCheckoutWidget, 
  PaymentReceipt, 
  triggerHapticFeedback 
} from '@/shared/components/SalonPaymentCheckoutWidget';
import { 
  triggerStepVibration, 
  triggerSelectionVibration, 
  triggerConfirmedVibration 
} from '@/shared/utils/haptics';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@emme/ui/lib/utils';
import { useApp } from '@/app/AppContext';
import { NailCategoryExtractionCard } from '@/features/assisted-design/ui/NailCategoryExtractionCard';
import { NailPhotoVisualFlow, RemovalOptionType } from '@/features/assisted-design/ui/NailPhotoVisualFlow';
import { NailShape } from '@/shared/components/NailShapeSelector';
import { NailLength } from '@/shared/components/NailLengthSelector';
import { NailPhotoDetailedAnalysis } from '@/domain/quotes/entities/Inspiration';
import { NailPhotoDetailProcessor } from '@/domain/quotes/infrastructure/ai/nail-photo-detail-processor';
import { LashConfigurator } from '@/features/lashes/components/LashConfigurator';

export interface ServiceQualificationEngineProps {
  initialInputMethod?: 'direct' | 'photo' | 'advisor';
  initialServiceId?: string;
  initialPhotoUrl?: string;
  onBookingCompleted?: () => void;
}

// 5 Global Steps (Clear, balanced, and UX-first)
export type GlobalStep = 
  | 'step-service'       // 1. Técnica Base o Foto
  | 'step-customizer'    // 2. Personalización & Extras (Forma -> Largo -> Acabado -> Tono -> Extras [Retiro, Nail Art, Spa])
  | 'step-availability'  // 3. Agenda & Especialista (Artista -> Fecha -> Turno)
  | 'step-contact'       // 4. Datos de Contacto & WhatsApp
  | 'step-payment'       // 5. Pago Seguro de Anticipo
  | 'step-confirmation'; // Pase Confirmado

const STEP_DEFINITIONS: Record<GlobalStep, { num: number; title: string; subtitle: string }> = {
  'step-service': { num: 1, title: 'Técnica & Servicio Base', subtitle: 'Selecciona técnica o sube tu foto con IA' },
  'step-customizer': { num: 2, title: 'Personalización & Extras', subtitle: 'Diseño 3D, tonos, retiro, nail art y spa' },
  'step-availability': { num: 3, title: 'Fecha & Especialista', subtitle: 'Selecciona tu especialista, día y turno en agenda' },
  'step-contact': { num: 4, title: 'Datos de Contacto & WhatsApp', subtitle: 'Envío instantáneo de confirmación y Pase VIP' },
  'step-payment': { num: 5, title: 'Pago Seguro de Anticipo', subtitle: 'Garantiza tu espacio en agenda con pago protegido' },
  'step-confirmation': { num: 5, title: 'Pase Confirmado', subtitle: 'Cita agendada exitosamente' },
};

// Shape Visual Definitions (Sorted by popularity in Mexican salons)
export const SHAPE_OPTIONS: { id: NailShapeType; label: string; vibe: string; popular?: boolean; badge?: string }[] = [
  { id: 'almond', label: 'Almendra', vibe: 'Elegante, estiliza y afina los dedos', popular: true, badge: 'Top #1 en México' },
  { id: 'square', label: 'Cuadrada', vibe: 'Clásica, líneas rectas definidas y fuerte', popular: true },
  { id: 'coffin', label: 'Coffin / Ballerina', vibe: 'Tendencia moderna, cónica con punta recta', popular: true, badge: 'Tendencia' },
  { id: 'squoval', label: 'Squoval', vibe: 'Híbrida cuadrada con bordes redondeados' },
  { id: 'oval', label: 'Ovalada', vibe: 'Suave, aspecto natural y femenino' },
  { id: 'stiletto', label: 'Stiletto', vibe: 'Audaz, punta afilada de alto impacto' },
];

// Length Visual Definitions
export const LENGTH_OPTIONS: { id: NailLengthType; label: string; mm: string; vibe: string; popular?: boolean; badge?: string }[] = [
  { id: 'medium', label: 'Mediana', mm: '~6-8 mm', vibe: 'Equilibrio perfecto entre elegancia y durabilidad', popular: true, badge: 'Más Pedida' },
  { id: 'short', label: 'Corta / Natural', mm: '~2-3 mm', vibe: 'Práctica, cómoda para teclear y día a día' },
  { id: 'long', label: 'Larga', mm: '~10-12 mm', vibe: 'Estiliza visualmente la mano para diseño' },
  { id: 'xl', label: 'Extra Larga (XL)', mm: '~15+ mm', vibe: 'Estructural, lienzo amplio para nail art pro' },
];

// Finish Optical Definitions
export const FINISH_OPTIONS: { id: NailFinishType; label: string; vibe: string; badge?: string; priceDelta: string }[] = [
  { id: 'glossy', label: 'Glossy Espejo', vibe: 'Brillo cristal de alta duración y sellado UV', priceDelta: 'Incluido' },
  { id: 'glazed', label: 'Glazed Donut Chrome', vibe: 'Reflejo perla tornasol estilo Hailey Bieber', badge: 'Tendencia', priceDelta: '+$50' },
  { id: 'matte', label: 'Velvet Mate', vibe: 'Textura aterciopelada suave anti-huellas', priceDelta: '+$40' },
  { id: 'cat_eye', label: 'Cat-Eye 9D Velvet', vibe: 'Destellos magnéticos multidimensionales', badge: 'Exclusivo', priceDelta: '+$60' },
  { id: 'french', label: 'French Clásico & Micro', vibe: 'Sonrisa delineada a mano alzada', priceDelta: '+$50' },
];

export interface SalonExtraItem {
  id: string;
  name: string;
  category: 'removal' | 'nail_art' | 'spa_care';
  categoryLabel: string;
  description: string;
  priceMXN: number;
  durationMins: number;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SALON_EXTRAS_CATALOG: SalonExtraItem[] = [
  {
    id: 'extra_removal_acrylic',
    name: 'Retiro de Set Previo (Acrílico / Escultural)',
    category: 'removal',
    categoryLabel: 'Retiro de Set Previo',
    description: 'Remoción cuidadosa con torno profesional y acetona pura para proteger la uña natural',
    priceMXN: 120,
    durationMins: 25,
    icon: RotateCcw
  },
  {
    id: 'extra_removal_gelx',
    name: 'Retiro de Set Previo (Gel-X / Rubber / Semipermanente)',
    category: 'removal',
    categoryLabel: 'Retiro de Set Previo',
    description: 'Disolución rápida y pulido suave sin limado agresivo',
    priceMXN: 80,
    durationMins: 15,
    icon: RotateCcw
  },
  {
    id: 'extra_crystals_swarovski',
    name: 'Cristales & Pedrería Swarovski (4 uñas)',
    category: 'nail_art',
    categoryLabel: 'Nail Art & Detalles',
    description: 'Gemas facetadas de alto brillo adheridas con gel de construcción ultra resistente',
    priceMXN: 90,
    durationMins: 15,
    badge: 'Popular',
    icon: Gem
  },
  {
    id: 'extra_gold_foil',
    name: 'Foil de Oro / Plata Encapsulado',
    category: 'nail_art',
    categoryLabel: 'Nail Art & Detalles',
    description: 'Acentos dorados, plata o rose-gold encapsulados con brillo sutil',
    priceMXN: 60,
    durationMins: 10,
    icon: Sparkles
  },
  {
    id: 'extra_cateye_focus',
    name: 'Cat-Eye 9D en Dedos Acento',
    category: 'nail_art',
    categoryLabel: 'Nail Art & Detalles',
    description: 'Haz de luz magnético aterciopelado en dedos anulares',
    priceMXN: 70,
    durationMins: 10,
    icon: Flame
  },
  {
    id: 'extra_keratin_cuticle',
    name: 'Baño de Keratina & Cuticle Care',
    category: 'spa_care',
    categoryLabel: 'Tratamientos & Cuidado Spa',
    description: 'Nutrición profunda para fortalecer uñas quebradizas y sellar cutículas',
    priceMXN: 50,
    durationMins: 10,
    icon: Leaf
  },
  {
    id: 'extra_jelly_spa',
    name: 'Jelly Spa Exfoliación Relajante',
    category: 'spa_care',
    categoryLabel: 'Tratamientos & Cuidado Spa',
    description: 'Baño aromaterapéutico gelatinoso con sales minerales y masaje hidratante',
    priceMXN: 140,
    durationMins: 15,
    badge: 'Máximo Confort',
    icon: HeartHandshake
  }
];

export interface CountryOption {
  code: string;
  flag: string;
  name: string;
  dialCode: string;
  digitLength: number;
  placeholder: string;
}

export const COUNTRIES_CATALOG: CountryOption[] = [
  { code: 'MX', flag: '🇲🇽', name: 'México', dialCode: '+52', digitLength: 10, placeholder: '55 1234 5678' },
  { code: 'US', flag: '🇺🇸', name: 'Estados Unidos', dialCode: '+1', digitLength: 10, placeholder: '415 555 2671' },
  { code: 'ES', flag: '🇪🇸', name: 'España', dialCode: '+34', digitLength: 9, placeholder: '612 345 678' },
  { code: 'CO', flag: '🇨🇴', name: 'Colombia', dialCode: '+57', digitLength: 10, placeholder: '300 123 4567' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina', dialCode: '+54', digitLength: 10, placeholder: '11 2345 6789' },
  { code: 'CL', flag: '🇨🇱', name: 'Chile', dialCode: '+56', digitLength: 9, placeholder: '9 1234 5678' },
];

export function ServiceQualificationEngine({
  initialInputMethod,
  initialServiceId,
  initialPhotoUrl,
  onBookingCompleted
}: ServiceQualificationEngineProps) {
  const nailCustomizerRef = useRef<NailCustomizerStepHandle>(null);
  const navigate = useNavigate();
  const { addAppointment } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const continuePaymentBtnRef = useRef<HTMLButtonElement>(null);

  // Global Step state (5 global steps)
  const [currentStep, setCurrentStep] = useState<GlobalStep>('step-service');

  // Category filter for service intake - Defaults to curated Top services to prevent massive overwhelming list
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'top' | 'all' | 'nails' | 'lashes' | 'brows' | 'pedicure' | 'spa'>('top');

  const filteredQualifiedServices = useMemo(() => {
    if (serviceCategoryFilter === 'top') {
      return QUALIFIED_SERVICES.filter(s => 
        ['structured-gel', 'gel-x-extensions', 'sculpted-acrylic', 'pedicure-spa-deluxe'].includes(s.id) ||
        s.badge?.includes('Top') || s.badge?.includes('Tendencia')
      ).slice(0, 4);
    }
    if (serviceCategoryFilter === 'all') return QUALIFIED_SERVICES;
    return QUALIFIED_SERVICES.filter(s => s.category === serviceCategoryFilter);
  }, [serviceCategoryFilter]);

  // Inner steps inside Step 2 (Forma -> Largo -> Acabado -> Color -> Extras)
  const [customizerSubStep, setCustomizerSubStep] = useState<'shape' | 'length' | 'finish' | 'color' | 'extras'>('shape');

  // Inner-inner steps inside Extras (Top Extras -> Retiro -> Nail Art -> Spa Care -> Ajustes)
  const [extrasSubStep, setExtrasSubStep] = useState<'popular' | 'removal' | 'nail_art' | 'spa_care' | 'simulator'>('popular');

  const [activeService, setActiveService] = useState<QualifiedServiceDefinition>(() => {
    if (initialServiceId) {
      return QUALIFIED_SERVICES.find(s => s.id === initialServiceId) || QUALIFIED_SERVICES[0];
    }
    return QUALIFIED_SERVICES[0];
  });

  const [config, setConfig] = useState<Partial<ServiceConfiguration>>({
    serviceId: activeService.id,
    serviceTitle: activeService.clientTitle,
    clientVibeLabel: activeService.clientTitle,
    length: 'short',
    shape: 'almond',
    finish: 'glossy',
    artTier: 0,
    artTags: [],
    hasExistingProduct: false,
    referenceImageUrl: initialPhotoUrl
  });

  // Color & Finish state for the Live SVG Modeler
  const [selectedFinish, setSelectedFinish] = useState<NailFinishType>('glossy');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#F3C5BA');
  const [selectedColorName, setSelectedColorName] = useState<string>('Nude Rosé Ballet');
  const [selectedTipHex, setSelectedTipHex] = useState<string>('#FFFFFF');

  // Extras State (Multiple Selection)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Booking Intake Mode: 'photo' prioritized for photo visual flow, 'catalog' for direct service selection
  const [intakeMethod, setIntakeMethod] = useState<'photo' | 'catalog'>(() => {
    if (initialInputMethod === 'direct') return 'catalog';
    return 'photo';
  });

  // Visualization Layout Preferences: 'sliding' (Deslizable) default across all deterministic steps with 3 view options
  const [serviceLayoutMode, setServiceLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');
  const [shapeLayoutMode, setShapeLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');
  const [lengthLayoutMode, setLengthLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');
  const [finishLayoutMode, setFinishLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');
  const [colorLayoutMode, setColorLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');
  const [extrasLayoutMode, setExtrasLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');
  
  const [simulatorSkinTone, setSimulatorSkinTone] = useState<SkinToneType>('fair');
  const [simulatorAccentNail, setSimulatorAccentNail] = useState<AccentNailType>('none');
  const [simulatorBeamAngle, setSimulatorBeamAngle] = useState(45);
  const [simulatorLightingMode, setSimulatorLightingMode] = useState<'studio' | 'sun' | 'flash'>('studio');

  // AI Photo state
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl || '');
  const [photoAnalysis, setPhotoAnalysis] = useState<NailPhotoDetailedAnalysis | null>(() => {
    if (initialPhotoUrl) {
      return NailPhotoDetailProcessor.analyzeNailPhoto({
        imageUrl: initialPhotoUrl,
        textDescription: 'Foto de referencia inicial',
      });
    }
    return null;
  });
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  // Availability & Staff State
  const [selectedStaff, setSelectedStaff] = useState<StaffOption | undefined>(() => SALON_STAFF[0]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>('11:00 AM');
  
  // WhatsApp / Contact State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES_CATALOG[0]);
  const [localPhoneDigits, setLocalPhoneDigits] = useState('5512345678');
  const [isPhoneValidated, setIsPhoneValidated] = useState(true);

  const [receiptData, setReceiptData] = useState<PaymentReceipt | null>(null);

  // Check phone validation
  useEffect(() => {
    const clean = localPhoneDigits.replace(/\D/g, '');
    const isValid = clean.length === selectedCountry.digitLength;
    setIsPhoneValidated(isValid);
    if (isValid && clean.length === selectedCountry.digitLength) {
      triggerHapticFeedback(15);
    }
  }, [localPhoneDigits, selectedCountry]);

  // Live Deterministic Quote Calculation with Extras
  const quote = useMemo(() => {
    const baseQuote = calculateDeterministicQuote(activeService, {
      ...config,
      finish: selectedFinish
    });

    const extrasTotal = selectedExtras.reduce((acc, id) => {
      const item = SALON_EXTRAS_CATALOG.find(e => e.id === id);
      return acc + (item?.priceMXN || 0);
    }, 0);

    const extrasDurationMins = selectedExtras.reduce((acc, id) => {
      const item = SALON_EXTRAS_CATALOG.find(e => e.id === id);
      return acc + (item?.durationMins || 0);
    }, 0);

    const extraBreakdownItems: PriceAndDurationBreakdownItem[] = selectedExtras.map(id => {
      const item = SALON_EXTRAS_CATALOG.find(e => e.id === id);
      return {
        label: item?.name || 'Extra Adicional',
        amountMXN: item?.priceMXN || 0,
        durationDeltaMinutes: item?.durationMins || 0
      };
    });

    return {
      ...baseQuote,
      totalPriceMXN: baseQuote.totalPriceMXN + extrasTotal,
      depositMXN: Math.max(150, Math.round((baseQuote.totalPriceMXN + extrasTotal) * 0.3)),
      totalDurationMinutes: baseQuote.durationMinutes + extrasDurationMins,
      durationFormatted: `${Math.floor((baseQuote.durationMinutes + extrasDurationMins) / 60)}h ${(baseQuote.durationMinutes + extrasDurationMins) % 60 > 0 ? `${(baseQuote.durationMinutes + extrasDurationMins) % 60}m` : ''}`.trim(),
      breakdown: [
        ...baseQuote.breakdown,
        ...extraBreakdownItems
      ]
    };
  }, [activeService, config, selectedFinish, selectedExtras]);

  // Palette sync with finish
  const currentPalette: NailColorOption[] = useMemo(() => {
    return FINISH_COLOR_PALETTES[selectedFinish] || FINISH_COLOR_PALETTES.glossy;
  }, [selectedFinish]);

  useEffect(() => {
    if (currentPalette && currentPalette.length > 0) {
      const exists = currentPalette.some(c => c.hex === selectedColorHex);
      if (!exists) {
        setSelectedColorHex(currentPalette[0].hex);
        setSelectedColorName(currentPalette[0].name);
        if (currentPalette[0].tipHex) {
          setSelectedTipHex(currentPalette[0].tipHex);
        }
      }
    }
  }, [selectedFinish, currentPalette]);

  // Handlers with Auto-Advance & Vibration
  const handleServiceSelect = (service: QualifiedServiceDefinition) => {
    triggerSelectionVibration();
    setActiveService(service);
    setConfig(prev => ({
      ...prev,
      serviceId: service.id,
      serviceTitle: service.clientTitle,
      clientVibeLabel: service.clientTitle
    }));
    setTimeout(() => {
      setCurrentStep('step-customizer');
      setCustomizerSubStep('shape');
    }, 200);
  };

  const handleShapeSelect = (shape: NailShapeType) => {
    triggerSelectionVibration();
    setConfig(prev => ({ ...prev, shape }));
    setTimeout(() => {
      setCustomizerSubStep('length');
    }, 200);
  };

  const handleLengthSelect = (length: NailLengthType) => {
    triggerSelectionVibration();
    setConfig(prev => ({ ...prev, length }));
    setTimeout(() => {
      setCustomizerSubStep('finish');
    }, 200);
  };

  const handleFinishSelect = (finish: NailFinishType) => {
    triggerSelectionVibration();
    setSelectedFinish(finish);
    setConfig(prev => ({ ...prev, finish }));
    setTimeout(() => {
      setCustomizerSubStep('color');
    }, 200);
  };

  const toggleExtra = (id: string) => {
    triggerSelectionVibration();
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingPhoto(true);
    triggerHapticFeedback(20);
    const fakeUrl = URL.createObjectURL(file);
    setPhotoUrl(fakeUrl);

    try {
      const extracted = NailPhotoDetailProcessor.analyzeNailPhoto({
        imageUrl: fakeUrl,
        textDescription: file.name,
      });
      setPhotoAnalysis(extracted);

      // Pre-map detected shape, length, finish, and color
      const shape = (extracted.layers.shape.value || 'almond') as NailShapeType;
      const length = (extracted.layers.length.value || 'short') as NailLengthType;
      const finish = (extracted.layers.finish.value || 'glossy') as NailFinishType;
      const colorHex = extracted.layers.chromatics.dominantColorHex || '#F3C5BA';
      const colorName = extracted.layers.chromatics.dominantColorName || 'Tono Detectado';

      setConfig(p => ({
        ...p,
        shape,
        length,
        finish,
        referenceImageUrl: fakeUrl,
      }));
      setSelectedFinish(finish);
      setSelectedColorHex(colorHex);
      setSelectedColorName(colorName);

      toast.success('¡Foto analizada por IA con éxito! Revisa la ficha técnica categorizada.');
    } catch {
      toast.info('Foto cargada como referencia para tu especialista.');
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleApplyExtractedAnalysis = (analysisData: NailPhotoDetailedAnalysis, proceedTo: 'availability' | 'customizer' = 'availability') => {
    triggerConfirmedVibration();
    
    // Map extracted attributes
    const shape = (analysisData.layers.shape.value || 'almond') as NailShapeType;
    const length = (analysisData.layers.length.value || 'short') as NailLengthType;
    const finish = (analysisData.layers.finish.value || 'glossy') as NailFinishType;
    const colorHex = analysisData.layers.chromatics.dominantColorHex || '#F3C5BA';
    const colorName = analysisData.layers.chromatics.dominantColorName || 'Tono Extraído';

    setConfig(prev => ({
      ...prev,
      shape,
      length,
      finish,
      referenceImageUrl: photoUrl || prev.referenceImageUrl,
    }));
    setSelectedFinish(finish);
    setSelectedColorHex(colorHex);
    setSelectedColorName(colorName);

    // Map extracted structure to closest Qualified Service
    const structTech = (analysisData.layers.structure.value || analysisData.layers.structure.label || '').toLowerCase();
    let matchedService = QUALIFIED_SERVICES[0];
    if (structTech.includes('acrílico') || structTech.includes('acrylic') || structTech.includes('escultural')) {
      matchedService = QUALIFIED_SERVICES.find(s => s.id === 'srv_acrilico_escultural') || QUALIFIED_SERVICES[1];
    } else if (structTech.includes('soft gel') || structTech.includes('gel-x') || structTech.includes('extension')) {
      matchedService = QUALIFIED_SERVICES.find(s => s.id === 'srv_softgel_gelx') || QUALIFIED_SERVICES[2];
    } else if (structTech.includes('semipermanente') || structTech.includes('gel color')) {
      matchedService = QUALIFIED_SERVICES.find(s => s.id === 'srv_gel_semipermanente') || QUALIFIED_SERVICES[3];
    } else {
      matchedService = QUALIFIED_SERVICES.find(s => s.id === 'srv_natural_rubber') || QUALIFIED_SERVICES[0];
    }
    setActiveService(matchedService);

    // Auto-select relevant extras if detected
    if (analysisData.layers.nailArt.complexity !== 'simple') {
      const extraList: string[] = [];
      const elementsJoined = analysisData.layers.nailArt.elements.join(' ').toLowerCase();
      if (elementsJoined.includes('swarovski') || elementsJoined.includes('cristal') || elementsJoined.includes('pedrería')) {
        extraList.push('extra_crystals_swarovski');
      }
      if (elementsJoined.includes('foil') || elementsJoined.includes('oro')) {
        extraList.push('extra_gold_foil');
      }
      if (elementsJoined.includes('cat-eye') || elementsJoined.includes('ojo de gato') || finish === 'cat_eye') {
        extraList.push('extra_cateye_focus');
      }
      if (extraList.length > 0) {
        setSelectedExtras(prev => Array.from(new Set([...prev, ...extraList])));
      }
    }

    toast.success(`Ficha técnica aplicada: ${matchedService.clientTitle} • ${shape} ${length}`);

    if (proceedTo === 'availability') {
      setCurrentStep('step-availability');
    } else {
      setCurrentStep('step-customizer');
    }
  };

  const handleClearPhoto = () => {
    setPhotoUrl('');
    setPhotoAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Foto descartada. Puedes elegir una técnica directa de la lista.');
  };

  const handlePhotoVisualFlowProceed = (data: {
    imageUrl: string;
    shape: NailShape;
    length: NailLength;
    removal: RemovalOptionType;
    totalPriceMXN: number;
    depositMXN: number;
    durationMins: number;
  }) => {
    triggerConfirmedVibration();
    
    // Set config
    const s = data.shape as NailShapeType;
    const l = data.length.toLowerCase() as NailLengthType;
    setConfig(prev => ({
      ...prev,
      shape: s,
      length: l,
      referenceImageUrl: data.imageUrl,
    }));

    // Update removal extra in selectedExtras
    const removalExtras = data.removal === 'acrylic' 
      ? ['extra_removal_acrylic']
      : data.removal === 'gelx'
      ? ['extra_removal_gelx']
      : [];

    setSelectedExtras(prev => {
      const nonRemoval = prev.filter(id => !id.includes('removal'));
      return [...nonRemoval, ...removalExtras];
    });

    // Default to Soft Gel or Sculptural Acrylic depending on length
    if (l === 'long' || l === 'xl') {
      const matched = QUALIFIED_SERVICES.find(s => s.id === 'srv_acrilico_escultural') || QUALIFIED_SERVICES[1];
      setActiveService(matched);
    } else {
      const matched = QUALIFIED_SERVICES.find(s => s.id === 'srv_softgel_gelx') || QUALIFIED_SERVICES[0];
      setActiveService(matched);
    }

    setCurrentStep('step-availability');
    toast.success('¡Diseño y cotización configurados! Elige tu horario preferido.');
  };

  const handlePaymentSuccess = (receipt: PaymentReceipt) => {
    setReceiptData(receipt);
    triggerConfirmedVibration();

    addAppointment({
      clientId: 'client-vip',
      serviceId: activeService.id,
      date: selectedDate || '2026-08-20',
      startTime: selectedTimeSlot || '11:00 AM',
      endTime: '12:30 PM',
      status: 'confirmed',
      notes: `Forma: ${config.shape} | Largo: ${config.length} | Acabado: ${selectedFinish} | Tono: ${selectedColorName} | Extras: ${selectedExtras.join(', ') || 'Ninguno'} | Anticipo: $${receipt.amountPaid} MXN | Tel: ${selectedCountry.dialCode} ${localPhoneDigits}`
    });

    setCurrentStep('step-confirmation');
    toast.success('¡Pase VIP de cita confirmado con éxito!');
  };

  const globalStepOrder: GlobalStep[] = [
    'step-service',
    'step-customizer',
    'step-availability',
    'step-contact',
    'step-payment'
  ];

  const currentGlobalIndex = globalStepOrder.indexOf(currentStep) >= 0 
    ? globalStepOrder.indexOf(currentStep) 
    : 0;

  const goToPreviousStep = () => {
    triggerStepVibration();
    if (currentStep === 'step-customizer') {
      if (nailCustomizerRef.current && nailCustomizerRef.current.goToPreviousStep()) {
        return;
      }
      setCurrentStep('step-service');
    } else if (currentStep === 'step-availability') {
      setCurrentStep('step-customizer');
      setCustomizerSubStep('extras');
      setExtrasSubStep('simulator');
    } else if (currentStep === 'step-contact') {
      setCurrentStep('step-availability');
    } else if (currentStep === 'step-payment') {
      setCurrentStep('step-contact');
    }
  };

  const popularExtras = useMemo(() => 
    SALON_EXTRAS_CATALOG.filter(e => 
      ['extra_crystals_swarovski', 'extra_removal_gelx', 'extra_gold_foil', 'extra_jelly_spa'].includes(e.id) || e.badge
    ).slice(0, 4), 
  []);
  const removalExtras = useMemo(() => SALON_EXTRAS_CATALOG.filter(e => e.category === 'removal'), []);
  const nailArtExtras = useMemo(() => SALON_EXTRAS_CATALOG.filter(e => e.category === 'nail_art'), []);
  const spaExtras = useMemo(() => SALON_EXTRAS_CATALOG.filter(e => e.category === 'spa_care'), []);

  const isPhotoFlowActive = currentStep === 'step-service' && intakeMethod === 'photo';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      
      {/* 1. TOP HEADER & BREADCRUMBS (5 Clean Global Steps - Hidden when self-contained photo visual flow is active) */}
      {currentStep !== 'step-confirmation' && !isPhotoFlowActive && (
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-3">
            {currentGlobalIndex > 0 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="size-10 rounded-full border border-slate-200/80 bg-white/80 backdrop-blur-sm hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Paso {STEP_DEFINITIONS[currentStep].num} de 5
                </span>
                <span className="size-1 rounded-full bg-slate-300" />
                <span className="text-xs font-normal text-slate-500 truncate max-w-[200px]">
                  {STEP_DEFINITIONS[currentStep].subtitle}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight leading-tight">
                {STEP_DEFINITIONS[currentStep].title}
              </h2>
            </div>
          </div>

          {/* Clean 5-Stage Global Progress Bar */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
            {globalStepOrder.map((st, idx) => (
              <div
                key={st}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentGlobalIndex 
                    ? "w-7 bg-primary" 
                    : idx < currentGlobalIndex 
                    ? "w-2.5 bg-primary/40" 
                    : "w-2.5 bg-slate-300"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT GRID */}
      <div className={cn("grid grid-cols-1 gap-6 items-start", !isPhotoFlowActive && "lg:grid-cols-3")}>
        
        {/* Step Container */}
        <div className={cn("space-y-6", !isPhotoFlowActive ? "lg:col-span-2" : "w-full max-w-4xl mx-auto")}>
          <AnimatePresence mode="wait">
            
            {/* ========================================================= */}
            {/* GLOBAL STEP 1: SERVICE & PHOTO INTAKE                     */}
            {/* ========================================================= */}
            {currentStep === 'step-service' && (
              <motion.div
                key="step-service"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                {/* When Photo Flow is Active: prioritize the visual widget and remove unselected direct options */}
                {intakeMethod === 'photo' ? (
                  <div className="w-full space-y-3">
                    <NailPhotoVisualFlow
                      initialImageUrl={photoUrl || undefined}
                      initialShape={config.shape as NailShape}
                      initialLength={config.length as NailLength}
                      onProceedToAvailability={handlePhotoVisualFlowProceed}
                      onCancel={() => {
                        setIntakeMethod('catalog');
                        handleClearPhoto();
                      }}
                    />

                    {/* Clean switcher link to catalog */}
                    <div className="text-center pt-3 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHapticFeedback(12);
                          setIntakeMethod('catalog');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors cursor-pointer"
                      >
                        ¿Prefieres reservar una técnica directa sin foto? Ver catálogo completo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Switcher Banner to Photo Flow */}
                    <div className="border border-slate-200/60 bg-white/80 backdrop-blur-md rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-pink-500/5">
                      <div className="flex items-center gap-3.5">
                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                          <Camera className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            ¿Tienes una foto de diseño o inspiración?
                          </h3>
                          <p className="text-xs font-normal text-slate-500 mt-0.5">
                            Sube captura de Instagram o Pinterest para cotizar forma, largo y retiro en 30s.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHapticFeedback(12);
                          setIntakeMethod('photo');
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:brightness-105 shadow-[0_4px_16px_rgba(224,82,134,0.25)] cursor-pointer active:scale-98 transition-all shrink-0 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="size-3.5" />
                        <span>Cotizar con Foto</span>
                      </button>
                    </div>

                    {/* Direct Service Selection List/Grid (Rendered only in catalog mode) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-medium text-slate-700">
                          Elige tu Técnica o Tratamiento ({filteredQualifiedServices.length} opciones):
                        </span>

                        {/* Layout Switcher: Deslizable | Cuadrícula | Lista */}
                        <div className="flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/60 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              triggerHapticFeedback(8);
                              setServiceLayoutMode('sliding');
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer",
                              serviceLayoutMode === 'sliding'
                                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                                : "text-slate-500 hover:text-slate-900"
                            )}
                            title="Vista Deslizable"
                          >
                            <SlidersHorizontal className="size-3.5" />
                            <span className="hidden xs:inline">Desliz.</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerHapticFeedback(8);
                              setServiceLayoutMode('grid');
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer",
                              serviceLayoutMode === 'grid'
                                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                                : "text-slate-500 hover:text-slate-900"
                            )}
                            title="Vista Cuadrícula"
                          >
                            <LayoutGrid className="size-3.5 text-primary" />
                            <span className="hidden xs:inline">Cuadrícula</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerHapticFeedback(8);
                              setServiceLayoutMode('list');
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer",
                              serviceLayoutMode === 'list'
                                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                                : "text-slate-500 hover:text-slate-900"
                            )}
                            title="Vista Lista"
                          >
                            <List className="size-3.5" />
                            <span className="hidden xs:inline">Lista</span>
                          </button>
                        </div>
                      </div>

                      {/* Category Filter Pills in Step 1 (Curated Top by default, with easy category drill-down) */}
                      <div className="p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/60 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {[
                          { id: 'top', label: 'Top Más Pedidos', icon: Star },
                          { id: 'nails', label: 'Uñas & Manicura', icon: Layers },
                          { id: 'pedicure', label: 'Pedicura & Spa', icon: Footprints },
                          { id: 'lashes', label: 'Pestañas (Lashes)', icon: Eye },
                          { id: 'all', label: 'Ver Todo', icon: Sparkles },
                        ].map((tab) => {
                          const isActive = serviceCategoryFilter === tab.id;
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => {
                                triggerHapticFeedback(8);
                                setServiceCategoryFilter(tab.id as any);
                              }}
                              className={cn(
                                "h-8 px-3.5 rounded-full text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
                                isActive
                                  ? "bg-slate-900 text-white shadow-xs font-semibold"
                                  : "bg-transparent text-slate-600 hover:text-slate-900 font-medium"
                              )}
                            >
                              <Icon className={cn("size-3.5", isActive ? (tab.id === 'top' ? "text-amber-400 fill-amber-400" : "text-white") : "text-slate-400")} />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {serviceLayoutMode === 'sliding' ? (
                        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar p-1 snap-x snap-mandatory">
                          {filteredQualifiedServices.map((srv) => {
                            const isSelected = activeService.id === srv.id;
                            return (
                              <button
                                key={srv.id}
                                type="button"
                                onClick={() => handleServiceSelect(srv)}
                                className={cn(
                                  "snap-start shrink-0 w-[240px] p-4.5 rounded-3xl text-left flex flex-col justify-between gap-3.5 transition-all cursor-pointer active:scale-98 relative group",
                                  isSelected
                                    ? "border-2 border-primary bg-white shadow-[0_4px_20px_rgba(224,82,134,0.14)] ring-1 ring-primary/20 scale-[1.02]"
                                    : "border border-slate-200/70 bg-white/80 backdrop-blur-md hover:border-slate-300 hover:bg-white shadow-lg shadow-pink-500/5"
                                )}
                              >
                                <div className="space-y-2.5 w-full">
                                  <div className="flex items-start justify-between gap-2">
                                    {srv.badge ? (
                                      <span className="text-[10px] font-semibold bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-amber-200/80">
                                        {srv.badge}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-slate-200/80">
                                        {srv.category}
                                      </span>
                                    )}
                                    {isSelected && (
                                      <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                                        <Check className="size-3 stroke-[3]" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                                      {srv.clientTitle}
                                    </h3>
                                    <p className="text-xs font-normal text-slate-500 line-clamp-2 leading-relaxed">
                                      {srv.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between">
                                  <span className="text-sm font-semibold text-primary">
                                    ${srv.basePriceMXN} <span className="text-[10px] text-slate-400 font-normal uppercase">mxn</span>
                                  </span>
                                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-full">
                                    <Clock className="size-3" />
                                    {srv.baseDurationMinutes}m
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : serviceLayoutMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredQualifiedServices.map((srv) => {
                            const isSelected = activeService.id === srv.id;
                            return (
                              <div
                                key={srv.id}
                                onClick={() => handleServiceSelect(srv)}
                                className={cn(
                                  "p-4.5 rounded-3xl text-left flex flex-col justify-between gap-3.5 transition-all cursor-pointer active:scale-[0.99]",
                                  isSelected
                                    ? "border-2 border-primary bg-white shadow-[0_4px_20px_rgba(224,82,134,0.14)] ring-1 ring-primary/20 scale-[1.01]"
                                    : "border border-slate-200/70 bg-white/80 backdrop-blur-md hover:border-slate-300 hover:bg-white shadow-lg shadow-pink-500/5"
                                )}
                              >
                                <div className="space-y-2 w-full">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                                          {srv.clientTitle}
                                        </h4>
                                        {srv.badge && (
                                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                            {srv.badge}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className={cn(
                                      "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                      isSelected ? "bg-primary border-primary text-white shadow-xs" : "border-slate-300"
                                    )}>
                                      {isSelected && <Check className="size-3 stroke-[3]" />}
                                    </div>
                                  </div>

                                  <p className="text-xs font-normal text-slate-500 line-clamp-2 leading-relaxed">
                                    {srv.description}
                                  </p>
                                </div>

                                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-sm font-semibold text-primary">Desde ${srv.basePriceMXN} MXN</span>
                                  <span className="text-xs font-normal text-slate-500">~{srv.baseDurationMinutes} min</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="border border-slate-200/60 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md shadow-lg shadow-pink-500/5 divide-y divide-slate-100">
                          {filteredQualifiedServices.map((srv) => {
                            const isSelected = activeService.id === srv.id;
                            return (
                              <div
                                key={srv.id}
                                onClick={() => handleServiceSelect(srv)}
                                className={cn(
                                  "px-4.5 py-3.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer",
                                  isSelected
                                    ? "bg-primary/5 font-semibold text-slate-900"
                                    : "hover:bg-slate-50/70 active:bg-slate-100/50 text-slate-700"
                                )}
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                                      {srv.clientTitle}
                                    </h4>
                                    {srv.badge && (
                                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                        {srv.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs font-normal text-slate-500 truncate mt-0.5">
                                    {srv.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <span className="text-sm font-semibold text-slate-900 block">
                                      Desde ${srv.basePriceMXN} MXN
                                    </span>
                                    <span className="text-xs text-slate-500 font-normal">
                                      ~{srv.baseDurationMinutes} min
                                    </span>
                                  </div>
                                  <div className={cn(
                                    "size-5 rounded-full border flex items-center justify-center transition-all",
                                    isSelected ? "bg-primary border-primary text-white shadow-xs" : "border-slate-300"
                                  )}>
                                    {isSelected && <Check className="size-3 stroke-[3]" />}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* GLOBAL STEP 2: PERSONALIZACIÓN & EXTRAS                   */}
            {/* ========================================================= */}
            {currentStep === 'step-customizer' && (
              activeService.category === 'lashes' ? (
                <motion.div
                  key="step-customizer-lashes"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-3"
                >
                  <LashConfigurator
                    onConfirm={(lashData) => {
                      const mappingNames: Record<string, string> = {
                        cat_eye: 'Cat Eye / Foxy',
                        doll_eye: 'Doll Eye',
                        natural: 'Natural',
                        wispy: 'Wispy / Kim K',
                        dramatic: 'Dramatic',
                        squirrel: 'Squirrel',
                        spiky: 'Spiky Manga',
                        open_eye: 'Open Eye'
                      };
                      const mapName = mappingNames[lashData.mapping] || lashData.mapping;
                      setConfig(prev => ({
                        ...prev,
                        serviceTitle: `Pestañas: ${lashData.look.title} (Curva ${lashData.curl} · ${mapName})`,
                        notes: `Especificaciones: ${lashData.look.title} | Curva ${lashData.curl} | Mapeo ${mapName} | ${lashData.appointmentType} | Extras: ${lashData.selectedExtras.length > 0 ? lashData.selectedExtras.join(', ') : 'Ninguno'}`,
                        referenceImageUrl: lashData.referenceImageUrl || prev.referenceImageUrl
                      }));
                      setCurrentStep('step-availability');
                    }}
                    onBack={() => {
                      setCurrentStep('step-service');
                    }}
                  />
                </motion.div>
              ) : (
              <NailCustomizerStep
                  ref={nailCustomizerRef}
                  shape={config.shape as NailShapeType}
                  onSelectShape={handleShapeSelect}
                  length={config.length as NailLengthType}
                  onSelectLength={handleLengthSelect}
                  selectedFinish={selectedFinish as NailFinishType}
                  onSelectFinish={handleFinishSelect}
                  selectedColorHex={selectedColorHex}
                  selectedColorName={selectedColorName}
                  selectedTipHex={selectedTipHex}
                  onSelectColor={(hex, name, tip) => {
                    setSelectedColorHex(hex);
                    setSelectedColorName(name);
                    if (tip) setSelectedTipHex(tip);
                  }}
                  selectedExtras={selectedExtras}
                  onToggleExtra={toggleExtra}
                  onProceedToNextStep={() => {
                    triggerStepVibration();
                    setCurrentStep('step-availability');
                  }}
                  onGoToPreviousStep={() => {
                    setCurrentStep('step-service');
                  }}
                />
              )
            )}

            {/* ========================================================= */}
            {/* GLOBAL STEP 3: AVAILABILITY & STAFF                       */}
            {/* ========================================================= */}
            {currentStep === 'step-availability' && (
              <motion.div
                key="step-availability"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <AvailabilitySelector
                  selectedStaffId={selectedStaff?.id}
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onSelectStaff={(staff) => {
                    setSelectedStaff(staff);
                    triggerSelectionVibration();
                  }}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    triggerSelectionVibration();
                  }}
                  onSelectTimeSlot={(slot) => {
                    setSelectedTimeSlot(slot);
                    triggerSelectionVibration();
                  }}
                />

                {/* Primary Action Button (Fixed/Floating Bottom Capsule) */}
                <div className="pt-2 pb-6 space-y-3">
                  <button
                    type="button"
                    disabled={!selectedDate || !selectedTimeSlot}
                    onClick={() => {
                      triggerStepVibration();
                      setCurrentStep('step-contact');
                    }}
                    className={cn(
                      "w-full h-12.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-[0.99] transition-all select-none",
                      selectedDate && selectedTimeSlot
                        ? "bg-primary hover:bg-primary/95 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    )}
                  >
                    <span>Continuar a Datos de Contacto</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-900 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-slate-100/60"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>Volver al paso anterior</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* GLOBAL STEP 4: CONTACT & WHATSAPP DATA                    */}
            {/* ========================================================= */}
            {currentStep === 'step-contact' && (
              <motion.div
                key="step-contact"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                {/* Contact Intake Card */}
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-lg shadow-pink-500/5 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="size-4 text-primary" />
                        Datos de Contacto
                      </h3>
                      <p className="text-xs font-normal text-slate-500">Para confirmación y tu Pase VIP digital</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shrink-0">
                      Garantía 100%
                    </span>
                  </div>

                  {/* Summary of Selected Service & Extras */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full border border-slate-300" style={{ backgroundColor: selectedColorHex }} />
                        <span className="text-sm font-semibold text-slate-900">
                          {activeService.clientTitle} ({config.shape}, {config.length})
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        ${quote.totalPriceMXN} MXN
                      </span>
                    </div>

                    <div className="text-xs font-normal text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                      <span><strong>Acabado:</strong> {selectedFinish} ({selectedColorName})</span>
                      <span><strong>Especialista:</strong> {selectedStaff?.name || 'Cualquier Especialista'}</span>
                      <span><strong>Fecha:</strong> {selectedDate} a las {selectedTimeSlot}</span>
                    </div>

                    {selectedExtras.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                        {selectedExtras.map(id => {
                          const item = SALON_EXTRAS_CATALOG.find(e => e.id === id);
                          return (
                            <span key={id} className="text-[11px] font-medium bg-white px-2.5 py-0.5 rounded-full border border-slate-200/70 text-slate-700">
                              + {item?.name} (${item?.priceMXN} MXN)
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Intake Form with Country Flag Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="size-4 text-emerald-600" />
                        WhatsApp para confirmación de cita:
                      </span>
                      {isPhoneValidated && (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Número Válido
                        </span>
                      )}
                    </label>

                    <div className="flex gap-2">
                      {/* Country Selector */}
                      <div className="relative shrink-0">
                        <select
                          value={selectedCountry.code}
                          onChange={(e) => {
                            const found = COUNTRIES_CATALOG.find(c => c.code === e.target.value);
                            if (found) {
                              setSelectedCountry(found);
                              triggerHapticFeedback(10);
                            }
                          }}
                          className="h-11 px-3.5 rounded-full border border-slate-200/80 bg-white font-medium text-xs text-slate-900 cursor-pointer focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          {COUNTRIES_CATALOG.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.dialCode}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Phone Number Input */}
                      <div className="relative flex-1">
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          inputMode="numeric"
                          value={localPhoneDigits}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.digitLength);
                            setLocalPhoneDigits(digitsOnly);
                            if (digitsOnly.length >= selectedCountry.digitLength) {
                              phoneInputRef.current?.blur();
                              setTimeout(() => {
                                continuePaymentBtnRef.current?.focus();
                                triggerHapticFeedback(10);
                              }, 50);
                            }
                          }}
                          placeholder={selectedCountry.placeholder}
                          className="w-full h-11 px-4 rounded-full border border-slate-200/80 bg-white font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <p className="text-xs font-normal text-slate-500">
                      Te enviaremos el ticket digital con código QR y recordatorio 2 horas antes de tu turno.
                    </p>
                  </div>

                  {/* Deposit Info Banner */}
                  <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-primary/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Anticipo de Garantía de Espacio:
                      </span>
                      <span className="text-xs font-normal text-slate-500">
                        Se descuenta del total el día de tu cita.
                      </span>
                    </div>
                    <span className="text-base font-semibold text-primary">
                      ${quote.depositMXN} MXN
                    </span>
                  </div>
                </div>

                {/* Main Action CTA */}
                <div className="pt-2 pb-6 space-y-3">
                  <button
                    ref={continuePaymentBtnRef}
                    type="button"
                    disabled={!isPhoneValidated}
                    onClick={() => {
                      triggerStepVibration();
                      setCurrentStep('step-payment');
                    }}
                    className={cn(
                      "w-full h-12.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-[0.99] transition-all select-none",
                      isPhoneValidated
                        ? "bg-primary hover:bg-primary/95 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    )}
                  >
                    <span>Continuar a Pago Seguro</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-900 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-slate-100/60"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>Modificar Fecha u Horario</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* GLOBAL STEP 5: SECURE PAYMENT CHECKOUT (INLINE STEP)      */}
            {/* ========================================================= */}
            {currentStep === 'step-payment' && (
              <motion.div
                key="step-payment"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-lg shadow-pink-500/5 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="size-4 text-primary" />
                        Pago Seguro de Anticipo
                      </h3>
                      <p className="text-xs font-normal text-slate-500">
                        Anticipo para reservar a tu especialista: <span className="font-semibold text-primary">${quote.depositMXN} MXN</span>
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shrink-0">
                      100% Reembolsable
                    </span>
                  </div>

                  <SalonPaymentCheckoutWidget
                    serviceTitle={activeService.clientTitle}
                    totalAmount={quote.totalPriceMXN}
                    depositAmount={quote.depositMXN}
                    dateStr={selectedDate}
                    timeStr={selectedTimeSlot}
                    staffName={selectedStaff?.name}
                    clientName={`WhatsApp: ${selectedCountry.dialCode} ${localPhoneDigits}`}
                    onPaymentComplete={handlePaymentSuccess}
                    onCancel={() => setCurrentStep('step-contact')}
                  />
                </div>

                <div className="flex justify-center pb-6">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-900 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-slate-100/60"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Volver a Datos de Contacto</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* GLOBAL STEP CONFIRMATION: CONFIRMATION VIP PASS           */}
            {/* ========================================================= */}
            {currentStep === 'step-confirmation' && (
              <motion.div
                key="step-confirmation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-lg mx-auto"
              >
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-lg shadow-pink-500/5 p-6 sm:p-8 text-center space-y-5">
                  <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle className="size-8 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                      Cita Agendada & Garantizada
                    </span>
                    <h2 className="text-xl font-semibold text-slate-900 pt-1">
                      ¡Tu Pase VIP está Listo!
                    </h2>
                    <p className="text-xs font-normal text-slate-500">
                      Hemos enviado los detalles a tu WhatsApp ({selectedCountry.dialCode} {localPhoneDigits})
                    </p>
                  </div>

                  {/* Visual Pass Card */}
                  <div className="bg-slate-50/90 rounded-3xl p-5 border border-slate-200/70 text-left space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">ID de Reserva</span>
                        <span className="text-xs font-mono font-semibold text-slate-900 block">
                          #{receiptData?.paymentId || 'VIP-9942'}
                        </span>
                      </div>
                      <QrCode className="size-7 text-slate-800" />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Servicio:</span>
                        <span className="font-semibold text-slate-900">{activeService.clientTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Forma & Largo:</span>
                        <span className="font-semibold text-slate-900 capitalize">{config.shape}, {config.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Acabado:</span>
                        <span className="font-semibold text-slate-900 capitalize">{selectedFinish} ({selectedColorName})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Especialista:</span>
                        <span className="font-semibold text-slate-900">{selectedStaff?.name || 'Asignada en salón'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fecha & Turno:</span>
                        <span className="font-semibold text-primary">{selectedDate} a las {selectedTimeSlot}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Anticipo Pagado</span>
                        <span className="text-xs font-semibold text-emerald-600">
                          ${receiptData?.amountPaid || quote.depositMXN} MXN ({receiptData?.methodLabel || 'Tarjeta'})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Restante en Salón</span>
                        <span className="text-xs font-semibold text-slate-900">
                          ${quote.totalPriceMXN - (receiptData?.amountPaid || quote.depositMXN)} MXN
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/appointments')}
                      className="w-full sm:w-auto h-11 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Ver en Mis Citas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticFeedback(15);
                        toast.success('Pase VIP descargado en tu dispositivo');
                      }}
                      className="w-full sm:w-auto h-11 px-6 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="size-3.5" />
                      <span>Descargar Pase</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Live Booking Summary Sidebar (Hidden when in full photo visual flow) */}
        {!isPhotoFlowActive && (
          <div className="space-y-3">
            <LiveBookingSummary
              quote={quote}
              config={{
                ...config,
                finish: selectedFinish,
                serviceTitle: activeService.clientTitle
              }}
              staffName={selectedStaff?.name}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
            />
          </div>
        )}

      </div>

    </div>
  );
}
