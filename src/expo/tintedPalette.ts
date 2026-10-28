import { useEffect, useState } from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
import { getColors } from 'react-native-image-colors';
import type { ImageColorsResult } from 'react-native-image-colors';
import { clampTintForWhiteText } from './colorContrast';
import { emmeTokens } from './theme';

const FALLBACK_TINT = '#71394F';
export { clampTintForWhiteText } from './colorContrast';

function pickDominantColor(result: ImageColorsResult) {
  if (result.platform === 'ios') return result.primary || result.background;
  return result.darkVibrant || result.vibrant || result.dominant;
}

function resolvedUri(source: ImageSourcePropType) {
  if (typeof source === 'string') return source;
  if (typeof source === 'number') return Image.resolveAssetSource(source)?.uri ?? '';
  if (Array.isArray(source)) return source[0]?.uri ?? '';
  return source.uri ?? '';
}

export function createTintedTheme(dominantColor: string) {
  const safeBackground = clampTintForWhiteText(dominantColor);
  return {
    background: safeBackground,
    dominant: dominantColor,
    foreground: emmeTokens.modes.tinted.foreground,
    secondary: emmeTokens.modes.tinted.secondary,
    muted: emmeTokens.modes.tinted.muted,
    scrimTop: emmeTokens.modes.tinted.scrimTop,
    // This black scrim preserves at least 4.5:1 contrast even over a white pixel.
    scrimBottom: 'rgba(17,12,15,0.82)',
    card: emmeTokens.modes.tinted.surface,
    cardForeground: emmeTokens.modes.neutral.foreground,
    separator: emmeTokens.modes.tinted.separator,
  } as const;
}

export function useTintedImageTheme(source: ImageSourcePropType) {
  const uri = resolvedUri(source);
  const [dominant, setDominant] = useState(FALLBACK_TINT);

  useEffect(() => {
    let active = true;
    if (!uri) return () => { active = false; };

    getColors(uri, { fallback: FALLBACK_TINT, cache: true, key: uri, quality: 'low' })
      .then((result) => {
        const extracted = pickDominantColor(result);
        if (active && extracted) setDominant(extracted);
      })
      .catch(() => {
        if (active) setDominant(FALLBACK_TINT);
      });

    return () => { active = false; };
  }, [uri]);

  return createTintedTheme(dominant);
}
