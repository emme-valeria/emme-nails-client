const WHITE_CONTRAST_AA = 4.5;

function toRgb(hex: string) {
  const normalized = hex.replace('#', '').trim();
  if (!/^[\da-f]{6}$/i.test(normalized)) return { r: 113, g: 57, b: 79 };
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

function linearize(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const { r, g, b } = toRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(first: string, second: string) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Clamp a sampled image hue until white typography meets WCAG AA (4.5:1). */
export function clampTintForWhiteText(hex: string) {
  if (contrastRatio(hex, '#FFFFFF') >= WHITE_CONTRAST_AA) return hex;

  const rgb = toRgb(hex);
  let low = 0;
  let high = 1;
  for (let step = 0; step < 24; step += 1) {
    const scale = (low + high) / 2;
    const candidate = toHex({ r: rgb.r * scale, g: rgb.g * scale, b: rgb.b * scale });
    if (contrastRatio(candidate, '#FFFFFF') >= WHITE_CONTRAST_AA) low = scale;
    else high = scale;
  }
  return toHex({ r: rgb.r * low, g: rgb.g * low, b: rgb.b * low });
}
