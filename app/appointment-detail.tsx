import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CalendarDays, Check, Clock3, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet } from '../src/expo/components/BottomSheet';
import { useBookings } from '../src/expo/BookingContext';
import { useTabBarClearance } from '../src/expo/useTabBarClearance';
import { emmeTokens } from '../src/expo/theme';

const availableTimes = ['10:00', '11:30', '13:00', '15:30'];

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { appointments, updateAppointment } = useBookings();
  const appointment = appointments.find((item) => item.id === id);
  const tabBarClearance = useTabBarClearance();
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => format(addDays(new Date(), index), index === 0 ? "'Hoy' · d MMM" : 'EEE · d MMM', { locale: es })), []);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [nextDay, setNextDay] = useState(appointment?.day || days[0]);
  const [nextTime, setNextTime] = useState(appointment?.time || '');
  const [notice, setNotice] = useState('');

  if (!appointment) return <SafeAreaView style={styles.safe} edges={['top']}>
    <View style={styles.missing}><Text style={styles.title}>No encontramos esta cita</Text><Pressable onPress={() => router.replace('/(tabs)/agenda')} style={styles.primaryButton}><Text style={styles.primaryText}>Volver a mis citas</Text></Pressable></View>
  </SafeAreaView>;

  const statusMap = {
    pending: { label: 'Solicitud pendiente', color: emmeTokens.semantic.warning, background: emmeTokens.semantic.warningBackground },
    confirmed: { label: 'Confirmada', color: emmeTokens.semantic.success, background: emmeTokens.semantic.successBackground },
    cancelled: { label: 'Cancelada', color: emmeTokens.semantic.error, background: emmeTokens.semantic.errorBackground },
    completed: { label: 'Completada', color: emmeTokens.modes.neutral.secondary, background: emmeTokens.modes.neutral.surfaceSubtle },
  }[appointment.status];

  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]} showsVerticalScrollIndicator={false}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.navBack} accessibilityRole="button" accessibilityLabel="Volver a mis citas"><ArrowLeft size={20} color={emmeTokens.modes.neutral.foreground} /></Pressable>
        <Text style={styles.navTitle}>Detalle de cita</Text><View style={styles.navSpacer} />
      </View>
      <Text style={styles.kicker}>TU VISITA EMME</Text>
      <Text style={styles.title}>{appointment.service}</Text>
      <View style={[styles.statusBadge, { backgroundColor: statusMap.background }]}>
        <View style={[styles.statusDot, { backgroundColor: statusMap.color }]} /><Text style={[styles.statusText, { color: statusMap.color }]}>{statusMap.label}</Text>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailRow}><View style={styles.detailIcon}><CalendarDays size={19} color={emmeTokens.brand.primary} /></View><View style={styles.detailCopy}><Text style={styles.detailLabel}>Día</Text><Text style={styles.detailValue}>{appointment.day}</Text></View></View>
        <View style={styles.separator} />
        <View style={styles.detailRow}><View style={styles.detailIcon}><Clock3 size={19} color={emmeTokens.brand.primary} /></View><View style={styles.detailCopy}><Text style={styles.detailLabel}>Hora</Text><Text style={styles.detailValue}>{appointment.time}</Text></View></View>
        <View style={styles.separator} />
        <View style={styles.detailRow}><View style={styles.detailIcon}><Check size={19} color={emmeTokens.brand.primary} /><Text style={styles.currency}>$</Text></View><View style={styles.detailCopy}><Text style={styles.detailLabel}>Pago</Text><Text style={styles.detailValue}>Se realiza en el estudio</Text></View></View>
      </View>

      <View style={styles.tipCard}><Text style={styles.tipTitle}>Antes de tu cita</Text><Text style={styles.tipText}>Si necesitas cambiar tus planes, puedes solicitar otro horario o cancelar esta cita desde aquí.</Text></View>
      {notice ? <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text> : null}

      {appointment.status !== 'cancelled' && appointment.status !== 'completed' ? <View style={styles.actions}>
        <Pressable onPress={() => { setNotice(''); setShowReschedule(true); }} style={styles.secondaryButton} accessibilityRole="button" accessibilityLabel="Solicitar cambio de horario"><Text style={styles.secondaryText}>Cambiar horario</Text></Pressable>
        <Pressable onPress={() => { setNotice(''); setShowCancel(true); }} style={styles.cancelButton} accessibilityRole="button" accessibilityLabel="Cancelar cita"><Text style={styles.cancelText}>Cancelar cita</Text></Pressable>
      </View> : null}
    </ScrollView>

    <BottomSheet visible={showReschedule} title="Solicitar otro horario" onClose={() => setShowReschedule(false)}>
      <Text style={styles.sheetHint}>Elige una nueva fecha y hora. El cambio quedará pendiente de confirmación.</Text>
      <Text style={styles.sheetLabel}>FECHA</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
        {days.map((day) => <Pressable key={day} onPress={() => setNextDay(day)} style={[styles.optionChip, nextDay === day && styles.optionChipActive]} accessibilityRole="button" accessibilityState={{ selected: nextDay === day }}>
          <Text style={[styles.optionText, nextDay === day && styles.optionTextActive]}>{day}</Text>
        </Pressable>)}
      </ScrollView>
      <Text style={styles.sheetLabel}>HORA</Text>
      <View style={styles.timesRow}>{availableTimes.map((time) => <Pressable key={time} onPress={() => setNextTime(time)} style={[styles.timeChip, nextTime === time && styles.optionChipActive]} accessibilityRole="button" accessibilityState={{ selected: nextTime === time }}>
        <Text style={[styles.optionText, nextTime === time && styles.optionTextActive]}>{time}</Text>
      </Pressable>)}</View>
      <Pressable disabled={!nextTime} onPress={async () => {
        await updateAppointment(appointment.id, { day: nextDay, time: nextTime, status: 'pending' });
        setShowReschedule(false);
        setNotice('Cambio solicitado · pendiente de confirmación');
      }} style={[styles.primaryButton, !nextTime && styles.disabled]} accessibilityRole="button" accessibilityState={{ disabled: !nextTime }}>
        <Text style={styles.primaryText}>Enviar solicitud</Text>
      </Pressable>
    </BottomSheet>

    <BottomSheet visible={showCancel} title="¿Cancelar esta cita?" onClose={() => setShowCancel(false)}>
      <Text style={styles.sheetHint}>La solicitud se guardará como cancelada en este dispositivo.</Text>
      <Pressable onPress={async () => {
        await updateAppointment(appointment.id, { status: 'cancelled' });
        setShowCancel(false);
        setNotice('Cita cancelada');
      }} style={styles.destructiveButton} accessibilityRole="button" accessibilityLabel="Confirmar cancelación">
        <X size={17} color="#FFFFFF" /><Text style={styles.primaryText}>Sí, cancelar cita</Text>
      </Pressable>
      <Pressable onPress={() => setShowCancel(false)} style={styles.keepButton} accessibilityRole="button"><Text style={styles.keepText}>Mantener mi cita</Text></Pressable>
    </BottomSheet>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background },
  content: { paddingHorizontal: 22, paddingTop: 8, maxWidth: 720, width: '100%', alignSelf: 'center' },
  nav: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBack: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.modes.neutral.surface },
  navTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  navSpacer: { width: 44 },
  kicker: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginTop: 19 },
  title: { color: emmeTokens.modes.neutral.foreground, fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.6, marginTop: 6 },
  statusBadge: { alignSelf: 'flex-start', minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingHorizontal: 11, marginTop: 12 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  detailCard: { marginTop: 20, paddingHorizontal: 15, backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  detailRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  currency: { color: emmeTokens.brand.primary, fontSize: 14, fontWeight: '800' },
  detailCopy: { flex: 1, gap: 3 },
  detailLabel: { color: emmeTokens.modes.neutral.muted, fontSize: 11 },
  detailValue: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '600' },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 54, backgroundColor: emmeTokens.modes.neutral.separator },
  tipCard: { marginTop: 14, padding: 16, borderRadius: 20, backgroundColor: emmeTokens.modes.neutral.surfaceSubtle },
  tipTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  tipText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, lineHeight: 18, marginTop: 5 },
  notice: { color: emmeTokens.semantic.success, fontSize: 13, fontWeight: '700', marginTop: 14 },
  actions: { gap: 9, marginTop: 20 },
  secondaryButton: { minHeight: 50, borderRadius: 25, backgroundColor: emmeTokens.brand.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  cancelButton: { minHeight: 48, borderRadius: 24, borderWidth: 1, borderColor: emmeTokens.semantic.error, backgroundColor: emmeTokens.semantic.errorBackground, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: emmeTokens.semantic.error, fontSize: 13, fontWeight: '700' },
  sheetHint: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, lineHeight: 19, marginBottom: 9 },
  sheetLabel: { color: emmeTokens.modes.neutral.muted, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginTop: 7 },
  optionsRow: { gap: 7, paddingVertical: 2 },
  optionChip: { minHeight: 44, paddingHorizontal: 12, borderRadius: 999, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, alignItems: 'center', justifyContent: 'center' },
  timeChip: { minHeight: 44, minWidth: '22%', paddingHorizontal: 12, borderRadius: 999, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, alignItems: 'center', justifyContent: 'center' },
  timesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 },
  optionChipActive: { backgroundColor: emmeTokens.brand.primarySoft, borderColor: emmeTokens.brand.primary },
  optionText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  optionTextActive: { color: emmeTokens.brand.primary, fontWeight: '800' },
  primaryButton: { minHeight: 52, borderRadius: 26, backgroundColor: emmeTokens.brand.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  destructiveButton: { minHeight: 50, borderRadius: 25, backgroundColor: emmeTokens.semantic.error, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 },
  primaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  keepButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  keepText: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.42 },
  missing: { flex: 1, padding: 24, justifyContent: 'center', gap: 20 },
});
