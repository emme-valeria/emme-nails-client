import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, type ViewStyle, useColorScheme, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Mantiene visible la splash nativa mientras se descarga y carga Inter.
if (Platform.OS !== 'web') {
  void SplashScreen.preventAutoHideAsync().catch(() => undefined);
}

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
const SHIMMER_EASE = Easing.bezier(0.45, 0, 0.25, 1);

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedSplashProps = {
  onFinish: () => void;
};

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const { width: screenWidth } = useWindowDimensions();
  const isDark = useColorScheme() === 'dark';
  const reducedMotion = useReducedMotion();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_800ExtraBold });
  const [isVisible, setIsVisible] = useState(true);
  const [logoSize, setLogoSize] = useState({ width: 0, height: 0 });
  const mounted = useRef(false);
  const onFinishRef = useRef(onFinish);

  const backgroundColor = isDark ? '#0E0E10' : '#FDFDFD';
  const studioColor = isDark ? '#F5F5F7' : '#1D1D1F';
  const fontSize = Math.min(72, Math.max(36, screenWidth * 0.13));
  const letterSpacing = fontSize * -0.02;
  const shimmerWidth = Math.max(logoSize.width * 0.72, 1);

  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1);
  const emmeOpacity = useSharedValue(0);
  const emmeY = useSharedValue(16);
  const emmeScale = useSharedValue(0.96);
  const studioOpacity = useSharedValue(0);
  const studioY = useSharedValue(16);
  const studioScale = useSharedValue(0.96);
  const shimmerX = useSharedValue(-1);
  const shimmerOpacity = useSharedValue(0);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const finish = useCallback(() => {
    if (!mounted.current) return;
    setIsVisible(false);
    onFinishRef.current();
  }, []);

  // Arranca la animación únicamente con la fuente lista y después de ocultar la splash nativa.
  useEffect(() => {
    if (!fontsLoaded || logoSize.width <= 0 || !mounted.current) return;

    let cancelled = false;

    const beginAnimation = async () => {
      if (Platform.OS !== 'web') {
        try {
          await SplashScreen.hideAsync();
        } catch {
          // En algunos entornos de desarrollo la splash nativa ya está oculta.
        }
      }

      if (cancelled || !mounted.current) return;

      if (reducedMotion) {
        emmeOpacity.value = withTiming(1, { duration: 350, easing: EASE_OUT });
        studioOpacity.value = withTiming(1, { duration: 350, easing: EASE_OUT });
        screenOpacity.value = withDelay(
          1650,
          withTiming(0, { duration: 350, easing: EASE_IN }, (finished) => {
            if (finished) runOnJS(finish)();
          }),
        );
        return;
      }

      emmeOpacity.value = withTiming(1, { duration: 900, easing: EASE_OUT });
      emmeY.value = withTiming(0, { duration: 900, easing: EASE_OUT });
      emmeScale.value = withTiming(1, { duration: 900, easing: EASE_OUT });

      studioOpacity.value = withDelay(120, withTiming(1, { duration: 900, easing: EASE_OUT }));
      studioY.value = withDelay(120, withTiming(0, { duration: 900, easing: EASE_OUT }));
      studioScale.value = withDelay(120, withTiming(1, { duration: 900, easing: EASE_OUT }));

      // El haz aparece una vez, atraviesa solo el texto enmascarado y desaparece.
      shimmerX.value = -shimmerWidth;
      shimmerX.value = withDelay(1000, withTiming(logoSize.width + shimmerWidth, { duration: 700, easing: SHIMMER_EASE }));
      shimmerOpacity.value = withDelay(
        1000,
        withSequence(
          withTiming(1, { duration: 80, easing: EASE_OUT }),
          withDelay(540, withTiming(0, { duration: 80, easing: EASE_IN })),
        ),
      );

      screenOpacity.value = withDelay(
        1800,
        withTiming(0, { duration: 450, easing: EASE_IN }, (finished) => {
          if (finished) runOnJS(finish)();
        }),
      );
      screenScale.value = withDelay(1800, withTiming(1.03, { duration: 450, easing: EASE_IN }));
    };

    void beginAnimation();
    return () => {
      cancelled = true;
    };
  }, [fontsLoaded, finish, logoSize.width, reducedMotion, screenOpacity, screenScale, emmeOpacity, emmeY, emmeScale, studioOpacity, studioY, studioScale, shimmerX, shimmerOpacity, shimmerWidth]);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ scale: screenScale.value }],
  }));
  const emmeAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: emmeOpacity.value,
    transform: [{ translateY: emmeY.value }],
  }));
  const emmeScaleAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ scale: emmeScale.value }],
  }));
  const studioAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: studioOpacity.value,
    transform: [{ translateY: studioY.value }],
  }));
  const studioScaleAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ scale: studioScale.value }],
  }));
  const shimmerAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: shimmerOpacity.value,
    transform: [{ translateX: shimmerX.value }],
  }));

  const logoText = (word: 'emme' | 'studio', color: string) => (
    <Text
      accessible={false}
      style={{
        color,
        fontFamily: word === 'emme' ? 'Inter_800ExtraBold' : 'Inter_400Regular',
        fontSize,
        letterSpacing,
        lineHeight: fontSize * 1.2,
      }}>
      {word}
    </Text>
  );

  if (!fontsLoaded || !isVisible) {
    return <View style={[styles.emptyBackground, { backgroundColor }]} />;
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor }, screenAnimatedStyle]}>
      {!isDark && (
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(229,85,139,0.055)', 'rgba(229,85,139,0.018)', 'rgba(229,85,139,0)']}
          locations={[0, 0.58, 1]}
          style={styles.roseGlow}
        />
      )}

      <View
        onLayout={({ nativeEvent }) => {
          const { width: nextWidth, height: nextHeight } = nativeEvent.layout;
          setLogoSize((previous) =>
            previous.width === nextWidth && previous.height === nextHeight
              ? previous
              : { width: nextWidth, height: nextHeight },
          );
        }}
        style={[styles.logoRow, { gap: fontSize * 0.22 }]}>
        <Animated.View style={emmeAnimatedStyle}><Animated.View style={emmeScaleAnimatedStyle}>{logoText('emme', '#E5558B')}</Animated.View></Animated.View>
        <Animated.View style={studioAnimatedStyle}><Animated.View style={studioScaleAnimatedStyle}>{logoText('studio', studioColor)}</Animated.View></Animated.View>

        {logoSize.width > 0 && logoSize.height > 0 && !reducedMotion && (
          <MaskedView
            pointerEvents="none"
            style={[styles.shimmerMask, { width: logoSize.width, height: logoSize.height }]}
            maskElement={
              <View style={[styles.logoRow, { gap: fontSize * 0.22 }]}>
                {logoText('emme', '#FFFFFF')}
                {logoText('studio', '#FFFFFF')}
              </View>
            }>
            <AnimatedGradient
              colors={[
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0.08)',
                'rgba(255,255,255,0.5)',
                'rgba(255,255,255,0.08)',
                'rgba(255,255,255,0)',
              ]}
              locations={[0, 0.3, 0.5, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.shimmer, { width: shimmerWidth, height: logoSize.height }, shimmerAnimatedStyle]}
            />
          </MaskedView>
        )}
      </View>
    </Animated.View>
  );
}

export default AnimatedSplash;

const styles = StyleSheet.create({
  emptyBackground: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  container: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  roseGlow: { position: 'absolute', width: '120%', height: '58%', top: '20%', borderRadius: 999 },
  logoRow: { position: 'relative', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', alignSelf: 'center' },
  shimmerMask: { position: 'absolute', left: 0, top: 0 },
  shimmer: { position: 'absolute', left: 0, top: 0 },
});
