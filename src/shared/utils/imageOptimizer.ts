/**
 * Client-Side Image Optimizer for AI Multimodal Analysis
 * Drastically reduces upload latency and payload size (from 10-20MB down to ~80-120KB)
 * while preserving high visual fidelity for nail art, colors, shapes, and textures.
 */

export interface OptimizedImageResult {
  base64: string;
  mimeType: string;
  dataUrl: string;
  originalSizeKB?: number;
  optimizedSizeKB?: number;
}

/**
 * Compresses and scales an image File, Blob, or URL to optimal AI vision dimensions.
 * Max dimension: 1024px (ideal resolution for Gemini Vision without token bloat)
 * Quality: 0.82 JPEG
 */
export async function optimizeImageForAI(
  source: File | Blob | string,
  maxDimension: number = 1024,
  quality: number = 0.82
): Promise<OptimizedImageResult> {
  return new Promise((resolve) => {
    // 1. If source is already a small data URL or string
    const fallback = (rawUrl: string) => {
      const match = rawUrl.match(/^data:(.*?);base64,(.*)$/);
      if (match) {
        resolve({
          base64: match[2],
          mimeType: match[1] || 'image/jpeg',
          dataUrl: rawUrl,
        });
      } else {
        const parts = rawUrl.split(',');
        resolve({
          base64: parts[1] || parts[0],
          mimeType: 'image/jpeg',
          dataUrl: rawUrl.startsWith('data:') ? rawUrl : `data:image/jpeg;base64,${parts[1] || parts[0]}`,
        });
      }
    };

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let objectUrlToRevoke: string | null = null;

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaled dimensions maintaining aspect ratio
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            if (typeof source === 'string') fallback(source);
            else fallback(img.src);
            return;
          }

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Render high quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64 = optimizedDataUrl.replace(/^data:image\/jpeg;base64,/, '');

          if (objectUrlToRevoke) {
            URL.revokeObjectURL(objectUrlToRevoke);
          }

          resolve({
            base64,
            mimeType: 'image/jpeg',
            dataUrl: optimizedDataUrl,
            optimizedSizeKB: Math.round((base64.length * 0.75) / 1024),
          });
        } catch {
          if (typeof source === 'string') fallback(source);
          else fallback(img.src);
        }
      };

      img.onerror = () => {
        if (typeof source === 'string') fallback(source);
        else {
          const reader = new FileReader();
          reader.onload = (e) => fallback((e.target?.result as string) || '');
          reader.onerror = () => resolve({ base64: '', mimeType: 'image/jpeg', dataUrl: '' });
          if (source instanceof Blob) reader.readAsDataURL(source);
          else resolve({ base64: '', mimeType: 'image/jpeg', dataUrl: '' });
        }
      };

      if (typeof source === 'string') {
        img.src = source;
      } else if (source instanceof Blob) {
        objectUrlToRevoke = URL.createObjectURL(source);
        img.src = objectUrlToRevoke;
      } else {
        resolve({ base64: '', mimeType: 'image/jpeg', dataUrl: '' });
      }
    } catch {
      resolve({ base64: '', mimeType: 'image/jpeg', dataUrl: typeof source === 'string' ? source : '' });
    }
  });
}
