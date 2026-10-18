import React, { useState } from 'react';
import { cn } from '@emme/ui/lib/utils';
import { Sparkles, Wand2, ArrowRight, Palette, Clock, Flame, Zap, Gem, Sparkle, Heart, Camera, Layers } from 'lucide-react';
import { Button, Input, Badge, Dialog, DialogContent } from '@emme/ui';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { useNavigate } from 'react-router-dom';
import { SingleNailMiniPreviewSVG, NailShapeType } from '@/shared/components/NailModelerVisualizerSVG';
import { NailCategoryExtractionCard } from '@/features/assisted-design/ui/NailCategoryExtractionCard';

const nailArtImg = '/src/assets/images/emme_nail_art_preview_1785913648252.jpg';
const spaImg = '/src/assets/images/emme_spa_studio_1785913663313.jpg';

interface AiDesignPrompt {
  id: string;
  title: string;
  description: string;
  tag: string;
  priceExtra: number;
  timeExtra: number;
  shape: string;
  image: string;
}

const AI_TRENDING_DESIGNS: AiDesignPrompt[] = [
  {
    id: 'ai-1',
    title: 'Minimalist Chrome & Nude',
    description: 'Efecto espejo refinado sobre base almendra nude con líneas ultra finas en plata u oro.',
    tag: 'Tendencia #1',
    priceExtra: 15,
    timeExtra: 20,
    shape: 'Almendra',
    image: nailArtImg,
  },
  {
    id: 'ai-2',
    title: 'Aurora Gel & Jelly Spa',
    description: 'Tratamiento de spa combinado con destellos holográficos Aurora Borealis de textura líquida.',
    tag: 'Spa Exclusive',
    priceExtra: 20,
    timeExtra: 25,
    shape: 'Cuadrada Soft',
    image: spaImg,
  },
  {
    id: 'ai-3',
    title: 'Russian E-File Velvet Finish',
    description: 'Manicura rusa de máxima duración con efecto aterciopelado magnético en tonos cuarzo rosa.',
    tag: 'Rusa Top',
    priceExtra: 25,
    timeExtra: 30,
    shape: 'Coffin / Ballerina',
    image: nailArtImg,
  },
  {
    id: 'ai-4',
    title: '3D Coquette Pearls & Y2K French',
    description: 'Líneas micro francesas con acentos de perlas 3D encapsuladas en gel de construcción Rubber.',
    tag: 'Viral 2026',
    priceExtra: 30,
    timeExtra: 35,
    shape: 'Almendra Larga',
    image: spaImg,
  },
];

const PRESET_PROMPTS = [
  { text: 'Chrome Espejo Rosado', icon: Sparkles },
  { text: 'Coquette Bows & Perlas 3D', icon: Gem },
  { text: 'Glass Nails & Flores Discretas', icon: Sparkle },
  { text: 'Minimal Gothic Black Lines', icon: Wand2 },
  { text: 'Baby Boomer Degradado Nude', icon: Heart },
  { text: 'Cat Eye Magnético Velvet', icon: Zap }
];

const NAIL_SHAPES: { name: string; desc: string; shapeType: NailShapeType }[] = [
  { name: 'Almendra', desc: 'Estiliza los dedos', shapeType: 'almond' },
  { name: 'Coffin / Ballerina', desc: 'Moderno & elegante', shapeType: 'coffin' },
  { name: 'Cuadrada Soft', desc: 'Limpia & resistente', shapeType: 'square' },
  { name: 'Stiletto', desc: 'Atrevida & chic', shapeType: 'stiletto' },
];

export function AiDesignAdvisorWidget() {
  const navigate = useNavigate();
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedShape, setSelectedShape] = useState('Almendra');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'shapes' | 'photo_recipe'>('prompt');
  
  const [aiResult, setAiResult] = useState<{
    title: string;
    description: string;
    estimatedPrice: number;
    estimatedDuration: number;
    shape: string;
  } | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleAnalyzePrompt = (promptText?: string) => {
    const textToAnalyze = promptText || customPrompt;
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResult({
        title: `Diseño Personalizado: ${textToAnalyze.slice(0, 26)}...`,
        description: `Análisis EMME AI: "${textToAnalyze}". Formato recomendado: ${selectedShape}. Técnica con base Rubber y acabado de alta durabilidad sin desgaste.`,
        estimatedPrice: 35 + Math.floor(Math.random() * 15),
        estimatedDuration: 45 + Math.floor(Math.random() * 20),
        shape: selectedShape
      });
    }, 1000);
  };

  return (
    <div className="bg-card border border-border rounded-[1.75rem] p-4 sm:p-6 shadow-xs relative overflow-hidden space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-9 sm:size-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="size-4 sm:size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                EMME Design & Style Advisor
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1 mt-0.5">
              Explora estilos, analiza fotos de inspiración y calcula presupuesto detallado
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl self-start sm:self-auto border border-border/50 w-full sm:w-auto justify-stretch">
          <button
            onClick={() => setActiveTab('prompt')}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              activeTab === 'prompt' ? "bg-card text-[#1D1D1F] shadow-xs font-extrabold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Wand2 className="size-3.5 shrink-0" />
            <span>Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('shapes')}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              activeTab === 'shapes' ? "bg-card text-[#1D1D1F] shadow-xs font-extrabold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="size-3.5 shrink-0" />
            <span>Forma & Estilo</span>
          </button>
          <button
            onClick={() => setActiveTab('photo_recipe')}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              activeTab === 'photo_recipe' ? "bg-card text-[#1D1D1F] shadow-xs font-extrabold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Camera className="size-3.5 shrink-0 text-primary" />
            <span>Foto & Receta</span>
          </button>
        </div>
      </div>

      {activeTab === 'photo_recipe' ? (
        <div className="space-y-3">
          <NailCategoryExtractionCard
            imageUrl="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=60"
            imageDescription="Foto de inspiración para extracción de receta técnica, capas y cotizador con confianza"
            variant="dashboard"
            onBookAppointment={() => setIsBookingModalOpen(true)}
            onApplyToQuote={() => navigate('/quotes/new')}
          />
        </div>
      ) : activeTab === 'prompt' ? (

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Wand2 className="size-3.5 text-primary shrink-0" />
              <span>Describe tu idea o estilo deseado:</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ej: Uñas francesas con acabado chrome dorado..."
                className="h-11 bg-white border border-black/[0.08] focus:border-primary rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium flex-1 shadow-2xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyzePrompt()}
              />
              <Button 
                onClick={() => handleAnalyzePrompt()}
                disabled={isAnalyzing || !customPrompt.trim()}
                className="h-11 px-5 rounded-xl sm:rounded-2xl bg-primary hover:brightness-105 text-white font-bold text-xs shrink-0 shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <span className="animate-pulse">Analizando...</span>
                ) : (
                  <>
                    <Zap className="size-4 shrink-0 text-white" />
                    <span>Generar Estimación</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#86868B] block">
              Inspiraciones Rápidas (1-Clic):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((preset, idx) => {
                const IconComponent = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomPrompt(preset.text);
                      handleAnalyzePrompt(preset.text);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-black/[0.06] text-[#1D1D1F] hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <IconComponent className="size-3 text-primary shrink-0" />
                    <span>{preset.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* SHAPES & STYLES TAB */
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#1D1D1F] block">
            Elige tu Forma Preferida para Recibir una Recomendación:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NAIL_SHAPES.map((shape) => {
              const isSelected = selectedShape === shape.name;
              return (
                <div
                  key={shape.name}
                  onClick={() => setSelectedShape(shape.name)}
                  className={cn(
                    "p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 flex flex-col items-center justify-center",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                      : "bg-white border-black/[0.06] hover:bg-neutral-50 text-[#1D1D1F]"
                  )}
                >
                  <div className="py-1">
                    <SingleNailMiniPreviewSVG
                      shape={shape.shapeType}
                      length="medium"
                      finish="glossy"
                      colorHex={isSelected ? '#FFFFFF' : '#E05286'}
                      className="w-7 h-11"
                    />
                  </div>
                  <p className="font-bold text-xs">{shape.name}</p>
                  <p className={cn("text-[10px]", isSelected ? "text-white/80" : "text-[#86868B]")}>
                    {shape.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Prompt Custom Result */}
      {aiResult && (
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-primary/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block flex items-center gap-1">
                <Sparkles className="size-3 shrink-0 text-primary" />
                Resultado de Análisis Exclusivo
              </span>
              <h4 className="font-display font-bold text-sm sm:text-base text-[#1D1D1F]">{aiResult.title}</h4>
              <p className="text-xs text-[#86868B] leading-relaxed">{aiResult.description}</p>
            </div>
            <div className="text-left sm:text-right shrink-0 bg-primary/5 p-2.5 rounded-xl border border-primary/10 w-full sm:w-auto">
              <span className="text-base sm:text-lg font-display font-bold text-[#1D1D1F] block">${aiResult.estimatedPrice} MXN</span>
              <span className="text-[11px] font-semibold text-[#86868B]">{aiResult.estimatedDuration} mins estimados</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex-1 h-11 rounded-[1.25rem] bg-primary hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_12px_30px_rgba(224,82,134,0.3)]"
            >
              <span>Reservar este Diseño con AI</span>
              <ArrowRight className="size-4 shrink-0" />
            </Button>
            <Button
              onClick={() => navigate('/chat')}
              variant="outline"
              className="h-11 px-4 rounded-[1.25rem] text-xs font-semibold border-black/[0.08] hover:bg-[#FBFBFD] flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              <span>Hablar con EMME AI</span>
            </Button>
          </div>
        </div>
      )}

      {/* Gallery Cards - Top 4 Trending Designs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#86868B] flex items-center gap-1.5">
            <Flame className="size-3.5 text-violet-500 fill-primary shrink-0" />
            Tendencias MÁS Solicitadas:
          </span>
          <span className="text-[11px] font-bold text-primary">4 Estilos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AI_TRENDING_DESIGNS.map((design) => (
            <div 
              key={design.id} 
              className="bg-white rounded-2xl border border-black/[0.05] p-3 flex gap-3 items-center hover:border-primary/30 transition-all shadow-2xs group hover:shadow-xs"
            >
              <img 
                src={design.image} 
                alt={design.title}
                className="size-16 sm:size-20 rounded-xl object-cover border border-black/[0.04] shrink-0 group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md truncate">
                    {design.tag}
                  </span>
                  <span className="text-xs font-extrabold text-[#1D1D1F] shrink-0">
                    +${design.priceExtra} MXN
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-[#1D1D1F] truncate">{design.title}</h4>
                <p className="text-[10px] text-[#86868B] line-clamp-1 leading-tight">{design.description}</p>
                
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[9px] font-semibold text-[#86868B] flex items-center gap-1">
                    <Clock className="size-3 shrink-0" /> +{design.timeExtra}m
                  </span>
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-all"
                  >
                    <span>Agendar con AI</span>
                    <ArrowRight className="size-3 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[28px] sm:rounded-[32px] border-none shadow-2xl max-h-[90vh]">
          <AppointmentForm 
            onSuccess={() => setIsBookingModalOpen(false)}
            onCancel={() => setIsBookingModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
