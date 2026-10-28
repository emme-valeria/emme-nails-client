import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, View, type ColorValue } from 'react-native';
import { useEffect } from 'react';
import { CalendarDays, House, MessageCircle, UserRound } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '../../src/expo/theme';
import { FloatingTabBar } from '../../src/expo/components/FloatingTabBar';

function BouncyTabIcon({ Icon, color, focused, hasUnread = false }: { Icon: typeof House; color: ColorValue; focused: boolean; hasUnread?: boolean }) {
  const iconOffset = useSharedValue(0);

  useEffect(() => {
    iconOffset.value = focused
      ? withSequence(withTiming(-3, { duration: 70 }), withSpring(0, { damping: 12, stiffness: 180 }))
      : withSpring(0, { damping: 12, stiffness: 180 });
  }, [focused, iconOffset]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ translateY: iconOffset.value }] }));

  return <View accessible={false} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
    <Animated.View style={[{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }, iconStyle]}>
      <Icon size={24} color={focused ? colors.primary : color} strokeWidth={focused ? 2.4 : 2} />
      {hasUnread && <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />}
    </Animated.View>
  </View>;
}

export default function TabLayout() {
  const useSystemGlassTabs = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const triggerTabHaptic = () => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }
  };

  if (useSystemGlassTabs) {
    return <NativeTabs
      blurEffect="systemMaterial"
      disableTransparentOnScrollEdge={false}
      minimizeBehavior="never"
      iconColor={{ default: colors.mutedForeground, selected: colors.primary }}
      screenListeners={{ tabPress: triggerTabHaptic }}
    >
      <NativeTabs.Trigger name="index" accessibilityLabel="Inicio">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md={{ default: 'home', selected: 'home_filled' }} />
        <NativeTabs.Trigger.Label hidden>Inicio</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat" accessibilityLabel="Chat">
        <NativeTabs.Trigger.Icon sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }} md={{ default: 'chat_bubble_outline', selected: 'chat_bubble' }} />
        <NativeTabs.Trigger.Label hidden>Chat</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="agenda" accessibilityLabel="Citas">
        <NativeTabs.Trigger.Icon sf={{ default: 'calendar', selected: 'calendar' }} md={{ default: 'calendar_month', selected: 'calendar_month' }} />
        <NativeTabs.Trigger.Label hidden>Citas</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile" accessibilityLabel="Perfil">
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} md={{ default: 'person_outline', selected: 'person' }} />
        <NativeTabs.Trigger.Label hidden>Perfil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>;
  }

  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.mutedForeground,
      tabBarShowLabel: false,
      tabBarIconStyle: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    }}>
      <Tabs.Screen name="index" listeners={{ tabPress: triggerTabHaptic }} options={{ title: 'Inicio', tabBarAccessibilityLabel: 'Inicio', tabBarIcon: ({ color, focused }) => <BouncyTabIcon Icon={House} color={color} focused={focused} /> }} />
      <Tabs.Screen name="chat" listeners={{ tabPress: triggerTabHaptic }} options={{ title: 'Chat', tabBarAccessibilityLabel: 'Chat', tabBarIcon: ({ color, focused }) => <BouncyTabIcon Icon={MessageCircle} color={color} focused={focused} hasUnread={false} /> }} />
      <Tabs.Screen name="agenda" listeners={{ tabPress: triggerTabHaptic }} options={{ title: 'Citas', tabBarAccessibilityLabel: 'Citas', tabBarIcon: ({ color, focused }) => <BouncyTabIcon Icon={CalendarDays} color={color} focused={focused} /> }} />
      <Tabs.Screen name="profile" listeners={{ tabPress: triggerTabHaptic }} options={{ title: 'Perfil', tabBarAccessibilityLabel: 'Perfil', tabBarIcon: ({ color, focused }) => <BouncyTabIcon Icon={UserRound} color={color} focused={focused} /> }} />
    </Tabs>
  );
}
