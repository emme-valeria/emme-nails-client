import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useExpoAuth } from './AuthContext';

export type NativeAppointment = {
  id: string;
  service: string;
  day: string;
  time: string;
  createdAt: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
};

type BookingContextValue = {
  appointments: NativeAppointment[];
  isHydrated: boolean;
  addAppointment: (appointment: Omit<NativeAppointment, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateAppointment: (id: string, changes: Partial<Pick<NativeAppointment, 'day' | 'time' | 'status'>>) => Promise<void>;
};

const STORAGE_KEY = 'emme-expo-appointments-v1';
const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { client } = useExpoAuth();
  const [appointments, setAppointments] = useState<NativeAppointment[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const storageKey = `${STORAGE_KEY}:${client?.phone || 'guest'}`;

  useEffect(() => {
    setIsHydrated(false);
    setAppointments([]);
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (value) {
          const stored = JSON.parse(value) as Array<Omit<NativeAppointment, 'status'> & { status?: NativeAppointment['status'] }>;
          setAppointments(stored.map((appointment) => ({ ...appointment, status: appointment.status || 'pending' })));
        }
      })
      .catch(() => undefined)
      .finally(() => setIsHydrated(true));
  }, [storageKey]);

  const value = useMemo<BookingContextValue>(() => ({
    appointments,
    isHydrated,
    addAppointment: async (appointment) => {
      const next = [{ ...appointment, id: `${Date.now()}`, createdAt: Date.now(), status: 'pending' as const }, ...appointments];
      setAppointments(next);
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    },
    updateAppointment: async (id, changes) => {
      const next = appointments.map((appointment) => appointment.id === id ? { ...appointment, ...changes } : appointment);
      setAppointments(next);
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    },
  }), [appointments, isHydrated, storageKey]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings must be used inside BookingProvider');
  return context;
}
