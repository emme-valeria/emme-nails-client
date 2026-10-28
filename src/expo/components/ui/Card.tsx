import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { emmeTokens } from '../../theme';

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps['onPress'];
  accessibilityLabel?: string;
};

export function Card({ children, className, style, onPress, accessibilityLabel }: CardProps) {
  const cardStyle = [styles.card, style];
  if (onPress) return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={({ pressed }) => [cardStyle, pressed && styles.pressed]} className={className}>{children}</Pressable>;
  return <View style={cardStyle} className={className}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: emmeTokens.radius.card, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, backgroundColor: emmeTokens.modes.neutral.surface, padding: emmeTokens.spacing.md, shadowColor: emmeTokens.shadow.card.color, shadowOpacity: emmeTokens.shadow.card.opacity, shadowRadius: emmeTokens.shadow.card.radius, shadowOffset: { width: 0, height: emmeTokens.shadow.card.y }, elevation: emmeTokens.shadow.card.elevation },
  pressed: { opacity: 0.9 },
});
