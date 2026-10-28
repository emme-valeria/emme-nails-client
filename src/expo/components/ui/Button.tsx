import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { emmeTokens } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  className?: string;
};

export function Button({ children, variant = 'primary', size = 'medium', loading = false, disabled, className, ...props }: ButtonProps) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const variantStyle = styles[variant];
  const sizeStyle = styles[size];

  return <AnimatedPressable
    {...props}
    accessibilityRole="button"
    accessibilityState={{ disabled: Boolean(disabled || loading), busy: loading }}
    disabled={disabled || loading}
    onPressIn={(event) => {
      if (!reduceMotion) scale.value = withSpring(0.975, { damping: 18, stiffness: 300 });
      props.onPressIn?.(event);
    }}
    onPressOut={(event) => {
      scale.value = withSpring(1, { damping: 16, stiffness: 240 });
      props.onPressOut?.(event);
    }}
    style={[styles.base, variantStyle, sizeStyle, animatedStyle, (disabled || loading) && styles.disabled]}
    className={className}
  >
    {loading ? <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : emmeTokens.brand.primary} /> : <View style={styles.content}>{children}</View>}
  </AnimatedPressable>;
}

const styles = StyleSheet.create({
  base: { minHeight: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 18 },
  primary: { backgroundColor: emmeTokens.brand.primary },
  secondary: { backgroundColor: emmeTokens.brand.primarySoft },
  outline: { backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: emmeTokens.semantic.error },
  small: { minHeight: 44, paddingHorizontal: 15 },
  medium: { minHeight: 48, paddingHorizontal: 20 },
  large: { minHeight: 54, paddingHorizontal: 24 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  disabled: { opacity: 0.48 },
});
