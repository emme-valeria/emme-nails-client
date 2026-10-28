import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { emmeTokens } from '../../theme';

type BadgeTone = 'brand' | 'success' | 'warning' | 'error' | 'neutral';
const tones = {
  brand: { background: emmeTokens.brand.primarySoft, foreground: emmeTokens.brand.primary },
  success: { background: emmeTokens.semantic.successBackground, foreground: emmeTokens.semantic.success },
  warning: { background: emmeTokens.semantic.warningBackground, foreground: emmeTokens.semantic.warning },
  error: { background: emmeTokens.semantic.errorBackground, foreground: emmeTokens.semantic.error },
  neutral: { background: emmeTokens.modes.neutral.surfaceSubtle, foreground: emmeTokens.modes.neutral.secondary },
} as const;

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <View style={[styles.badge, { backgroundColor: tones[tone].background }]}><Text style={[styles.text, { color: tones[tone].foreground }]}>{children}</Text></View>;
}

const styles = StyleSheet.create({ badge: { minHeight: 26, alignSelf: 'flex-start', justifyContent: 'center', borderRadius: 999, paddingHorizontal: 10 }, text: { fontSize: 11, fontWeight: '700' } });
