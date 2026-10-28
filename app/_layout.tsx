import { Stack } from 'expo-router';
import '../global.css';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { BookingProvider } from '../src/expo/BookingContext';
import { ExpoAuthProvider, useExpoAuth } from '../src/expo/AuthContext';
import { AnimatedSplash } from '../src/expo/AnimatedSplash';
import { colors } from '../src/expo/theme';

function RootStack() {
  const { client, isHydrated } = useExpoAuth();

  if (!isHydrated) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
        <Stack.Protected guard={Boolean(client)}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="services" />
          <Stack.Screen name="designs" />
          <Stack.Screen name="service-detail" />
          <Stack.Screen name="appointment-detail" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="quotes" />
        </Stack.Protected>
        <Stack.Protected guard={!client}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [isSplashDone, setIsSplashDone] = useState(false);
  const backgroundColor = useColorScheme() === 'dark' ? '#0E0E10' : '#FDFDFD';

  return <ExpoAuthProvider><BookingProvider>
    <View style={{ flex: 1, backgroundColor }}>
      <RootStack />
      {!isSplashDone && <AnimatedSplash onFinish={() => setIsSplashDone(true)} />}
    </View>
  </BookingProvider></ExpoAuthProvider>;
}
