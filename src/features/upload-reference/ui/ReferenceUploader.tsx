import React, { useState } from 'react';
import { ImagePlus, MessageSquare, Sparkles, X, Upload } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

interface ReferenceUploaderProps {
  explanationMode: 'inspiration' | 'upload' | 'describe' | 'combined';
  referenceImages: string[];
  descriptionText: string;
  onModeChange: (mode: 'inspiration' | 'upload' | 'describe' | 'combined') => void;
  onImagesChange: (images: string[]) => void;
  onDescriptionChange: (text: string) => void;
  onNavigateToInspiration?: () => void;
}

export function ReferenceUploader({
  explanationMode,
  referenceImages,
  descriptionText,
  onModeChange,
  onImagesChange,
  onDescriptionChange,
  onNavigateToInspiration
}: ReferenceUploaderProps) {
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const handleSimulatedImageAdd = () => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      const sampleImages = [
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80'
      ];
      const nextImg = sampleImages[referenceImages.length % sampleImages.length];
      onImagesChange([...referenceImages, nextImg]);
      setIsSimulatingUpload(false);
    }, 400);
  };

  const handleRemoveImage = (index: number) => {
    const updated = referenceImages.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4 text-left">
      {/* 3 Main Choice Segmented Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F5F7] rounded-2xl">
        <button
          type="button"
          onClick={() => {
            onModeChange('inspiration');
            if (onNavigateToInspiration) onNavigateToInspiration();
          }}
          className={cn(
            "py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1",
            explanationMode === 'inspiration'
              ? "bg-white text-[#1D1D1F] font-bold shadow-xs"
              : "text-[#86868B] hover:text-[#1D1D1F]"
          )}
        >
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs truncate">Catálogo</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('upload')}
          className={cn(
            "py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1",
            explanationMode === 'upload' || explanationMode === 'combined'
              ? "bg-white text-[#1D1D1F] font-bold shadow-xs"
              : "text-[#86868B] hover:text-[#1D1D1F]"
          )}
        >
          <ImagePlus className="size-4 text-primary" />
          <span className="text-xs truncate">Subir Foto</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('describe')}
          className={cn(
            "py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1",
            explanationMode === 'describe'
              ? "bg-white text-[#1D1D1F] font-bold shadow-xs"
              : "text-[#86868B] hover:text-[#1D1D1F]"
          )}
        >
          <MessageSquare className="size-4 text-primary" />
          <span className="text-xs truncate">Describir</span>
        </button>
      </div>

      {/* Upload area or Image List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">
            Imágenes de Referencia ({referenceImages.length})
          </label>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {referenceImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative size-20 rounded-xl overflow-hidden border border-black/[0.06] group shadow-2xs"
            >
              <img src={imgUrl} alt="Referencia" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 size-5 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={isSimulatingUpload}
            onClick={handleSimulatedImageAdd}
            className="size-20 rounded-xl border border-dashed border-black/20 hover:border-primary bg-[#FBFBFD] flex flex-col items-center justify-center text-[#86868B] hover:text-primary cursor-pointer transition-colors"
          >
            <Upload className="size-4" />
            <span className="text-[10px] font-semibold mt-1">
              {isSimulatingUpload ? '...' : '+ Subir'}
            </span>
          </button>
        </div>
      </div>

      {/* Description Text Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block">
          Notas o Descripción Adicional (Opcional)
        </label>
        <textarea
          rows={3}
          value={descriptionText}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Ej. Me gustaría un todo rosado nude, con una uña de acento con hojilla de oro y efecto cromo sutil..."
          className="w-full p-3 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-[#1D1D1F] placeholder:text-[#86868B]/60 resize-none outline-none"
        />
      </div>
    </div>
  );
}
