import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, Camera, Check, ChevronDown, Image as ImageIcon,
  Keyboard, Minus, Plus, RotateCcw, Sparkles, X, Zap, ZapOff,
} from 'lucide-react';
import { EmmeMascotMotion } from '@/shared/components/EmmeMascotMotion';
import { DEFAULT_SALON_CATALOG } from '@/domain/quotes/services/nail-semantic-pricing-engine';
import {
  analyzeNailDescriptionWithGemini,
  analyzeNailReferenceWithGemini,
  GeminiNailImageAnalysis,
} from '@/shared/services/geminiService';
import { getNailBasePrice, getNailDetailDuration, getNailDetailUnitPrice } from '@/features/assisted-design/config/quote-estimation';
import { triggerConfirmedVibration, triggerSelectionVibration, triggerStepVibration } from '@/shared/utils/haptics';
import { toast } from 'sonner';

type Phase = 'entry' | 'capture' | 'preview' | 'scanning' | 'details' | 'calculating' | 'quote' | 'error';
type CaptureMode = 'design' | 'current';
type Feature = { id: string; title: string; detail: string; unitPrice: number; quantity: number; included?: boolean };
type RecentReference = { url: string; label: string };

interface Props {
  onCancel?: () => void;
  onProceedToBooking?: (payload: { imageUrl: string; analysis: GeminiNailImageAnalysis | null; shape: string; length: string; totalPrice: number; durationMins: number; features: Feature[] }) => void;
  prefilledImageUrl?: string;
  className?: string;
}

const SAMPLES: RecentReference[] = [
  { label: 'Glazed almendra', url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85' },
  { label: 'French moderno', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85' },
  { label: 'Milky minimal', url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85' },
];

const SCAN_STEPS = ['Reconociendo forma y largo…', 'Detectando técnica…', 'Contando detalles y piedras…'];
const DISPLAY_TITLES: Record<string, string> = {
  'Efecto Glazed / Chrome': 'Efecto glazed / chrome',
  'French Tips Mano Alzada': 'Diseño francés',
  'Cristalería Swarovski / 3D': 'Piedras y joyería',
};
const titleClass = 'font-[var(--font-editorial),Georgia,serif] tracking-[-0.035em]';

function getDetectedFeatures(result: GeminiNailImageAnalysis): Feature[] {
  const extras = (result.detectedExtras || []).map((extra, index) => {
    const quantity = Math.max(1, Math.min(10, Math.round(extra.quantity || 1)));
    return {
      id: `detail-${index}-${extra.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: DISPLAY_TITLES[extra.name] || extra.name,
      detail: `${quantity} ${quantity === 1 ? 'uña o pieza' : 'uñas o piezas'}`,
      unitPrice: getNailDetailUnitPrice(extra.name),
      quantity,
    };
  });
  return [
    { id: 'base', title: result.recommendedService || result.technique, detail: result.technique, unitPrice: getNailBasePrice(result.technique), quantity: 1 },
    ...extras,
  ];
}

function createManualAnalysis(description = ''): GeminiNailImageAnalysis {
  const technique = /ac[rí]lic/i.test(description) ? 'Acrílico Escultural' : 'Soft Gel / Gel-X';
  return {
    nailsDetected: true,
    technique,
    recommendedService: technique === 'Acrílico Escultural' ? 'Acrílico Escultural' : 'Extensiones Soft Gel (Gel-X)',
    complexity: 'Intermedio',
    detectedStyle: description || 'Diseño personalizado',
    detectedColors: [],
    detectedShape: 'Almendra',
    detectedLength: 'Medio (M)',
    detectedExtras: [],
    estimatedDurationMinutes: 75,
    basePrice: getNailBasePrice(technique),
    artPrice: 0,
    totalEstimatedPrice: getNailBasePrice(technique),
    description: description || 'Puedes personalizar los detalles de tu diseño.',
    stylistTip: 'Tu manicurista confirmará el precio final al revisar tus uñas.',
  };
}

export function EmmeCameraScanFlow({ onCancel, onProceedToBooking, prefilledImageUrl, className = '' }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(prefilledImageUrl ? 'preview' : 'entry');
  const [image, setImage] = useState<string | null>(prefilledImageUrl ?? null);
  const [captureMode, setCaptureMode] = useState<CaptureMode>('design');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [analysis, setAnalysis] = useState<GeminiNailImageAnalysis | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [shape, setShape] = useState('Almendra');
  const [length, setLength] = useState('Medio (M)');
  const [cameraReady, setCameraReady] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [recent, setRecent] = useState<RecentReference[]>([]);
  const [description, setDescription] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanProgressRef = useRef(0);
  const sourceFileRef = useRef<File | Blob | null>(null);
  const total = useMemo(() => {
    const featureTotal = features.reduce((sum, feature) => sum + (feature.included ? 0 : feature.unitPrice * feature.quantity), 0);
    const lengthCode = length.startsWith('Corto') ? 'S' : length.startsWith('Largo (L)') ? 'L' : length.startsWith('Extra') ? 'XL' : 'M';
    const normalizedShape = shape.toLowerCase().replace('cuadrada', 'square').replace('almendra', 'almond').replace('ovalada', 'oval');
    return featureTotal + (DEFAULT_SALON_CATALOG.lengthSurcharges[lengthCode] || 0) + (DEFAULT_SALON_CATALOG.shapeSurcharges[normalizedShape as keyof typeof DEFAULT_SALON_CATALOG.shapeSurcharges] || 0);
  }, [features, length, shape]);
  const baseTotal = useMemo(() => features.find((feature) => feature.id === 'base')?.unitPrice ?? 0, [features]);
  const detailTotal = total - baseTotal;
  const duration = useMemo(() => {
    const totalMinutes = analysis?.estimatedDurationMinutes || 75;
    const originalDetailMinutes = (analysis?.detectedExtras || []).reduce((sum, detail) => sum + getNailDetailDuration(detail.name) * Math.max(1, detail.quantity || 1), 0);
    const currentDetailMinutes = features.filter((feature) => feature.id !== 'base').reduce((sum, feature) => sum + getNailDetailDuration(feature.title) * feature.quantity, 0);
    return Math.min(150, Math.max(35, totalMinutes - originalDetailMinutes + currentDetailMinutes));
  }, [analysis, features]);
  const totalMotion = prefersReducedMotion ? { duration: 0.18 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    if (phase !== 'capture' || !navigator.mediaDevices?.getUserMedia) return;
    let mounted = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }).then((stream) => {
      if (!mounted) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
    }).catch(() => { if (mounted) setCameraReady(false); });
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraReady(false);
      setFlashOn(false);
    };
  }, [phase]);

  useEffect(() => {
    if (!prefilledImageUrl) return;
    const timer = window.setTimeout(() => { void analyzeImage(prefilledImageUrl); }, 0);
    return () => window.clearTimeout(timer);
    // The initial URL is the only automatic analysis trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'scanning') return;
    const messageTimer = window.setInterval(() => setScanStep((step) => (step + 1) % SCAN_STEPS.length), 1400);
    const progressTimer = window.setInterval(() => {
      setScanProgress((current) => {
        const next = Math.min(90, current + 2.1);
        scanProgressRef.current = next;
        return next;
      });
    }, 80);
    return () => { window.clearInterval(messageTimer); window.clearInterval(progressTimer); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'calculating') return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const next = Math.min(100, ((Date.now() - startedAt) / 1450) * 100);
      setCalculationProgress(next);
      if (next >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => { triggerConfirmedVibration(); setPhase('quote'); }, 180);
      }
    }, 25);
    return () => window.clearInterval(timer);
  }, [phase]);

  const rememberReference = useCallback((url: string, label: string) => {
    setRecent((items) => [{ url, label }, ...items.filter((item) => item.url !== url)].slice(0, 5));
  }, []);

  const openPreview = (url: string, file?: File | Blob) => {
    triggerSelectionVibration();
    setImage(url);
    sourceFileRef.current = file || null;
    setAnalysis(null);
    setAnalysisError('');
    setFeatures([]);
    setScanProgress(0);
    setScanStep(0);
    rememberReference(url, file instanceof File ? file.name : 'Referencia reciente');
    setPhase('preview');
  };

  const acceptAnalysis = (result: GeminiNailImageAnalysis) => {
    if (result.nailsDetected === false) throw new Error(result.rejectionReason || 'No logramos identificar uñas en la imagen. Prueba con otra foto o edita el diseño a mano.');
    if (result.fallback) {
      // Never present the server's sample fallback as if Gemini had inspected this photo.
      // Continue with a transparent, editable base estimate instead of trapping the client.
      const manual = {
        ...createManualAnalysis(description),
        fallback: true,
        error: result.error || 'El análisis automático no estuvo disponible.',
      };
      setAnalysis(manual);
      setShape(manual.detectedShape);
      setLength(manual.detectedLength);
      setFeatures(getDetectedFeatures(manual));
      setAnalysisError(manual.error || '');
      setScanProgress(100);
      setPhase('details');
      return;
    }
    setAnalysis(result);
    setShape(result.detectedShape || 'Almendra');
    setLength(result.detectedLength || 'Medio (M)');
    setFeatures(getDetectedFeatures(result));
    setScanProgress(100);
    setPhase('details');
  };

  async function analyzeImage(source: string | File | Blob) {
    setAnalysisError('');
    setScanProgress(0);
    scanProgressRef.current = 0;
    setPhase('scanning');
    try {
      let analysisSource = source;
      if (typeof source === 'string' && /^(https?:|blob:)/.test(source)) {
        const imageResponse = await fetch(source);
        if (!imageResponse.ok) throw new Error('No pudimos abrir la foto. Elige otra imagen e inténtalo de nuevo.');
        analysisSource = await imageResponse.blob();
      }
      const result = await analyzeNailReferenceWithGemini(analysisSource, 'image/jpeg', captureMode === 'current' ? 'Foto de mis uñas actuales; considera el estado y si puede requerir retiro.' : undefined);
      acceptAnalysis(result);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'No pudimos analizar tu foto.');
      setPhase('error');
    }
  }

  async function analyzeDescription() {
    if (!description.trim()) { toast.error('Cuéntanos un poco sobre el diseño que imaginas.'); return; }
    setAnalysisError('');
    setScanProgress(0);
    scanProgressRef.current = 0;
    setPhase('scanning');
    try {
      const result = await analyzeNailDescriptionWithGemini(description.trim());
      acceptAnalysis(result);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'No pudimos analizar tu descripción.');
      setPhase('error');
    }
  }

  const beginAnalysis = () => {
    triggerStepVibration();
    if (image) void analyzeImage(sourceFileRef.current || image);
    else void analyzeDescription();
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !cameraReady) { fileRef.current?.click(); return; }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => { if (blob) openPreview(URL.createObjectURL(blob), blob); }, 'image/jpeg', 0.9);
  };

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
    if (!track || !capabilities?.torch) { toast.info('El flash no está disponible en esta cámara.'); return; }
    try {
      const next = !flashOn;
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setFlashOn(next);
    } catch { toast.info('No pudimos cambiar el flash de tu cámara.'); }
  };

  const adjustQuantity = (id: string, delta: number) => {
    triggerSelectionVibration();
    setFeatures((items) => items.map((item) => item.id === id && item.id !== 'base'
      ? { ...item, quantity: Math.max(0, Math.min(10, item.quantity + delta)), detail: `${Math.max(0, Math.min(10, item.quantity + delta))} ${item.quantity + delta === 1 ? 'uña o pieza' : 'uñas o piezas'}` }
      : item));
  };

  const addDetail = () => setFeatures((items) => [...items, {
    id: `manual-${Date.now()}`,
    title: 'Nail art sencillo',
    detail: '1 uña o pieza',
    unitPrice: getNailDetailUnitPrice('Nail art'),
    quantity: 1,
  }]);

  const confirmDetails = () => {
    const extraCost = features.filter((item) => item.id !== 'base').reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const basePrice = features.find((item) => item.id === 'base')?.unitPrice ?? getNailBasePrice(analysis?.technique || '');
    const adjustedAnalysis = analysis ? {
      ...analysis,
      detectedShape: shape as GeminiNailImageAnalysis['detectedShape'],
      detectedLength: length as GeminiNailImageAnalysis['detectedLength'],
      detectedExtras: features.filter((item) => item.id !== 'base' && item.quantity > 0).map((item) => ({ name: item.title, quantity: item.quantity, estimatedCost: item.unitPrice })),
      basePrice,
      artPrice: extraCost,
      totalEstimatedPrice: basePrice + extraCost,
    } : null;
    setAnalysis(adjustedAnalysis);
    setCalculationProgress(0);
    setPhase('calculating');
  };

  const title = titleClass;
  const roundedSquare = 'rounded-[25%]';

  return (
    <div className={`relative isolate mx-auto flex min-h-[680px] w-full max-w-[430px] flex-col overflow-hidden rounded-[24px] border border-border bg-background text-foreground shadow-[0_12px_38px_rgba(21,34,52,.12)] sm:min-h-[740px] ${className}`}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label="Elegir foto de uñas"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) openPreview(URL.createObjectURL(file), file);
          event.currentTarget.value = '';
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'entry' && (
          <motion.section key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col items-center justify-between overflow-hidden bg-background px-5 pb-8 pt-10 text-foreground sm:min-h-[740px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_12%,rgba(255,255,255,.85),transparent_42%),linear-gradient(160deg,#f7f9fc_10%,#edf1f6_62%,#f1f3f7)]" />
            <div className="relative z-10 flex w-full items-center justify-between">
              <button type="button" onClick={onCancel} aria-label="Cerrar Cotizar con IA" className="grid size-11 place-items-center rounded-full bg-white/70 text-[#55414b] shadow-sm outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-primary"><X size={19} /></button>
              <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#9b7184]">EMME STUDIO</span><span className="size-11" />
            </div>
            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
              <motion.div animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}><EmmeMascotMotion mood="idle" size={226} /></motion.div>
              <div className="-mt-2 w-full rounded-[30px] bg-white/95 px-6 py-7 text-center shadow-[0_18px_50px_rgba(88,48,67,.12)]">
                <p className="text-[10px] uppercase tracking-[.2em] text-[#a28290]">Una cotización hecha para ti</p>
                <h1 className={`${title} mt-3 text-[34px] leading-[1.05]`}>¿Qué diseño<br />te enamoró?</h1>
                <p className="mx-auto mt-3 max-w-[260px] text-[12px] leading-relaxed text-[#806f77]">Muéstranos una referencia o cuéntanos qué te gustaría llevar en tus uñas.</p>
              </div>
            </div>
            <div className="relative z-10 flex w-full items-center justify-around">
              <button type="button" aria-label="Abrir cámara" onClick={() => { setPhase('capture'); triggerSelectionVibration(); }} className="grid size-12 place-items-center rounded-full bg-white/60 text-[#4e3d45] outline-none focus-visible:ring-2 focus-visible:ring-primary"><Camera size={19} /></button>
              <button type="button" aria-label="Empezar a cotizar" onClick={() => { setPhase('capture'); triggerStepVibration(); }} className="grid size-[68px] place-items-center rounded-full border-4 border-white/60 bg-[#34272e] text-[26px] text-white shadow-xl transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-primary">+</button>
              <button type="button" aria-label="Elegir una foto de galería" onClick={() => fileRef.current?.click()} className="grid size-12 place-items-center rounded-full bg-white/60 text-[#4e3d45] outline-none focus-visible:ring-2 focus-visible:ring-primary"><ImageIcon size={19} /></button>
            </div>
            <button type="button" onClick={() => setPhase('capture')} className="relative z-10 mt-4 min-h-11 text-[11px] text-[#806f77] underline underline-offset-4">Continuar con una foto o escribir</button>
          </motion.section>
        )}

        {phase === 'capture' && (
          <motion.section key="capture" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col justify-between overflow-hidden bg-[#211a1d] p-5 pb-7 text-white sm:min-h-[740px]">
                {!cameraReady && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,#806a73_0%,#49383f_42%,#211a1d_82%)]" />}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/65" />
            <header className="relative z-10 flex items-center justify-between">
              <button type="button" onClick={() => setPhase('entry')} aria-label="Volver" className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur"><X size={19} /></button>
              <div className="flex rounded-full bg-black/25 p-1 text-[12px] backdrop-blur">
                <button type="button" onClick={() => setCaptureMode('design')} className={`min-h-10 rounded-full px-4 font-semibold ${captureMode === 'design' ? 'bg-white/20 text-white' : 'text-white/55'}`}>Diseño</button>
                <button type="button" onClick={() => setCaptureMode('current')} className={`min-h-10 rounded-full px-4 font-semibold ${captureMode === 'current' ? 'bg-white/20 text-white' : 'text-white/55'}`}>Mis uñas</button>
              </div>
              <button type="button" onClick={() => void toggleFlash()} aria-label={flashOn ? 'Apagar flash' : 'Encender flash'} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur">{flashOn ? <Zap size={18} /> : <ZapOff size={18} />}</button>
            </header>
            <div className="relative z-10 my-auto flex flex-col items-center px-1 pb-5 pt-5 text-center">
              <div className={`relative grid aspect-square w-[min(76vw,310px)] place-items-center overflow-hidden ${roundedSquare} border border-white/40 bg-white/5 shadow-[0_0_0_9px_rgba(255,255,255,.07),0_25px_70px_rgba(0,0,0,.3)]`}>
                {cameraReady ? <video ref={videoRef} muted autoPlay playsInline className="absolute inset-0 size-full object-cover" /> : <><div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(248,225,232,.27),transparent_65%)]" /><EmmeMascotMotion mood="idle" size={185} /></>}
                <div className="pointer-events-none absolute inset-4 rounded-[22%] border border-dashed border-white/35" />
                <span className="absolute bottom-4 rounded-full bg-black/40 px-3 py-1.5 text-[10px] text-white/90 backdrop-blur">{captureMode === 'design' ? 'Centra el diseño que te gusta' : 'Enfoca tus uñas actuales'}</span>
              </div>
              <p className={`${title} mt-7 text-[29px] leading-tight`}>{captureMode === 'design' ? 'Tu próxima mani,' : 'Así están tus uñas,'}<br /><span className="italic text-[#f2bdcf]">en una foto.</span></p>
              <p className="mt-2 max-w-[270px] text-[12px] leading-relaxed text-white/70">{captureMode === 'design' ? 'Fotografía o elige el diseño que quieres cotizar.' : 'Una foto nos ayuda a considerar el retiro y el estado actual.'}</p>
              <button type="button" onClick={() => setShowRecent((value) => !value)} aria-expanded={showRecent} className="mt-4 flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-[11px] text-white/90 backdrop-blur"><ImageIcon size={14} />Referencias recientes <ChevronDown className={`size-3 transition-transform ${showRecent ? 'rotate-180' : ''}`} /></button>
              <AnimatePresence>{showRecent && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">{[...recent, ...SAMPLES].slice(0, 5).map((item) => <button type="button" key={`${item.label}-${item.url}`} aria-label={`Usar referencia: ${item.label}`} onClick={() => openPreview(item.url)} className="w-[78px] shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-left"><img src={item.url} alt="" className="h-[65px] w-full object-cover" /><span className="block truncate px-2 py-1.5 text-[9px]">{item.label}</span></button>)}</motion.div>}</AnimatePresence>
            </div>
            <div className="relative z-10 flex items-center justify-around pb-1">
              <button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-16 w-20 flex-col items-center justify-center gap-1.5 text-[10px] text-white/80 focus-visible:ring-2 focus-visible:ring-primary"><span className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-white/10"><ImageIcon size={18} /></span>Galería</button>
              <button type="button" onClick={takePhoto} aria-label="Tomar foto de tus uñas" className="grid size-[76px] place-items-center rounded-full border-[3px] border-white/90 p-1.5 shadow-[0_0_30px_rgba(255,255,255,.2)] focus-visible:ring-2 focus-visible:ring-primary"><span className="size-full rounded-full bg-white transition-transform active:scale-90" /></button>
              <button type="button" onClick={() => { setImage(null); sourceFileRef.current = null; setPhase('preview'); }} aria-label="Escribir descripción del diseño" className="flex min-h-16 w-20 flex-col items-center justify-center gap-1.5 text-[10px] text-white/80 focus-visible:ring-2 focus-visible:ring-primary"><span className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-white/10"><Keyboard size={18} /></span>Escribir</button>
            </div>
          </motion.section>
        )}

        {phase === 'preview' && (
          <motion.section key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 8 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col justify-between overflow-hidden bg-background sm:min-h-[740px]">
            {image && <img src={image} alt="Vista previa de tus uñas" className="absolute inset-0 size-full object-cover" />}
            {image && <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />}
            {!image && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#fff,#f2f5f9_68%,#edf1f6)]" />}
            <header className="relative z-10 flex items-center justify-between p-5 text-white">
              <button type="button" onClick={() => setPhase('capture')} aria-label="Volver a cámara" className={`grid size-11 place-items-center rounded-full ${image ? 'bg-black/30' : 'bg-white/70 text-[#55414b]'}`}><ArrowLeft size={19} /></button>
              <span className={`text-xs font-semibold ${image ? 'drop-shadow' : 'text-[#55414b]'}`}>{image ? 'Tu referencia' : 'Cuéntanos tu idea'}</span>
              {image ? <button type="button" onClick={() => fileRef.current?.click()} aria-label="Cambiar foto" className="grid size-11 place-items-center rounded-full bg-black/30"><ImageIcon size={17} /></button> : <span className="size-11" />}
            </header>
            <motion.div initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }} animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }} transition={prefersReducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 28, stiffness: 250 }} className="relative z-10 rounded-t-[30px] bg-[#fffdfb] px-5 pb-7 pt-3 text-[#30272c] shadow-[0_-12px_40px_rgba(0,0,0,.12)]">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[.14em] text-[#9d8791]">EMME AI · COTIZACIÓN</p><h2 className={`${title} mt-1 text-[25px]`}>{image ? '¿Lista para descubrir tu precio?' : 'Describe el diseño que imaginas'}</h2></div><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f5eaf0] text-[#ac6a87]"><Sparkles size={17} /></span></div>
              {image ? <p className="mt-2 text-[11px] text-[#95858c]">Analizaremos forma, largo, técnica y detalles de tu referencia.</p> : <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Ej. Uñas almendradas nude con french blanco y algunas piedritas…" className="mt-3 w-full resize-none rounded-2xl border border-[#eadde3] bg-white px-3.5 py-3 text-[13px] text-[#40343a] outline-none placeholder:text-[#ad9da4] focus-visible:ring-2 focus-visible:ring-primary" aria-label="Describe el diseño de uñas" />}
              <div className="mt-5 flex gap-2"><button type="button" onClick={() => image ? setPhase('capture') : setDescription('')} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#eadde3] text-[11px] font-medium outline-none active:scale-[.98] focus-visible:ring-2 focus-visible:ring-primary"><RotateCcw size={14} />{image ? 'Otra foto' : 'Borrar'}</button><button type="button" onClick={beginAnalysis} className="flex min-h-12 flex-[1.5] items-center justify-center gap-2 rounded-full bg-[#30272c] text-[11px] font-semibold text-white outline-none active:scale-[.98] focus-visible:ring-2 focus-visible:ring-primary"><Sparkles size={14} />Analizar con IA</button></div>
            </motion.div>
          </motion.section>
        )}

        {phase === 'scanning' && (
          <motion.section key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col justify-between overflow-hidden bg-background p-6 sm:min-h-[740px]">
            <header className="z-10 flex items-center justify-between"><button type="button" onClick={() => setPhase(image ? 'preview' : 'capture')} aria-label="Cancelar análisis" className="grid size-11 place-items-center rounded-full bg-white/80 text-[#463640]"><X size={18} /></button><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9d7b8a]">Emme · análisis visual</span><span className="size-11" /></header>
            <div className="my-auto flex flex-col items-center py-5">
              <div className="relative aspect-square w-[min(72vw,300px)] overflow-hidden rounded-[46%] border-[5px] border-white bg-[#eadde2] shadow-[0_18px_50px_rgba(83,51,67,.16)]">
                {image ? <><img src={image} alt="Referencia de uñas en análisis" className="absolute inset-0 size-full object-cover blur-[3px]" /><img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" style={{ clipPath: `inset(0 0 ${100 - scanProgress}% 0)` }} /></> : <div className="grid size-full place-items-center p-8 text-center text-sm text-[#806f77]">{description}</div>}
                {image && <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"><motion.div animate={prefersReducedMotion ? { opacity: 0 } : { y: ['-25%', '110%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-transparent via-[#fff8fc]/75 to-[#e9a8c5]/15 backdrop-blur-[1px]" /><motion.div animate={prefersReducedMotion ? { opacity: 0 } : { top: ['0%', '100%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} className="absolute inset-x-0 top-0 h-px bg-[#fff] shadow-[0_0_20px_5px_rgba(229,152,189,.6)]" /></div>}
              </div>
              <AnimatePresence mode="wait"><motion.div key={scanStep} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }} className="mt-8 text-center"><h2 className={`${title} text-[23px]`}>{SCAN_STEPS[scanStep]}</h2><div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#a05e7d]"><Sparkles size={13} />Escaneando uñas. Con tecnología IA</div></motion.div></AnimatePresence>
              <div className="mt-5 flex gap-1.5">{SCAN_STEPS.map((_, index) => <motion.span key={index} animate={{ width: index === scanStep ? 22 : 5, opacity: index === scanStep ? 1 : 0.35 }} className="h-[5px] rounded-full bg-[#c87598]" />)}</div>
            </div>
            <motion.div initial={prefersReducedMotion ? { opacity: 0 } : { y: 130 }} animate={prefersReducedMotion ? { opacity: 1 } : { y: [0, -7, 0] }} transition={prefersReducedMotion ? { duration: 0.2 } : { y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }, default: { type: 'spring', damping: 17 } }} className="flex justify-center"><EmmeMascotMotion mood="peeking" size={155} showPawsOnLedge /></motion.div>
          </motion.section>
        )}

        {phase === 'details' && (
          <motion.section key="details" initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col overflow-y-auto bg-card px-5 pb-5 pt-3 sm:min-h-[740px]">
            <motion.div initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }} animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }} transition={prefersReducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 27, stiffness: 240 }} className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-white/30" />
              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
                <div className="flex items-start justify-between"><div><span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#b17c91]">PROPUESTA EMME</span><h2 className={`${title} mt-1 text-[27px]`}>Así vemos tu diseño</h2></div><button type="button" aria-label="Volver a elegir foto" onClick={() => setPhase('capture')} className="grid size-11 place-items-center rounded-full bg-[#f4ecef] focus-visible:ring-2 focus-visible:ring-primary"><X size={17} /></button></div>
              {analysis?.fallback && <div role="status" className="mt-3 rounded-2xl border border-[#ead6df] bg-[#fbf1f5] px-3.5 py-3 text-[11px] leading-relaxed text-[#765666]"><strong className="block text-[#654452]">Estimado manual; no se analizó la foto con IA.</strong><span>{analysisError || 'Puedes ajustar el servicio y agregar los detalles que quieras cotizar.'} Configura GEMINI_API_KEY en el servidor para activar el análisis automático.</span></div>}
              {image && <div className="mt-4 flex h-[100px] items-center gap-3 overflow-hidden rounded-[22px] bg-[#f4ebee] p-2.5"><img src={image} alt="Tu diseño de referencia" className="size-[78px] shrink-0 rounded-[17px] object-cover" /><div className="min-w-0"><span className="flex items-center gap-1 text-[10px] text-[#a8798d]"><Sparkles size={12} />REFERENCIA ANALIZADA</span><p className="mt-1 truncate text-[13px] font-semibold">{analysis?.detectedStyle || 'Diseño personalizado'}</p><p className="mt-1 text-[10px] text-[#897a80]">Ajusta los detalles y cantidades.</p></div></div>}
              <div className="mt-4 flex items-center justify-between"><h3 className="text-[12px] font-semibold">Detalles detectados</h3><span className="text-[10px] text-[#9e8a92]">Precios por pieza en MXN</span></div>
              <div className="mt-2 space-y-2">
                {features.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : index * 0.06, duration: 0.28 }} className="flex min-h-[68px] items-center gap-2 rounded-[18px] border border-[#f0e7eb] bg-white px-3 py-2.5 shadow-[0_4px_15px_rgba(78,52,65,.03)]">
                    <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">{item.title}</p><p className="mt-0.5 truncate text-[10px] text-[#9b8b91]">{item.detail} · ${item.unitPrice} c/u</p></div>
                    {item.id === 'base' ? <span className="shrink-0 rounded-full bg-[#f8edf1] px-2.5 py-1.5 text-[10px] font-semibold text-[#a05e7d]">${item.unitPrice}</span> : <div className="flex shrink-0 items-center gap-2"><button type="button" aria-label={`Quitar una unidad de ${item.title}`} onClick={() => adjustQuantity(item.id, -1)} className="grid size-9 place-items-center rounded-full bg-[#f8f1f3] text-[#785c6b] focus-visible:ring-2 focus-visible:ring-primary"><Minus size={14} /></button><span className="w-5 text-center text-xs font-semibold tabular-nums">{item.quantity}</span><button type="button" aria-label={`Agregar una unidad de ${item.title}`} onClick={() => adjustQuantity(item.id, 1)} className="grid size-9 place-items-center rounded-full bg-[#f8f1f3] text-[#785c6b] focus-visible:ring-2 focus-visible:ring-primary"><Plus size={14} /></button></div>}
                  </motion.div>
                ))}
              </div>
              <button type="button" onClick={addDetail} className="mt-2 flex min-h-11 items-center gap-2 px-2 text-[11px] font-medium text-[#9b7184] focus-visible:ring-2 focus-visible:ring-primary"><Plus size={15} />Añadir detalle</button>
              <div className="mt-3 grid grid-cols-2 gap-3"><label className="text-[10px] text-[#9b858f]">Forma<select value={shape} onChange={(event) => setShape(event.target.value)} className="mt-1 block min-h-11 w-full rounded-xl border border-[#eee2e7] bg-white px-3 text-[11px] text-[#43343b] outline-none focus-visible:ring-2 focus-visible:ring-primary">{['Almendra', 'Cuadrada', 'Coffin', 'Stiletto', 'Ovalada', 'Natural'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-[10px] text-[#9b858f]">Largo<select value={length} onChange={(event) => setLength(event.target.value)} className="mt-1 block min-h-11 w-full rounded-xl border border-[#eee2e7] bg-white px-3 text-[11px] text-[#43343b] outline-none focus-visible:ring-2 focus-visible:ring-primary">{['Corto (S)', 'Medio (M)', 'Largo (L)', 'Extra Largo (XL)'].map((item) => <option key={item}>{item}</option>)}</select></label></div>
              <div className="sticky bottom-0 mt-auto border-t border-border bg-card pt-3">
                <div className="mb-2 flex items-center justify-between text-[11px]"><span className="text-[#8e7b83]">Estimado actualizado</span><span className="text-[17px] font-semibold">${total.toLocaleString('es-MX')} <small className="text-[10px] font-normal text-[#95838a]">MXN</small></span></div>
                <button type="button" onClick={confirmDetails} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#392831] text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(57,40,49,.18)] transition-transform active:scale-[.98] focus-visible:ring-2 focus-visible:ring-primary"><Check size={16} />Confirmar detalles</button>
              </div>
            </div>
          </motion.section>
        )}

        {phase === 'calculating' && (
          <motion.section key="calculating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col justify-between overflow-hidden bg-background p-6 sm:min-h-[740px]">
            <div className="flex items-center justify-between"><button type="button" onClick={() => setPhase('details')} aria-label="Editar detalles" className="grid size-11 place-items-center rounded-full bg-white/80"><ArrowLeft size={17} /></button><span className="size-11" /></div>
            <div className="my-auto flex flex-col items-center"><div className="relative grid size-[260px] place-items-center"><svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="108" fill="none" stroke="#eadde3" strokeWidth="5" /><motion.circle cx="120" cy="120" r="108" fill="none" stroke="#c87598" strokeWidth="5" strokeLinecap="round" strokeDasharray={679} animate={{ strokeDashoffset: 679 * (1 - calculationProgress / 100) }} transition={{ duration: prefersReducedMotion ? 0 : 0.08 }} /></svg>{image ? <img src={image} alt="Tu diseño en análisis" className="size-[210px] rounded-full object-cover shadow-lg" /> : <div className="grid size-[210px] place-items-center rounded-full bg-white p-6 text-center text-sm text-[#806f77]">{analysis?.detectedStyle || description}</div>}</div><h2 className={`${title} mt-8 text-center text-[24px]`}>Hmm, algo precioso.</h2><p className="mt-2 text-center text-[11px] text-[#907d86]">Calculando los detalles de tu diseño…</p><span className="mt-3 text-[12px] font-medium text-[#a56b85]">{Math.round(calculationProgress)}%</span></div>
            <motion.div animate={prefersReducedMotion ? undefined : { y: [0, -9, 0], rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="flex justify-center"><EmmeMascotMotion mood="excited" size={155} /></motion.div>
          </motion.section>
        )}

        {phase === 'quote' && (
          <motion.section key="quote" initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={totalMotion} className="relative flex min-h-[680px] flex-1 flex-col overflow-y-auto bg-background p-5 sm:min-h-[740px]">
            <header className="flex items-center justify-between"><button type="button" onClick={() => setPhase('details')} aria-label="Editar tu estimado" className="grid size-11 place-items-center rounded-full bg-white"><ArrowLeft size={16} /></button><div className="text-center"><span className="text-[9px] uppercase tracking-[.18em] text-[#9d818e]">EMME STUDIO</span><p className="text-[11px] font-semibold">Tu cotización</p></div><span className="size-11" /></header>
            <div className="relative my-4 flex items-center gap-2.5"><motion.div initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.55, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={prefersReducedMotion ? { duration: 0.18 } : { type: 'spring', stiffness: 360, damping: 16 }}><EmmeMascotMotion mood="celebrating" size={84} /></motion.div><motion.div initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.75, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={prefersReducedMotion ? { duration: 0.18 } : { type: 'spring', stiffness: 300, damping: 18, delay: 0.08 }} className="relative flex-1 rounded-[20px] border border-white bg-white p-3.5 shadow-sm"><span className="absolute -left-1 top-5 size-3 rotate-45 border-b border-l border-white bg-white" /><p className="text-[12px] font-semibold leading-relaxed">¡Qué lindo diseño! Ya tenemos una idea de lo que quieres. <span className="text-[#b87593]">♡</span></p><p className="mt-1 text-[10px] text-[#96848c]">Revisemos juntas tu estimado.</p></motion.div></div>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.07 } } }} className="overflow-hidden rounded-[25px] border border-white bg-white shadow-[0_8px_28px_rgba(75,50,62,.05)]">
              {image && <img src={image} alt="Tu diseño para cotizar" className="h-[150px] w-full object-cover" />}
              <div className="p-4"><div className="flex items-center justify-between"><span className="text-[10px] text-[#9c8991]">Inversión estimada</span><button type="button" onClick={() => setPhase('details')} className="min-h-10 px-2 text-[10px] font-semibold text-[#ab6985] focus-visible:ring-2 focus-visible:ring-primary">Editar</button></div><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${title} mt-1 text-[37px] tabular-nums`}><CountUp value={total} reducedMotion={!!prefersReducedMotion} /><span className="ml-1 font-sans text-[13px] text-[#98858d]">MXN</span></motion.p>
                <div className="my-3 flex h-2 gap-[3px] overflow-hidden rounded-full bg-[#f3eaee]"><motion.div initial={{ width: 0 }} animate={{ width: `${total ? (baseTotal / total) * 100 : 0}%` }} transition={{ duration: prefersReducedMotion ? 0 : 0.65 }} className="h-full rounded-full bg-[#c87598]" /><motion.div initial={{ width: 0 }} animate={{ width: `${total ? (detailTotal / total) * 100 : 0}%` }} transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.1 }} className="h-full rounded-full bg-[#e7a7bc]" /></div>
                <div className="grid grid-cols-3 gap-2 border-b border-[#f1e9ec] pb-3 text-[9px]"><div><span className="block text-[#9b8790]">Servicio base</span><b className="mt-1 block text-[11px]">${baseTotal}</b></div><div><span className="block text-[#9b8790]">Diseño y extras</span><b className="mt-1 block text-[11px]">${detailTotal}</b></div><div><span className="block text-[#9b8790]">Duración aprox.</span><b className="mt-1 block text-[11px]">{duration} min</b></div></div>
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#faf5f7] p-2.5"><span className="mt-0.5 text-[#b28296]">✦</span><p className="text-[9px] leading-relaxed text-[#89777f]">El precio puede ajustarse tras revisar tus uñas naturales con tu manicurista.</p></div>
                <div className="mt-3 flex items-center justify-between border-t border-[#f1e9ec] pt-3"><p className="text-[10px] font-medium">¿Te parece acertado el estimado?</p><div className="flex gap-1"><button type="button" aria-label="Sí, el estimado parece correcto" aria-pressed={feedback === 'positive'} onClick={() => { setFeedback('positive'); toast.success('¡Gracias por tu opinión!'); }} className={`grid size-10 place-items-center rounded-full ${feedback === 'positive' ? 'bg-[#f2dce5] text-[#9a5475]' : 'bg-[#f8f1f3] text-[#9a6880]'}`}>👍</button><button type="button" aria-label="No, el estimado necesita revisión" aria-pressed={feedback === 'negative'} onClick={() => { setFeedback('negative'); toast.info('Gracias, tu manicurista revisará el estimado contigo.'); }} className={`grid size-10 place-items-center rounded-full ${feedback === 'negative' ? 'bg-[#f2dce5] text-[#9a5475]' : 'bg-[#f8f1f3] text-[#9a6880]'}`}>👎</button></div></div>
              </div>
            </motion.div>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 } } }} className="mt-3 overflow-hidden rounded-[24px] border border-white bg-white px-4 py-3 shadow-[0_8px_28px_rgba(75,50,62,.04)]"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-semibold text-[#9c8991]">Detalles de tu diseño</span><span className="text-[10px] text-[#9c8991]">{shape} · {length}</span></div>{features.map((item) => <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 }, show: { opacity: 1, y: 0 } }} className="flex items-center justify-between border-t border-[#f1e9ec] py-2 text-[10px]"><span className="min-w-0 truncate pr-3 font-medium">{item.title}</span><span className="shrink-0 text-[#8f7e85]">{item.quantity > 1 ? `×${item.quantity} · ` : ''}${item.unitPrice * item.quantity} MXN</span></motion.div>)}</motion.div>
            <button type="button" aria-label="Continuar y elegir horario" onClick={() => { triggerConfirmedVibration(); onProceedToBooking?.({ imageUrl: image || '', analysis, shape, length, totalPrice: total, durationMins: duration, features }); }} className="sticky bottom-3 mx-auto mt-auto flex min-h-[54px] w-[220px] items-center justify-center gap-2 rounded-full bg-[#30272c] text-[13px] font-semibold text-white shadow-xl transition-transform active:scale-[.98] focus-visible:ring-2 focus-visible:ring-primary"><Check size={16} />Cotizar y elegir horario</button>
            <button type="button" onClick={() => { setImage(null); sourceFileRef.current = null; setAnalysis(null); setPhase('capture'); }} className="mx-auto mt-1 flex min-h-10 items-center gap-2 text-[10px] font-medium text-[#937f87] focus-visible:ring-2 focus-visible:ring-primary"><RotateCcw size={13} />Probar con otra foto</button>
          </motion.section>
        )}

        {phase === 'error' && (
          <motion.section key="error" initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={totalMotion} className="flex min-h-[680px] flex-1 flex-col items-center justify-center bg-background p-6 text-center sm:min-h-[740px]">
            <button type="button" onClick={() => setPhase(image ? 'preview' : 'capture')} aria-label="Volver" className="absolute left-5 top-5 grid size-11 place-items-center rounded-full bg-white/80"><ArrowLeft size={18} /></button>
            <EmmeMascotMotion mood="thinking" size={190} />
            <h2 className={`${title} mt-3 text-[28px]`}>No pudimos leer tu diseño</h2><p className="mt-2 max-w-[290px] text-[12px] leading-relaxed text-[#806f77]">{analysisError || 'Intenta con una foto más clara o ajusta los detalles manualmente.'}</p>
            <div className="mt-6 flex w-full max-w-[300px] flex-col gap-2"><button type="button" onClick={() => image ? void analyzeImage(sourceFileRef.current || image) : void analyzeDescription()} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#392831] text-[12px] font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary"><RotateCcw size={15} />Reintentar</button><button type="button" onClick={() => { const manual = createManualAnalysis(description); setAnalysis(manual); setFeatures(getDetectedFeatures(manual)); setPhase('details'); }} className="min-h-12 rounded-full border border-[#d9bdca] bg-white/70 text-[12px] font-semibold text-[#604956] focus-visible:ring-2 focus-visible:ring-primary">Editar a mano</button></div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function CountUp({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);
  useEffect(() => {
    if (reducedMotion) { setDisplayValue(value); return; }
    const start = performance.now();
    const from = displayValue;
    const durationMs = 650;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setDisplayValue(Math.round(from + (value - from) * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Run each time the result value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion]);
  return <>{displayValue.toLocaleString('es-MX')}</>;
}
