import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export function PressableScale({ children, style, className, onPressIn, onPressOut, ...props }: Props) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return <AnimatedPressable
    {...props}
    onPressIn={(event) => {
      if (!reduceMotion) scale.value = withSpring(0.975, { damping: 18, stiffness: 320 });
      onPressIn?.(event);
    }}
    onPressOut={(event) => {
      scale.value = withSpring(1, { damping: 16, stiffness: 260 });
      onPressOut?.(event);
    }}
    style={[style, animatedStyle]}
    className={className}
  >{children}</AnimatedPressable>;
}
