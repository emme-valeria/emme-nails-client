import React, { useRef, useState } from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { InspirationSelectionWidget } from './InspirationSelectionWidget';
import { SemanticSuggestionsWidget } from './SemanticSuggestionsWidget';
import { UploadCloud, X, Sparkles, Loader2, Bot } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { toast } from 'sonner';
import { analyzeNailReferenceWithGemini, GeminiNailImageAnalysis } from '@/shared/services/geminiService';
import { cn } from '@/shared/utils';

export function ReferenceImagesWidget({ onAiAnalysisComplete }: { onAiAnalysisComplete?: (analysis: GeminiNailImageAnalysis) => void }) {
  const { state, dispatch } = useQuoteFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiNailImageAnalysis | null>(null);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Extremos el base64 de la url
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      dispatch({ type: 'ADD_REFERENCE_IMAGE', payload: url });
      
      // Attempt AI Analysis
      try {
        setIsAnalyzing(true);
        toast.info('Analizando diseño con IA de alta velocidad...');
        
        const result = await analyzeNailReferenceWithGemini(file, file.type);
        setAnalysisResult(result);
        
        if (onAiAnalysisComplete) {
           onAiAnalysisComplete(result);
        }
        
        // Auto-update context (If quote-flow supports dispatching these types of updates)
        if (result.detectedLength) {
           let mapLength = 'medium';
           if (result.detectedLength.includes('Corto')) mapLength = 'short';
           if (result.detectedLength.includes('Largo (L)')) mapLength = 'long';
           if (result.detectedLength.includes('XL')) mapLength = 'xl';
           dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { length: mapLength as any } });
        }
        if (result.detectedShape) {
           let mapShape = 'almond';
           if (result.detectedShape.includes('Cuadrada')) mapShape = 'square';
           if (result.detectedShape.includes('Ovalada')) mapShape = 'oval';
           if (result.detectedShape.includes('Stiletto')) mapShape = 'stiletto';
           if (result.detectedShape.includes('Coffin')) mapShape = 'coffin';
           dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { shape: mapShape as any } });
        }
        
        toast.success('¡Cotización generada exitosamente!');
      } catch (err) {
        console.error(err);
        toast.error('Ocurrió un error al analizar la foto.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-[#1D1D1F]">Galería & Referencias de Diseño</h3>
        <p className="text-[11px] text-[#86868B]">
          Sube tus capturas o selecciona del portafolio. La IA identificará los detalles para calcular tu cotización.
        </p>
      </div>

      {/* Upload Box */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSimulateUpload}
        accept="image/*"
        className="hidden"
      />

      <div
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={cn("p-4 rounded-2xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 transition-all text-center space-y-1.5 cursor-pointer group", isAnalyzing && "opacity-60 cursor-not-allowed")}
      >
        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
          {isAnalyzing ? <Loader2 className="size-4.5 animate-spin" /> : <UploadCloud className="size-4.5" />}
        </div>
        <div>
          <p className="text-xs font-bold text-[#1D1D1F]">{isAnalyzing ? 'Procesando tu diseño...' : 'Toca para subir fotos desde tu dispositivo'}</p>
          <p className="text-[10px] text-[#86868B]">{isAnalyzing ? 'Calculando complejidad y precios' : 'Capturas de pantalla o fotos de inspiración'}</p>
        </div>
      </div>
      
      {/* AI Quote Result */}
      {analysisResult && (
         <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-50/50 space-y-3 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
             <div className="flex items-center gap-2">
                <Bot className="size-4 text-amber-600" />
                <h4 className="text-xs font-black text-amber-900">Cotización Automática (EMME AI)</h4>
             </div>
             
             <div className="grid grid-cols-2 gap-2 text-xs">
                 <div className="bg-white p-2 rounded-xl border border-amber-100">
                     <p className="text-[9px] text-amber-600 uppercase font-bold">Precio Estimado</p>
                     <p className="font-black text-[#1D1D1F]">${analysisResult.totalEstimatedPrice} MXN</p>
                 </div>
                 <div className="bg-white p-2 rounded-xl border border-amber-100">
                     <p className="text-[9px] text-amber-600 uppercase font-bold">Tiempo Aprox.</p>
                     <p className="font-black text-[#1D1D1F]">{analysisResult.estimatedDurationMinutes} min</p>
                 </div>
             </div>
             
             <p className="text-[10px] text-amber-800 italic leading-relaxed">
                 "{analysisResult.description}"
             </p>
             
             <div className="flex flex-wrap gap-1">
                 {analysisResult.detectedColors.map((color, idx) => (
                     <span key={idx} className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm bg-white border border-amber-200 text-amber-700">
                         {color}
                     </span>
                 ))}
                 <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 border border-amber-300 text-amber-800">
                     Complejidad: {analysisResult.complexity}
                 </span>
             </div>
         </div>
      )}

      {/* Uploaded Gallery */}
      {state.referenceImages.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block">
            Imágenes cargadas ({state.referenceImages.length}):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {state.referenceImages.map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-black/[0.06] h-22 group bg-neutral-100">
                <img src={img} alt="Inspo" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'REMOVE_REFERENCE_IMAGE', payload: idx })}
                  className="absolute top-1 right-1 size-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semantic AI Suggestions */}
      <SemanticSuggestionsWidget />

      {/* Structured Inspiration Library Widget */}
      <InspirationSelectionWidget />
    </div>
  );
}
