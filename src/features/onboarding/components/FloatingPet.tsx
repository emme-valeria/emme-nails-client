import React, { useEffect, useRef, useState } from 'react';

interface FloatingPetProps {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
}

export function FloatingPet({ src, alt = 'EMME Mascot', className = '', size = 220 }: FloatingPetProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          if (isMounted) setProcessedSrc(src);
          return;
        }

        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 600;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample background color from the 4 corners
        const cornerSamples = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1],
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        for (const [x, y] of cornerSamples) {
          const idx = (y * width + x) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        }
        bgR /= 4;
        bgG /= 4;
        bgB /= 4;

        // Transparent background conversion with smooth alpha transition
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Compute color distance to background
          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );

          // If pixel is very bright white/light off-white background
          const brightness = (r + g + b) / 3;

          if (dist < 32 || (brightness > 242 && dist < 50)) {
            data[i + 3] = 0; // 100% transparent
          } else if (dist < 55) {
            // Smooth edge feathering
            const alphaFactor = (dist - 32) / 23;
            data[i + 3] = Math.min(data[i + 3], Math.round(alphaFactor * 255));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        if (isMounted) {
          setProcessedSrc(dataUrl);
        }
      } catch (err) {
        console.warn('Could not process pet transparency:', err);
        if (isMounted) setProcessedSrc(src);
      }
    };

    img.onerror = () => {
      if (isMounted) setProcessedSrc(src);
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={processedSrc || src}
        alt={alt}
        className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(224,82,134,0.18)]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
