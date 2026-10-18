import React, { useState, useRef } from 'react';
import { 
  Eye, 
  Sparkles, 
  Check, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  SlidersHorizontal,
  Info,
  HelpCircle,
  ShieldCheck,
  Flame,
  Layers,
  Sparkle,
  Upload,
  Camera,
  MessageSquare,
  RotateCcw,
  Gem,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic, triggerSelectionVibration } from '@/shared/utils/haptics';
import { LashVectorPreview, LashCurlProfileSVG, LashTechniqueType, LashCurlType, LashMappingType } from './LashVectorPreview';
import { LashMappingPhotoPreview, LASH_MAPPING_CATALOG } from './LashMappingPhotoPreview';
import { LashPhotoDetailProcessor, LashPhotoDetailedAnalysis } from '@/domain/quotes/infrastructure/ai/lash-photo-detail-processor';
import { LashPhotoExtractionCard } from './LashPhotoExtractionCard';
import { toast } from 'sonner';

// Sub-step tabs matching the Nails Configurator in the screenshot
export type LashSubStep = 'technique' | 'curl' | 'mapping' | 'appointment' | 'extras';

export interface LashLookConfig {
  id: 'classic_1_to_1' | 'hybrid_foxy' | 'russian_volume' | 'lash_lifting';
  techniqueKey: LashTechniqueType;
  title: string;
  subtitle: string;
  badge: string;
  price: number;
  duration: number;
  densityTag: string;
  defaultCurl: LashCurlType;
  defaultMapping: LashMappingType;
  description: string;
}

export const LASH_LOOKS: LashLookConfig[] = [
  {
    id: 'classic_1_to_1',
    techniqueKey: 'classic',
    title: 'Clásica Natural (Pelo a Pelo)',
    subtitle: 'Efecto rímel diario y máxima definición limpia',
    badge: 'Más Natural',
    price: 750,
    duration: 75,
    densityTag: '1:1 Definición',
    defaultCurl: 'C',
    defaultMapping: 'natural',
    description: 'Una extensión individual por pestaña natural. Alarga y curva sin volumen artificial.'
  },
  {
    id: 'hybrid_foxy',
    techniqueKey: 'hybrid',
    title: 'Híbridas Foxy',
    subtitle: 'Textura esponjosa con abanicos 3D para ojos rasgados',
    badge: 'Popular',
    price: 900,
    duration: 90,
    densityTag: 'Mix 1:1 + Abanicos 3D',
    defaultCurl: 'D',
    defaultMapping: 'cat_eye',
    description: 'Combina técnica clásica con abanicos suaves 3D para rellenar huecos y rasgar la mirada.'
  },
  {
    id: 'russian_volume',
    techniqueKey: 'russian',
    title: 'Volumen Ruso Glamour (4D/6D)',
    subtitle: 'Delineado negro intenso y densidad aterciopelada',
    badge: 'Delineado Intenso',
    price: 1150,
    duration: 105,
    densityTag: 'Abanicos 4D a 6D',
    defaultCurl: 'D',
    defaultMapping: 'wispy',
    description: 'Abanicos artesanales ultralivianos que crean una línea oscura tupida y ojos abiertos.'
  },
  {
    id: 'lash_lifting',
    techniqueKey: 'lifting',
    title: 'Lash Lifting + Keratina & Tinte',
    subtitle: '100% tu pestaña natural curvada desde la raíz',
    badge: 'Cero Mantenimiento',
    price: 550,
    duration: 50,
    densityTag: 'Sin Extensiones',
    defaultCurl: 'C',
    defaultMapping: 'natural',
    description: 'Curvado permanente de tu propia pestaña con baño de botox nutritivo y tinte negro.'
  }
];

export const LASH_CURL_OPTIONS: { id: LashCurlType; label: string; degrees: string; badge?: string; desc: string }[] = [
  { id: 'C', label: 'Curvatura C (Natural Soft)', degrees: '55°', badge: 'Natural', desc: 'Curvado suave equivalente al enchinador de pestañas tradicional.' },
  { id: 'D', label: 'Curvatura D (Glamour Elevado)', degrees: '70°', badge: 'Popular', desc: 'Abre el ojo y levanta la mirada notablemente para fotos y eventos.' },
  { id: 'L', label: 'Curvatura L (Foxy & Rasgado)', degrees: '85°', badge: 'Efecto Foxy', desc: 'Base plana que alinea el ojo y eleva los extremos rasgando la mirada.' }
];

export const LASH_MAPPING_OPTIONS = Object.values(LASH_MAPPING_CATALOG);

export const LASH_EXTRAS_CATALOG = [
  { id: 'extra_lash_shampoo', name: 'Shampoo de Pestañas Espuma Salón', price: 60, duration: 10, desc: 'Limpieza y desengrase microbiano para máxima retención de adhesivo.', icon: Sparkles },
  { id: 'extra_lash_keratin_bath', name: 'Baño de Keratina & Botox Nutritivo', price: 90, duration: 10, desc: 'Sella la cutícula y engrosa pestañas débiles.', badge: 'Popular', icon: HeartHandshake },
  { id: 'extra_lash_removal_prior', name: 'Retiro Cuidadoso de Set Previo', price: 120, duration: 20, desc: 'Remoción con crema removedora especial sin tirones.', icon: RotateCcw }
];

export interface LashCustomizerProps {
  onConfirm: (data: {
    look: LashLookConfig;
    appointmentType: 'full_set' | 'touchup_2w' | 'touchup_3w' | 'removal_and_new';
    curl: LashCurlType;
    mapping: LashMappingType;
    selectedExtras: string[];
    finalPrice: number;
    finalDuration: number;
    referenceImageUrl?: string;
  }) => void;
  onBack?: () => void;
}

export function LashConfigurator({
  onConfirm,
  onBack
}: LashCustomizerProps) {
  // Current active sub-step tab (matching the screenshot's 5 sub-steps)
  const [subStep, setSubStep] = useState<LashSubStep>('technique');

  // Selections
  const [selectedLook, setSelectedLook] = useState<LashLookConfig>(LASH_LOOKS[1]); // Default Híbridas Foxy
  const [curl, setCurl] = useState<LashCurlType>('D');
  const [mapping, setMapping] = useState<LashMappingType>('cat_eye');
  const [appointmentType, setAppointmentType] = useState<'full_set' | 'touchup_2w' | 'touchup_3w' | 'removal_and_new'>('full_set');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Photo Inspiration AI State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<LashPhotoDetailedAnalysis | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  // Price & Duration Calculation
  const calculateTotal = () => {
    let basePrice = selectedLook.price;
    let baseDuration = selectedLook.duration;

    if (appointmentType === 'touchup_2w') {
      basePrice = Math.round(selectedLook.price * 0.58);
      baseDuration = Math.round(selectedLook.duration * 0.65);
    } else if (appointmentType === 'touchup_3w') {
      basePrice = Math.round(selectedLook.price * 0.68);
      baseDuration = Math.round(selectedLook.duration * 0.78);
    } else if (appointmentType === 'removal_and_new') {
      basePrice = selectedLook.price + 120;
      baseDuration = selectedLook.duration + 20;
    }

    // Add extras
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const ex = LASH_EXTRAS_CATALOG.find(e => e.id === extraId);
      return sum + (ex?.price || 0);
    }, 0);

    const extrasDuration = selectedExtras.reduce((sum, extraId) => {
      const ex = LASH_EXTRAS_CATALOG.find(e => e.id === extraId);
      return sum + (ex?.duration || 0);
    }, 0);

    return {
      price: basePrice + extrasTotal,
      duration: baseDuration + extrasDuration,
      deposit: Math.max(200, Math.round((basePrice + extrasTotal) * 0.3))
    };
  };

  const totals = calculateTotal();

  // Photo scan handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningPhoto(true);
    triggerHaptic(15);
    const objectUrl = URL.createObjectURL(file);
    setUploadedPhotoUrl(objectUrl);

    try {
      const analyzed = LashPhotoDetailProcessor.analyzeLashPhoto({
        imageUrl: objectUrl,
        textDescription: file.name
      });
      setPhotoAnalysis(analyzed);

      // Pre-fill selections
      const matchedLook = LASH_LOOKS.find(l => l.techniqueKey === (analyzed.technique.id === 'classic_1_to_1' ? 'classic' : analyzed.technique.id === 'russian_volume' ? 'russian' : analyzed.technique.id === 'lash_lifting' ? 'lifting' : 'hybrid')) || LASH_LOOKS[1];
      setSelectedLook(matchedLook);
      setCurl(analyzed.curvature.type);
      setMapping(analyzed.mapping.type);

      toast.success('¡Foto de pestañas analizada con IA! Especificaciones aplicadas.');
    } catch {
      toast.info('Foto cargada como referencia para tu cita.');
    } finally {
      setIsScanningPhoto(false);
    }
  };

  const handleApplyPhotoSpecs = () => {
    if (!photoAnalysis) return;
    const matchedLook = LASH_LOOKS.find(l => l.techniqueKey === (photoAnalysis.technique.id === 'classic_1_to_1' ? 'classic' : photoAnalysis.technique.id === 'russian_volume' ? 'russian' : photoAnalysis.technique.id === 'lash_lifting' ? 'lifting' : 'hybrid')) || LASH_LOOKS[1];
    setSelectedLook(matchedLook);
    setCurl(photoAnalysis.curvature.type);
    setMapping(photoAnalysis.mapping.type);
    setSubStep('technique');
  };

  const handleProceed = () => {
    triggerHaptic(12);
    onConfirm({
      look: selectedLook,
      appointmentType,
      curl,
      mapping,
      selectedExtras,
      finalPrice: totals.price,
      finalDuration: totals.duration,
      referenceImageUrl: uploadedPhotoUrl || undefined
    });
  };

  // WhatsApp hybrid bridge message generator
  const handleContinueOnWhatsApp = () => {
    triggerHaptic(10);
    const typeLabel = appointmentType === 'touchup_2w' ? 'Retoque 2 semanas' : appointmentType === 'touchup_3w' ? 'Retoque 3 semanas' : appointmentType === 'removal_and_new' ? 'Retiro + Set Nuevo' : 'Set Completo 1ra Vez';
    const message = encodeURIComponent(
      `¡Hola! 🌸 Deseo agendar mi cita de Pestañas:\n\n` +
      `✨ Técnica: ${selectedLook.title}\n` +
      `📐 Curvatura: Curva ${curl}\n` +
      `👁️ Diseño: ${mapping === 'cat_eye' ? 'Cat Eye / Foxy' : mapping === 'doll_eye' ? 'Doll Eye / Muñeca' : 'Natural'}\n` +
      `📅 Tipo: ${typeLabel}\n` +
      `💰 Total: $${totals.price} MXN (~${totals.duration} min)\n` +
      `🔒 Anticipo sugerido: $${totals.deposit} MXN\n\n` +
      `¿Tienen disponibilidad en agenda para esta semana?`
    );
    window.open(`https://wa.me/525512345678?text=${message}`, '_blank');
  };

  return (
    <div className="w-full space-y-3">
      {/* 1. TOP SEGMENTED SUB-STEP BAR (Matching Nails Configurator in Screenshot) */}
      <div className="w-full bg-white rounded-2xl border border-black/[0.08] p-1.5 shadow-2xs overflow-x-auto scrollbar-none flex items-center gap-1">
        {[
          { id: 'technique', label: '1. Técnica', value: selectedLook.techniqueKey === 'hybrid' ? 'Híbridas' : selectedLook.techniqueKey === 'classic' ? 'Clásica' : selectedLook.techniqueKey === 'russian' ? 'Volumen' : 'Lifting' },
          { id: 'curl', label: '2. Curvatura', value: `Curva ${curl}` },
          { id: 'mapping', label: '3. Diseño Ojo', value: mapping === 'cat_eye' ? 'Cat Eye' : mapping === 'doll_eye' ? 'Doll Eye' : 'Natural' },
          { id: 'appointment', label: '4. Cita', value: appointmentType === 'full_set' ? 'Completo' : appointmentType.includes('touchup') ? 'Retoque' : 'Retiro+Nuevo' },
          { id: 'extras', label: '5. Extras', value: selectedExtras.length > 0 ? `(${selectedExtras.length})` : 'Opcionales' }
        ].map((tab) => {
          const isActive = subStep === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic(6);
                setSubStep(tab.id as LashSubStep);
              }}
              className={cn(
                "flex-1 min-w-[85px] py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap text-center flex items-center justify-center gap-1",
                isActive
                  ? "bg-white border border-black/[0.12] shadow-2xs text-[#1D1D1F] ring-1 ring-black/[0.08]"
                  : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-neutral-50"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn("text-[10px]", isActive ? "text-rose-600 font-extrabold" : "text-[#86868B]")}>
                ({tab.value})
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. REAL PHOTO & LASH MAPPING TAPE VISUALIZER */}
      <LashMappingPhotoPreview
        technique={selectedLook.techniqueKey}
        curl={curl}
        mapping={mapping}
        appointmentType={appointmentType}
        priceMXN={totals.price}
        durationMins={totals.duration}
      />

      {/* PHOTO INSPIRATION UPLOAD / AI SCAN CARD (When Available or Requested) */}
      {photoAnalysis && (
        <LashPhotoExtractionCard
          analysis={photoAnalysis}
          onApply={handleApplyPhotoSpecs}
        />
      )}

      {/* 3. SUB-STEP CONTENT SECTIONS */}
      <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs">
        
        {/* SUB-STEP 1: TÉCNICA */}
        {subStep === 'technique' && (
          <div>
            <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-[#FBFBFD]">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-rose-600" />
                1. Técnica & Efecto de Pestañas
              </span>
              <span className="text-xs font-bold text-rose-600">
                {selectedLook.title.split(' ')[0]}
              </span>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {LASH_LOOKS.map((look) => {
                const isSelected = selectedLook.id === look.id;
                return (
                  <div
                    key={look.id}
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedLook(look);
                      setCurl(look.defaultCurl);
                      setMapping(look.defaultMapping);
                      setTimeout(() => setSubStep('curl'), 180);
                    }}
                    className={cn(
                      "px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer",
                      isSelected
                        ? "bg-rose-50/40 font-semibold text-[#1D1D1F]"
                        : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Left Thumbnail Vector Container (Matching the screenshot size-11) */}
                      <div className="size-11 rounded-xl bg-gradient-to-b from-neutral-50/80 to-neutral-100/90 border border-black/[0.06] flex items-center justify-center shrink-0 p-1 shadow-2xs">
                        <LashVectorPreview
                          technique={look.techniqueKey}
                          size="sm"
                          selected={isSelected}
                          className="w-10 h-8"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1D1D1F]">
                            {look.title}
                          </span>
                          {look.badge && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md shrink-0">
                              {look.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#86868B] truncate mt-0.5">
                          {look.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right Checkmark Circle (Matching Screenshot) */}
                    <div className={cn(
                      "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "bg-rose-600 border-rose-600 text-white" : "border-black/20"
                    )}>
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-STEP 2: CURVATURA */}
        {subStep === 'curl' && (
          <div>
            <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-[#FBFBFD]">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Eye className="size-3.5 text-rose-600" />
                2. Grado de Curvatura & Elevación
              </span>
              <span className="text-xs font-bold text-rose-600">
                Curva {curl}
              </span>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {LASH_CURL_OPTIONS.map((c) => {
                const isSelected = curl === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      triggerSelectionVibration();
                      setCurl(c.id);
                      setTimeout(() => setSubStep('mapping'), 180);
                    }}
                    className={cn(
                      "px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer",
                      isSelected
                        ? "bg-rose-50/40 font-semibold text-[#1D1D1F]"
                        : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-11 rounded-xl bg-gradient-to-b from-neutral-50/80 to-neutral-100/90 border border-black/[0.06] flex items-center justify-center shrink-0 p-1 shadow-2xs">
                        <LashCurlProfileSVG curl={c.id} selected={isSelected} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1D1D1F]">{c.label}</span>
                          <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md shrink-0">
                            {c.degrees}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#86868B] truncate mt-0.5">{c.desc}</p>
                      </div>
                    </div>

                    <div className={cn(
                      "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "bg-rose-600 border-rose-600 text-white" : "border-black/20"
                    )}>
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-STEP 3: DISEÑO DE OJO (MAPPING) */}
        {subStep === 'mapping' && (
          <div>
            <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-[#FBFBFD]">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Layers className="size-3.5 text-rose-600" />
                3. Diseño de Ojo (Lash Mapping)
              </span>
              <span className="text-xs font-bold text-rose-600 capitalize">
                {mapping.replace('_', ' ')}
              </span>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {LASH_MAPPING_OPTIONS.map((m) => {
                const isSelected = mapping === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      triggerSelectionVibration();
                      setMapping(m.id);
                      setTimeout(() => setSubStep('appointment'), 180);
                    }}
                    className={cn(
                      "px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer",
                      isSelected
                        ? "bg-rose-50/40 font-semibold text-[#1D1D1F]"
                        : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Photo Thumbnail */}
                      <div className="size-11 rounded-xl overflow-hidden border border-black/[0.08] flex items-center justify-center shrink-0 bg-neutral-100 shadow-2xs relative">
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/70 text-white px-1 rounded-sm">
                          {m.emoji}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1D1D1F]">{m.name}</span>
                          {m.badge && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md shrink-0">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#86868B] truncate mt-0.5">{m.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-[#86868B] bg-neutral-100 px-1.5 py-0.5 rounded-md hidden sm:inline">
                        {m.innerMm}-{m.apexMm}mm
                      </span>
                      <div className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        isSelected ? "bg-rose-600 border-rose-600 text-white" : "border-black/20"
                      )}>
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-STEP 4: ESTADO / CITA */}
        {subStep === 'appointment' && (
          <div>
            <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-[#FBFBFD]">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Calendar className="size-3.5 text-rose-600" />
                4. Tipo de Sesión & Estado
              </span>
              <span className="text-xs font-bold text-rose-600">
                {appointmentType === 'full_set' ? 'Set Nuevo' : 'Retoque / Retiro'}
              </span>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {[
                { id: 'full_set', name: 'Set Completo (1ra Vez)', badge: 'Garantía 7 días', price: selectedLook.price, time: selectedLook.duration, desc: 'Aplicación total de extensiones desde cero con diseño personalizado.' },
                { id: 'touchup_2w', name: 'Retoque 2 Semanas (40% desc)', badge: 'Mantenimiento', price: Math.round(selectedLook.price * 0.58), time: Math.round(selectedLook.duration * 0.65), desc: 'Relleno de pestañas mudadas y peinado para mantener tupidez.' },
                { id: 'touchup_3w', name: 'Retoque 3 Semanas (30% desc)', badge: 'Mantenimiento', price: Math.round(selectedLook.price * 0.68), time: Math.round(selectedLook.duration * 0.78), desc: 'Relleno intensivo de extensiones antes del mes.' },
                { id: 'removal_and_new', name: 'Retiro de Set Anterior + Set Nuevo', badge: 'Renovación', price: selectedLook.price + 120, time: selectedLook.duration + 20, desc: 'Disolución del adhesivo anterior con fórmula suave y colocación de nuevo set.' }
              ].map((item) => {
                const isSelected = appointmentType === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      triggerSelectionVibration();
                      setAppointmentType(item.id as any);
                      setTimeout(() => setSubStep('extras'), 180);
                    }}
                    className={cn(
                      "px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer",
                      isSelected
                        ? "bg-rose-50/40 font-semibold text-[#1D1D1F]"
                        : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1D1D1F]">{item.name}</span>
                        <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#86868B] truncate mt-0.5">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#1D1D1F]">${item.price}</span>
                        <span className="text-[10px] text-[#86868B] block">~{item.time}m</span>
                      </div>
                      <div className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        isSelected ? "bg-rose-600 border-rose-600 text-white" : "border-black/20"
                      )}>
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-STEP 5: EXTRAS & CUIDADOS */}
        {subStep === 'extras' && (
          <div>
            <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-[#FBFBFD]">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-rose-600" />
                5. Tratamientos Spa & Cuidados
              </span>
              <span className="text-xs font-bold text-rose-600">
                {selectedExtras.length} Seleccionados
              </span>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {LASH_EXTRAS_CATALOG.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                const IconComponent = extra.icon;
                return (
                  <div
                    key={extra.id}
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedExtras(prev => 
                        prev.includes(extra.id) ? prev.filter(x => x !== extra.id) : [...prev, extra.id]
                      );
                    }}
                    className={cn(
                      "px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer",
                      isSelected
                        ? "bg-rose-50/40 font-semibold text-[#1D1D1F]"
                        : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                        <IconComponent className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1D1D1F]">{extra.name}</span>
                          {extra.badge && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md shrink-0">
                              {extra.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#86868B] truncate mt-0.5">{extra.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#1D1D1F]">+${extra.price}</span>
                        <span className="text-[10px] text-[#86868B] block">+{extra.duration}m</span>
                      </div>
                      <div className={cn(
                        "size-5 rounded-md border flex items-center justify-center shrink-0 transition-all",
                        isSelected ? "bg-rose-600 border-rose-600 text-white" : "border-black/20"
                      )}>
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION & HYBRID WHATSAPP BAR */}
      <div className="p-3 bg-white rounded-2xl border border-black/[0.08] shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#86868B] block">Total Estimado Salón</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#1D1D1F]">${totals.price} MXN</span>
              <span className="text-xs text-[#86868B]">~{totals.duration} min</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Photo Quote Hidden Input & Trigger Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanningPhoto}
              className="h-10 px-3 rounded-xl bg-[#FAF9F7] hover:bg-neutral-100 border border-black/[0.08] text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-98"
            >
              <Camera className="size-3.5 text-rose-600" />
              <span className="hidden sm:inline">Subir Foto</span>
            </button>

            {/* WhatsApp Hybrid Bridge Button */}
            <button
              type="button"
              onClick={handleContinueOnWhatsApp}
              className="h-10 px-3 rounded-xl bg-[#E8F7EE] hover:bg-[#D5EFE0] border border-[#25D366]/30 text-xs font-bold text-[#0F5132] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-98"
              title="Continuar esta cotización en WhatsApp"
            >
              <MessageSquare className="size-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Main Confirm & Book in App Button */}
            <button
              type="button"
              onClick={handleProceed}
              className="h-10 px-4 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-98"
            >
              <span>Agendar en Salón</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
