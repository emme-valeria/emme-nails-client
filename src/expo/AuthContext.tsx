import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ExpoClient = { name: string; phone: string; signedInAt: number };
type ExpoAuthContextValue = { client: ExpoClient | null; isHydrated: boolean; signInWithPhone: (name: string, phone: string) => Promise<void>; signOut: () => Promise<void> };

const STORAGE_KEY = 'emme-expo-client-session-v1';
const ExpoAuthContext = createContext<ExpoAuthContextValue | null>(null);

export function ExpoAuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ExpoClient | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => { if (value) setClient(JSON.parse(value) as ExpoClient); })
      .catch(() => undefined)
      .finally(() => setIsHydrated(true));
  }, []);

  const value = useMemo<ExpoAuthContextValue>(() => ({
    client,
    isHydrated,
    signInWithPhone: async (name, phone) => {
      const nextClient = { name: name.trim() || 'Clienta Emme', phone, signedInAt: Date.now() };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextClient));
      setClient(nextClient);
    },
    signOut: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setClient(null);
    },
  }), [client, isHydrated]);

  return <ExpoAuthContext.Provider value={value}>{children}</ExpoAuthContext.Provider>;
}

export function useExpoAuth() {
  const context = useContext(ExpoAuthContext);
  if (!context) throw new Error('useExpoAuth must be used inside ExpoAuthProvider');
  return context;
}
