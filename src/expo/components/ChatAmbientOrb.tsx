import { useEffect, useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, ClipPath, Defs, FeGaussianBlur, Filter, G, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useFrameCallback, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import type { OrbState } from './Orb.types';

type Props = {
  width: number;
  height: number;
  topInset: number;
  state: OrbState;
  pulse?: number;
  compact?: boolean;
};
const AnimatedGroup = Animated.createAnimatedComponent(G);
const SPOT_INSET = 190 * 0.14;
const SPOT_SIZE = 190 * 0.72;

/** Flat frosted glass: stationary white rim, blurred colour inside, halo outside. */
export function ChatAmbientOrb({ width, height, topInset, state, compact = false }: Props) {
  const id = `emme-orb-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const reducedMotion = useReducedMotion();
  const clock = useSharedValue(0);
  const speed = useSharedValue(1);
  const spotScale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const placementScale = useSharedValue(1);
  const placementY = useSharedValue(0);
  const diameter = Math.min(width * 0.49, 190);
  const frame = useFrameCallback(({ timeSincePreviousFrame }) => {
    clock.value += Math.min(timeSincePreviousFrame ?? 0, 48) / 1000 * speed.value;
  }, false);

  useEffect(() => {
    frame.setActive(!reducedMotion);
    return () => frame.setActive(false);
  }, [frame, reducedMotion]);

  useEffect(() => {
    const timing = { duration: reducedMotion ? 0 : 800, easing: Easing.inOut(Easing.cubic) };
    speed.value = withTiming(state === 'thinking' ? 1.7 : state === 'responding' ? 1.3 : state === 'typing' ? 1.1 : state === 'error' ? 0.45 : 1, timing);
    spotScale.value = withTiming(state === 'thinking' ? 1.06 : state === 'typing' ? 1.03 : 1, timing);
    opacity.value = withTiming(state === 'error' ? 0.65 : 1, timing);
  }, [opacity, reducedMotion, speed, spotScale, state]);

  const drift = useAnimatedProps(() => {
    const progress = (1 - Math.cos(clock.value * Math.PI / 9)) / 2;
    const scale = (1 + progress * 0.08) * spotScale.value;
    return { transform: `translate(95 95) rotate(${progress * 40}) scale(${scale}) translate(-95 -95)` };
  });
  useEffect(() => {
    const timing = { duration: reducedMotion ? 0 : 500, easing: Easing.out(Easing.cubic) };
    placementScale.value = withTiming(compact ? 52 / diameter : 1, timing);
    placementY.value = withTiming(compact ? 98 - (height / 2 - topInset) : 0, timing);
  }, [compact, diameter, height, placementScale, placementY, reducedMotion, topInset]);
  const appearance = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: placementY.value }, { scale: placementScale.value }] as const }));
  // Overscan for the halo; the disc itself remains 190 SVG units across.
  const size = diameter * 470 / 190;

  return <Animated.View pointerEvents="none" accessible={false} style={[styles.stage, { width: size, height: size, left: (width - size) / 2, top: (height - size) / 2 - topInset }, appearance]}>
    <Svg width={size} height={size} viewBox="-140 -140 470 470">
      <Defs>
        <ClipPath id={`${id}-clip`}><Circle cx="95" cy="95" r="95" /></ClipPath>
        <Filter id={`${id}-blur`} filterUnits="userSpaceOnUse" x="-100" y="-100" width="390" height="390">
          <FeGaussianBlur stdDeviation="22" />
        </Filter>
        <RadialGradient id={`${id}-white-halo`}>
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <Stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}-pink-halo`}>
          <Stop offset="0%" stopColor="#F3A6BF" stopOpacity="0.35" />
          <Stop offset="48%" stopColor="#F3A6BF" stopOpacity="0.16" />
          <Stop offset="100%" stopColor="#F3A6BF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}-rose`} cx="30%" cy="70%" r="65%">
          <Stop offset="0%" stopColor="#E78AA8" />
          <Stop offset="38.46%" stopColor="#E78AA8" />
          <Stop offset="100%" stopColor="#E78AA8" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}-peach`} cx="72%" cy="40%" r="65%">
          <Stop offset="0%" stopColor="#FFB795" />
          <Stop offset="33.85%" stopColor="#FFB795" />
          <Stop offset="100%" stopColor="#FFB795" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}-blush`} cx="40%" cy="28%" r="65%">
          <Stop offset="0%" stopColor="#F3A6BF" />
          <Stop offset="30.77%" stopColor="#F3A6BF" />
          <Stop offset="100%" stopColor="#F3A6BF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}-frost`}>
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="52%" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="84%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </RadialGradient>
      </Defs>
      <Circle cx="95" cy="95" r="220" fill={`url(#${id}-white-halo)`} />
      <Circle cx="95" cy="95" r="160" fill={`url(#${id}-pink-halo)`} />
      <Circle cx="95" cy="95" r="95" fill="#FFFFFF" />
      <G clipPath={`url(#${id}-clip)`}>
        <AnimatedGroup animatedProps={drift}>
          <G filter={`url(#${id}-blur)`}>
            {/* SVG paints back to front, matching the CSS background stack. */}
            <Rect x={SPOT_INSET} y={SPOT_INSET} width={SPOT_SIZE} height={SPOT_SIZE} fill={`url(#${id}-blush)`} />
            <Rect x={SPOT_INSET} y={SPOT_INSET} width={SPOT_SIZE} height={SPOT_SIZE} fill={`url(#${id}-peach)`} />
            <Rect x={SPOT_INSET} y={SPOT_INSET} width={SPOT_SIZE} height={SPOT_SIZE} fill={`url(#${id}-rose)`} />
          </G>
        </AnimatedGroup>
      </G>
      <Circle cx="95" cy="95" r="95" fill={`url(#${id}-frost)`} />
    </Svg>
  </Animated.View>;
}

const styles = StyleSheet.create({ stage: { position: 'absolute', overflow: 'visible', zIndex: 0 } });
