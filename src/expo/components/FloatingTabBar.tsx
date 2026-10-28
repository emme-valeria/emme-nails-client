import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View, useWindowDimensions, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, emmeTokens } from '../theme';

function TabButton({
  route,
  focused,
  navigation,
  descriptors,
  width,
}: BottomTabBarProps & { route: BottomTabBarProps['state']['routes'][number]; focused: boolean; width: number }) {
  const { options } = descriptors[route.key];
  const scale = useSharedValue(focused ? 1 : 0.86);
  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.86, { damping: 13, stiffness: 190 });
  }, [focused, scale]);
  const capsuleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPress = () => {
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
  };
  const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });
  const color = focused ? colors.primary : colors.mutedForeground;
  const accessibilityLabel = options.tabBarAccessibilityLabel ?? options.title ?? route.name;

  return <Pressable
    accessibilityRole="tab"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ selected: focused }}
    testID={options.tabBarButtonTestID}
    onPress={onPress}
    onLongPress={onLongPress}
    style={[styles.tabButton, { width }]}
  >
    <Animated.View pointerEvents="none" style={[styles.activeCapsule, { left: (width - 68) / 2, opacity: focused ? 1 : 0 }, capsuleStyle]} />
    <View style={styles.iconHitArea}>{options.tabBarIcon?.({ focused, color, size: 24 })}</View>
  </Pressable>;
}

export function FloatingTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const barWidth = Math.min(screenWidth - 44, 480);
  const slotWidth = barWidth / Math.max(props.state.routes.length, 1);

  return <View pointerEvents="box-none" style={[styles.positioner, { bottom: insets.bottom + 12 }]}>
    <View style={[styles.bar, { width: barWidth }, Platform.OS === 'web' && webTabBarGlass]}>
      {Platform.OS === 'web' ? null : <View pointerEvents="none" style={styles.blurClip}>
        <BlurView intensity={76} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.translucentSurface} />
      </View>}
      {props.state.routes.map((route, index) => <TabButton
        key={route.key}
        {...props}
        route={route}
        focused={props.state.index === index}
        width={slotWidth}
      />)}
    </View>
  </View>;
}

const webTabBarGlass = {
  backgroundColor: 'rgba(255,255,255,0.30)',
  backdropFilter: 'blur(28px) saturate(190%) brightness(1.05)',
  WebkitBackdropFilter: 'blur(28px) saturate(190%) brightness(1.05)',
  boxShadow: [
    'inset 0 1.5px 0 rgba(255,255,255,0.9)',
    'inset 0 -1px 0 rgba(255,255,255,0.25)',
    'inset 0 0 18px rgba(255,255,255,0.18)',
    '0 10px 30px rgba(170,50,110,0.14)',
  ].join(', '),
} as unknown as ViewStyle;

const styles = StyleSheet.create({
  positioner: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 30 },
  bar: {
    height: 68,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: emmeTokens.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(32,32,36,0.08)',
    backgroundColor: 'transparent',
    shadowColor: '#202024',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 7 },
    elevation: 10,
  },
  blurClip: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: emmeTokens.radius.pill, overflow: 'hidden' },
  translucentSurface: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: emmeTokens.radius.pill, backgroundColor: 'rgba(255,255,255,0.30)' },
  tabButton: { height: 56, alignItems: 'center', justifyContent: 'center', minWidth: 48 },
  activeCapsule: {
    position: 'absolute',
    top: 4,
    width: 68,
    height: 48,
    borderRadius: emmeTokens.radius.pill,
    backgroundColor: 'rgba(166,62,104,0.25)',
  },
  iconHitArea: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
