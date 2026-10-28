import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CalendarDays, Check, Clock3 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet } from '../src/expo/components/BottomSheet';
import { CapsuleField } from '../src/expo/components/CapsuleField';
import { useBookings } from '../src/expo/BookingContext';
import { findStudioService, studioServices } from '../src/expo/serviceCatalog';
import { useTintedImageTheme } from '../src/expo/tintedPalette';
import { emmeTokens } from '../src/expo/theme';
import { OptimizedImage } from '../src/expo/components/OptimizedImage';

const times = ['10:00', '11:30', '13:00', '15:30'];
const bookingSelectableServices = studioServices.filter((service) =>
  ['manicura-express', 'manicura-rusa-rubber', 'semi-permanente', 'soft-gel'].includes(service.id),
);

export default function BookingScreen() {
  const params = useLocalSearchParams<{ service?: string }>();
  const { addAppointment } = useBookings();
  const days = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const date = addDays(new Date(), index);
    return format(date, index === 0 ? "'Hoy' · d MMM" : 'EEE · d MMM', { locale: es });
  }), []);
  const [service, setService] = useState(() => findStudioService(params.service).name);
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [serviceSheetVisible, setServiceSheetVisible] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const selectedService = findStudioService(service);
  const tinted = useTintedImageTheme(selectedService.image);

  return <SafeAreaView style={[styles.safe, { backgroundColor: tinted.background }]} edges={['top', 'bottom']}>
    <OptimizedImage source={selectedService.image as number} blurRadius={42} style={styles.ambient} />
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${tinted.background}C9` }]} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={[StyleSheet.absoluteFill, styles.heroImage]}>
          <OptimizedImage source={selectedService.image as number} fill />
          <LinearGradient colors={[tinted.scrimTop, 'rgba(17,12,15,0.16)', tinted.scrimBottom]} locations={[0, 0.36, 1]} style={StyleSheet.absoluteFill} />
        </View>
        <View style={styles.heroNav}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={8}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.heroEyebrow}>{confirmed ? 'RESERVA EN EMME' : `PASO ${step} DE 3`}</Text>
          <View style={styles.navSpacer} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>{confirmed ? 'Tu momento está reservado' : 'Agenda tu cita'}</Text>
          <Text style={styles.heroSubtitle}>{confirmed ? 'Te esperamos para consentirte.' : 'Elige tu servicio y un horario que te venga bien.'}</Text>
        </View>
      </View>

      {confirmed ? <View style={styles.confirmationCard}>
        <View style={styles.successIcon}><Check size={25} color="#FFFFFF" /></View>
        <Text style={styles.confirmationTitle}>Cita guardada</Text>
        <Text style={styles.confirmationBody}>{service}{'\n'}{day} · {time}{'\n\n'}Guardada en este dispositivo.</Text>
        <Pressable style={styles.confirmationButton} onPress={() => router.replace('/(tabs)/agenda')} accessibilityRole="button" accessibilityLabel="Ver mis citas">
          <Text style={styles.confirmationButtonText}>Ver mis citas</Text>
        </Pressable>
      </View> : <>
        <View style={styles.stepper} accessibilityLabel={`Paso ${step} de 3`}>
          {[1, 2, 3].map((item) => <View key={item} style={[styles.stepTrack, item <= step && styles.stepTrackActive]} />)}
        </View>
        {step === 1 ? <View style={styles.formCard}>
          <Text style={styles.stepTitle}>Elige tu servicio</Text>
          <Text style={styles.stepHelp}>Primero, el cuidado que te gustaría disfrutar.</Text>
          <CapsuleField
            label="Servicio"
            value={selectedService.name}
            placeholder="Elige un servicio"
            accessibilityLabel="Elegir servicio"
            onPress={() => setServiceSheetVisible(true)}
          />
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Tu selección</Text>
            <View style={styles.summaryRow}><Text style={styles.summaryName}>{selectedService.name}</Text><Text style={styles.summaryPrice}>${selectedService.price}</Text></View>
            <Text style={styles.summaryMeta}>{selectedService.duration} · {selectedService.technique}</Text>
          </View>
          <Pressable onPress={() => setStep(2)} style={styles.primaryButton} accessibilityRole="button" accessibilityLabel="Continuar a elegir fecha">
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </Pressable>
        </View> : null}

        {step === 2 ? <View style={styles.formCard}>
          <Pressable onPress={() => setStep(1)} style={styles.stepBack} accessibilityRole="button" accessibilityLabel="Volver a elegir servicio"><ArrowLeft size={17} color={emmeTokens.modes.neutral.secondary} /><Text style={styles.stepBackText}>Servicio</Text></Pressable>
          <Text style={styles.stepTitle}>Encuentra tu momento</Text>
          <Text style={styles.stepHelp}>Selecciona un día y una hora disponibles.</Text>
          <Text style={styles.stepLabel}>DÍA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
            {days.map((value) => <Pressable key={value} onPress={() => setDay(value)} accessibilityRole="button" accessibilityState={{ selected: value === day }} style={[styles.day, value === day && styles.dayActive]}>
              <CalendarDays size={15} color={value === day ? '#FFFFFF' : emmeTokens.modes.neutral.secondary} />
              <Text style={[styles.dayText, value === day && styles.dayTextActive]}>{value}</Text>
            </Pressable>)}
          </ScrollView>
          <Text style={styles.stepLabel}>HORARIO</Text>
          <View style={styles.times}>
            {times.map((value) => <Pressable key={value} onPress={() => setTime(value)} accessibilityRole="button" accessibilityState={{ selected: value === time }} style={[styles.time, value === time && styles.timeActive]}>
              <Clock3 size={14} color={value === time ? '#FFFFFF' : emmeTokens.modes.neutral.secondary} />
              <Text style={[styles.timeText, value === time && styles.timeTextActive]}>{value}</Text>
            </Pressable>)}
          </View>
          <Pressable disabled={!time} onPress={() => setStep(3)} style={[styles.primaryButton, !time && styles.disabledButton]} accessibilityRole="button" accessibilityLabel="Continuar a revisar la reserva" accessibilityState={{ disabled: !time }}>
            <Text style={styles.primaryButtonText}>Revisar reserva</Text>
          </Pressable>
        </View> : null}

        {step === 3 ? <View style={styles.formCard}>
          <Pressable onPress={() => setStep(2)} style={styles.stepBack} accessibilityRole="button" accessibilityLabel="Volver a elegir horario"><ArrowLeft size={17} color={emmeTokens.modes.neutral.secondary} /><Text style={styles.stepBackText}>Horario</Text></Pressable>
          <Text style={styles.stepTitle}>Revisa tu reserva</Text>
          <Text style={styles.stepHelp}>Confirma que todos los detalles estén correctos.</Text>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>SERVICIO</Text><Text style={styles.reviewValue}>{selectedService.name}</Text>
            <View style={styles.reviewSeparator} />
            <Text style={styles.reviewLabel}>FECHA Y HORA</Text><Text style={styles.reviewValue}>{day} · {time}</Text>
            <View style={styles.reviewSeparator} />
            <View style={styles.summaryRow}><Text style={styles.reviewLabel}>ESTIMADO</Text><Text style={styles.summaryPrice}>${selectedService.price} MXN</Text></View>
            <Text style={styles.summaryMeta}>{selectedService.duration} · Pago en el estudio</Text>
          </View>
          <Pressable onPress={async () => { await addAppointment({ service, day, time }); setConfirmed(true); }} style={styles.primaryButton} accessibilityRole="button" accessibilityLabel="Confirmar reserva">
            <Text style={styles.primaryButtonText}>Confirmar cita</Text>
          </Pressable>
        </View> : null}
      </>}
    </ScrollView>

    <BottomSheet visible={serviceSheetVisible} title="Elige tu servicio" onClose={() => setServiceSheetVisible(false)}>
      {bookingSelectableServices.map((item) => <Pressable
        key={item.id}
        onPress={() => { setService(item.name); setServiceSheetVisible(false); }}
        accessibilityRole="button"
        accessibilityState={{ selected: item.id === selectedService.id }}
        style={[styles.serviceOption, item.id === selectedService.id && styles.serviceOptionSelected]}
      >
        <View style={styles.serviceOptionCopy}>
          <Text style={styles.serviceOptionTitle}>{item.name}</Text>
          <Text style={styles.serviceOptionMeta}>{item.duration} · ${item.price}</Text>
        </View>
        {item.id === selectedService.id ? <Check size={18} color={emmeTokens.brand.primary} /> : null}
      </Pressable>)}
    </BottomSheet>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  ambient: { position: 'absolute', top: -40, left: -30, right: -30, height: 500, opacity: 0.34 },
  content: { paddingBottom: 32 },
  hero: { height: 270, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 7, overflow: 'hidden' },
  heroImage: { borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  heroNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(17,12,15,0.38)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  heroEyebrow: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  navSpacer: { width: 46 },
  heroCopy: { paddingBottom: 22, gap: 5 },
  heroTitle: { color: '#FFFFFF', fontSize: 29, lineHeight: 35, fontWeight: '800', letterSpacing: -0.7 },
  heroSubtitle: { color: 'rgba(255,255,255,0.92)', fontSize: 14, lineHeight: 20 },
  stepper: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingTop: 17 },
  stepTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.46)' },
  stepTrackActive: { backgroundColor: emmeTokens.brand.primary },
  formCard: { marginHorizontal: 18, marginTop: 16, padding: 18, gap: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)' },
  stepBack: { minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 10 },
  stepBackText: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, fontWeight: '600' },
  stepTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 22, lineHeight: 28, fontWeight: '800', letterSpacing: -0.4 },
  stepHelp: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, lineHeight: 19, marginTop: -7, marginBottom: 4 },
  stepLabel: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
  days: { gap: 8, paddingBottom: 2 },
  day: { minHeight: 46, paddingHorizontal: 12, borderRadius: 999, backgroundColor: emmeTokens.modes.neutral.surfaceSubtle, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dayActive: { backgroundColor: emmeTokens.brand.primary, borderColor: emmeTokens.brand.primary },
  dayText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  dayTextActive: { color: '#FFFFFF' },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  time: { minWidth: '22%', minHeight: 46, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, borderRadius: 999 },
  timeActive: { backgroundColor: emmeTokens.brand.primary, borderColor: emmeTokens.brand.primary },
  timeText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, fontWeight: '600' },
  timeTextActive: { color: '#FFFFFF' },
  summary: { paddingTop: 13, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: emmeTokens.modes.neutral.separator, gap: 7, marginTop: 4 },
  summaryLabel: { color: emmeTokens.modes.neutral.muted, fontSize: 12, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  summaryName: { flex: 1, color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  summaryPrice: { color: emmeTokens.modes.neutral.foreground, fontSize: 15, fontWeight: '800' },
  summaryMeta: { color: emmeTokens.modes.neutral.secondary, fontSize: 12 },
  reviewCard: { padding: 16, borderRadius: 20, backgroundColor: emmeTokens.modes.neutral.surfaceSubtle, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, gap: 7 },
  reviewLabel: { color: emmeTokens.modes.neutral.muted, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  reviewValue: { color: emmeTokens.modes.neutral.foreground, fontSize: 15, fontWeight: '700' },
  reviewSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: emmeTokens.modes.neutral.separator, marginVertical: 5 },
  primaryButton: { minHeight: 52, borderRadius: 26, backgroundColor: emmeTokens.brand.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  disabledButton: { opacity: 0.45 },
  confirmationCard: { margin: 20, marginTop: 26, padding: 24, backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 28, alignItems: 'center', borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  successIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: emmeTokens.semantic.success, alignItems: 'center', justifyContent: 'center' },
  confirmationTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 20, fontWeight: '800', marginTop: 15 },
  confirmationBody: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 9 },
  confirmationButton: { minHeight: 48, alignSelf: 'stretch', borderRadius: 24, backgroundColor: emmeTokens.brand.primary, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  confirmationButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  serviceOption: { minHeight: 62, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 18, backgroundColor: emmeTokens.modes.neutral.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  serviceOptionSelected: { borderWidth: 1, borderColor: emmeTokens.brand.primary, backgroundColor: emmeTokens.brand.primarySoft },
  serviceOptionCopy: { flex: 1, gap: 4 },
  serviceOptionTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '600' },
  serviceOptionMeta: { color: emmeTokens.modes.neutral.secondary, fontSize: 12 },
});
