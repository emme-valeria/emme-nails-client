import { CalendarDays, Clock3 } from 'lucide-react-native';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../../src/expo/BookingContext';
import { useTabBarClearance } from '../../src/expo/useTabBarClearance';
import { emmeTokens } from '../../src/expo/theme';

export default function AppointmentsScreen() {
  const { appointments } = useBookings();
  const tabBarClearance = useTabBarClearance();
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}>
      <Text style={styles.kicker}>EMME STUDIO</Text>
      <Text style={styles.title}>Mis citas</Text>
      <Text style={styles.subtitle}>Tus próximas visitas y su estado.</Text>
      {appointments.length ? <View style={styles.groupedList}>
        {appointments.map((appointment, index) => <View key={appointment.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <Pressable
            onPress={() => router.push({ pathname: '/appointment-detail', params: { id: appointment.id } } as unknown as Href)}
            style={({ pressed }) => [styles.appointmentRow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`${appointment.service}, ${appointment.day}, ${appointment.time}, ${appointment.status === 'cancelled' ? 'cancelada' : appointment.status === 'confirmed' ? 'confirmada' : appointment.status === 'completed' ? 'completada' : 'solicitud pendiente'}. Abrir detalle`}
          >
            <View style={styles.icon}><CalendarDays size={20} color={emmeTokens.brand.primary} /></View>
            <View style={styles.copy}>
              <Text style={styles.cardTitle}>{appointment.service}</Text>
              <View style={styles.meta}><Clock3 size={14} color={emmeTokens.modes.neutral.muted} /><Text style={styles.metaText}>{appointment.day} · {appointment.time}</Text></View>
              <View style={[styles.pendingBadge, appointment.status === 'cancelled' && styles.cancelledBadge, appointment.status === 'confirmed' && styles.confirmedBadge, appointment.status === 'completed' && styles.completedBadge]}><View style={[styles.pendingDot, appointment.status === 'cancelled' && styles.cancelledDot, appointment.status === 'confirmed' && styles.confirmedDot, appointment.status === 'completed' && styles.completedDot]} /><Text style={[styles.status, appointment.status === 'cancelled' && styles.cancelledStatus, appointment.status === 'confirmed' && styles.confirmedStatus, appointment.status === 'completed' && styles.completedStatus]}>{appointment.status === 'cancelled' ? 'Cancelada' : appointment.status === 'confirmed' ? 'Confirmada' : appointment.status === 'completed' ? 'Completada' : 'Solicitud pendiente'}</Text></View>
            </View>
          </Pressable>
        </View>)}
      </View> : <View style={styles.emptyCard}>
        <View style={styles.icon}><CalendarDays size={20} color={emmeTokens.brand.primary} /></View>
        <Text style={styles.cardTitle}>Aún no tienes citas próximas</Text>
        <Text style={styles.body}>Cuando reserves un servicio, encontrarás aquí los detalles de tu visita.</Text>
      </View>}
      <Text style={styles.note}>Tus reservas en este dispositivo aparecerán aquí.</Text>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background },
  content: { padding: 22, paddingTop: 26, maxWidth: 760, width: '100%', alignSelf: 'center' },
  kicker: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: emmeTokens.modes.neutral.foreground, fontSize: 31, fontWeight: '800', letterSpacing: -1, marginTop: 7 },
  subtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, marginTop: 6, marginBottom: 20 },
  groupedList: { backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, paddingHorizontal: 15 },
  appointmentRow: { minHeight: 94, flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 55, backgroundColor: emmeTokens.modes.neutral.separator },
  icon: { width: 42, height: 42, borderRadius: 15, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 5 },
  cardTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 15, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12 },
  pendingBadge: { alignSelf: 'flex-start', minHeight: 28, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingHorizontal: 10, marginTop: 2, backgroundColor: emmeTokens.semantic.warningBackground },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: emmeTokens.semantic.warning },
  status: { color: emmeTokens.semantic.warning, fontSize: 11, fontWeight: '700' },
  confirmedBadge: { backgroundColor: emmeTokens.semantic.successBackground },
  confirmedDot: { backgroundColor: emmeTokens.semantic.success },
  confirmedStatus: { color: emmeTokens.semantic.success },
  cancelledBadge: { backgroundColor: emmeTokens.semantic.errorBackground },
  cancelledDot: { backgroundColor: emmeTokens.semantic.error },
  cancelledStatus: { color: emmeTokens.semantic.error },
  completedBadge: { backgroundColor: emmeTokens.modes.neutral.surfaceSubtle },
  completedDot: { backgroundColor: emmeTokens.modes.neutral.secondary },
  completedStatus: { color: emmeTokens.modes.neutral.secondary },
  pressed: { opacity: 0.76 },
  emptyCard: { backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, marginTop: 6 },
  body: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, lineHeight: 20, marginTop: 7 },
  note: { color: emmeTokens.modes.neutral.muted, fontSize: 12, marginTop: 16, paddingHorizontal: 3 },
});
