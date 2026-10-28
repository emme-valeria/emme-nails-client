import { router, type Href } from 'expo-router';
import { CalendarDays, Camera, ChevronRight, Clock3, Search, Sparkles, UserRound } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../../src/expo/BookingContext';
import { useExpoAuth } from '../../src/expo/AuthContext';
import { studioServices } from '../../src/expo/serviceCatalog';
import { useTabBarClearance } from '../../src/expo/useTabBarClearance';
import { emmeTokens } from '../../src/expo/theme';
import { triggerHapticFeedback } from '../../src/shared/utils/haptics';
import { OptimizedImage } from '../../src/expo/components/OptimizedImage';
import { PressableScale } from '../../src/expo/components/ui/PressableScale';

const browseCategories = ['Manicura', 'Soft Gel', 'Acrílico', 'Nail art', 'Pedicura'];
const featuredService = studioServices[1];

export default function HomeScreen() {
  const { appointments } = useBookings();
  const { client } = useExpoAuth();
  const tabBarClearance = useTabBarClearance();
  const { width } = useWindowDimensions();
  const wideCatalog = width >= 680;
  const firstName = client?.name?.trim().split(' ')[0] || 'bonita';
  const nextAppointment = useMemo(() => appointments.find((appointment) => appointment.status !== 'cancelled' && appointment.status !== 'completed') || null, [appointments]);

  const go = (path: '/quotes' | '/booking' | '/services' | '/(tabs)/agenda' | '/(tabs)/profile') => {
    triggerHapticFeedback(10);
    router.push(path);
  };

  const openService = (serviceId: string) => {
    triggerHapticFeedback(10);
    router.push({ pathname: '/service-detail' as never, params: { service: serviceId } });
  };

  const openAppointment = () => {
    if (!nextAppointment) return go('/(tabs)/agenda');
    triggerHapticFeedback(10);
    router.push({ pathname: '/appointment-detail', params: { id: nextAppointment.id } } as unknown as Href);
  };

  const openDesignGallery = () => {
    triggerHapticFeedback(10);
    router.push('/designs' as unknown as Href);
  };

  const openDesignCategory = (category: string) => {
    triggerHapticFeedback(10);
    router.push({ pathname: '/designs', params: { category } } as unknown as Href);
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => go('/(tabs)/profile')} style={styles.avatar} accessibilityRole="button" accessibilityLabel="Abrir perfil">
          {client?.name ? <Text style={styles.avatarInitial}>{client.name.trim().charAt(0).toUpperCase()}</Text> : <UserRound size={20} color={emmeTokens.brand.primary} />}
        </Pressable>
        <View style={styles.headerCopy}><Text style={styles.screenTitle}>Descubrir</Text><Text style={styles.headerSubtitle}>Emme Studio · para {firstName}</Text></View>
        <Pressable onPress={() => go('/services')} style={styles.searchButton} accessibilityRole="button" accessibilityLabel="Buscar diseños y servicios">
          <Search size={21} color={emmeTokens.modes.neutral.foreground} />
        </Pressable>
      </View>

      <View style={styles.sectionHeading}>
        <View><Text style={styles.sectionTitle}>Servicios populares</Text><Text style={styles.sectionSubtitle}>Encuentra tu próximo favorito.</Text></View>
        <Pressable onPress={() => go('/services')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Ver todos los servicios"><Text style={styles.seeAll}>Ver todo</Text></Pressable>
      </View>

      <View style={[styles.popularList, wideCatalog && styles.popularGrid]}>
        {studioServices.slice(0, 3).map((service, index) => <View key={service.id}>
          {!wideCatalog && index > 0 ? <View style={styles.separator} /> : null}
          <PressableScale onPress={() => openService(service.id)} style={[styles.serviceRow, wideCatalog && styles.serviceCard]} accessibilityRole="button" accessibilityLabel={`${service.name}, ${service.duration}, desde ${service.price} pesos`}>
            <View style={styles.serviceMark}><Sparkles size={18} color={emmeTokens.brand.primary} /></View>
            <View style={styles.serviceCopy}>
              <Text numberOfLines={1} style={styles.serviceName}>{service.name}</Text>
              <Text numberOfLines={1} style={styles.serviceDetail}>{service.detail}</Text>
              <View style={styles.serviceMeta}><Clock3 size={13} color={emmeTokens.modes.neutral.muted} /><Text style={styles.serviceMetaText}>{service.duration}</Text></View>
            </View>
            <View style={styles.servicePrice}><Text style={styles.price}>${service.price}</Text><ChevronRight size={16} color={emmeTokens.modes.neutral.muted} /></View>
          </PressableScale>
        </View>)}
      </View>

      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Explora por técnica</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {browseCategories.map((category, index) => <PressableScale key={category} onPress={() => openDesignCategory(category)} style={[styles.category, index === 0 && styles.categorySelected]} accessibilityRole="button" accessibilityLabel={`Explorar ${category}`}>
          <Text style={[styles.categoryText, index === 0 && styles.categoryTextSelected]}>{category}</Text>
        </PressableScale>)}
      </ScrollView>

      <PressableScale onPress={openDesignGallery} accessibilityRole="button" accessibilityLabel="Explorar inspiración de uñas">
        <View style={styles.feature}>
          <OptimizedImage source={featuredService.image as number} fill style={styles.featureImage} />
          <LinearGradient colors={['rgba(24,18,19,0.02)', 'rgba(24,18,19,0.12)', 'rgba(24,18,19,0.78)']} locations={[0, 0.48, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.featureTop}><Text style={styles.featureEyebrow}>INSPIRACIÓN EMME</Text><Sparkles size={17} color="#FFFFFF" /></View>
          <View style={styles.featureCopy}><Text style={styles.featureTitle}>Nude con detalle minimal</Text><Text style={styles.featureSubtitle}>Manicura rusa · 60 min</Text><View style={styles.featureLink}><Text style={styles.featureLinkText}>Explorar el diseño</Text><ChevronRight size={16} color="#FFFFFF" /></View></View>
        </View>
      </PressableScale>

      <View style={styles.quickActions}>
        <PressableScale onPress={() => go('/quotes')} style={styles.quickAction} accessibilityRole="button" accessibilityLabel="Cotizar diseño con una foto">
          <View style={styles.quickIcon}><Camera size={17} color={emmeTokens.brand.primary} /></View><View style={styles.quickCopy}><Text style={styles.quickTitle}>¿Tienes una referencia?</Text><Text style={styles.quickSubtitle}>Cotízala con una foto</Text></View><ChevronRight size={17} color={emmeTokens.modes.neutral.muted} />
        </PressableScale>
        <PressableScale onPress={openAppointment} style={styles.appointmentCard} accessibilityRole="button" accessibilityLabel={nextAppointment ? `Abrir cita de ${nextAppointment.service}` : 'Abrir agenda y ver citas'}>
          <View style={styles.appointmentIcon}><CalendarDays size={19} color={emmeTokens.brand.primary} /></View>
          <View style={styles.quickCopy}><Text style={styles.quickTitle}>{nextAppointment ? nextAppointment.service : 'Tu próxima cita'}</Text><Text style={styles.quickSubtitle}>{nextAppointment ? `${nextAppointment.day} · ${nextAppointment.time}` : 'Consulta y gestiona tus visitas'}</Text></View>
          <ChevronRight size={17} color={emmeTokens.modes.neutral.muted} />
        </PressableScale>
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, maxWidth: 760, width: '100%', alignSelf: 'center', gap: 19 },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 11 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.brand.primarySoft },
  avatarInitial: { color: emmeTokens.brand.primary, fontSize: 17, fontWeight: '800' },
  headerCopy: { flex: 1, gap: 2 },
  screenTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 27, lineHeight: 31, fontWeight: '800', letterSpacing: -0.6 },
  headerSubtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 12 },
  searchButton: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.modes.neutral.surface },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 2 },
  sectionTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 19, lineHeight: 25, fontWeight: '800', letterSpacing: -0.35 },
  sectionSubtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, lineHeight: 17, marginTop: 2 },
  seeAll: { color: emmeTokens.brand.primary, fontSize: 12, fontWeight: '700' },
  popularList: { paddingHorizontal: 12, backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 22, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingVertical: 8 },
  serviceRow: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 10 },
  serviceCard: { width: '49%', minHeight: 86, paddingHorizontal: 8, borderRadius: 15 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 52, backgroundColor: emmeTokens.modes.neutral.separator },
  serviceMark: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.brand.primarySoft },
  serviceCopy: { flex: 1, minWidth: 0, gap: 3 },
  serviceName: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  serviceDetail: { color: emmeTokens.modes.neutral.secondary, fontSize: 11 },
  serviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceMetaText: { color: emmeTokens.modes.neutral.muted, fontSize: 11 },
  servicePrice: { alignItems: 'flex-end', gap: 4 },
  price: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  categories: { gap: 8 },
  category: { minHeight: 42, paddingHorizontal: 15, borderRadius: 999, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, backgroundColor: emmeTokens.modes.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  categorySelected: { backgroundColor: emmeTokens.brand.primarySoft, borderColor: '#E7C6D2' },
  categoryText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, fontWeight: '600' },
  categoryTextSelected: { color: emmeTokens.brand.primary, fontWeight: '700' },
  feature: { height: 238, borderRadius: 24, overflow: 'hidden', justifyContent: 'space-between', padding: 18 },
  featureImage: { borderRadius: 24 },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featureEyebrow: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  featureCopy: { gap: 4 },
  featureTitle: { color: '#FFFFFF', fontSize: 23, lineHeight: 28, fontWeight: '800', letterSpacing: -0.4 },
  featureSubtitle: { color: 'rgba(255,255,255,0.92)', fontSize: 12 },
  featureLink: { minHeight: 42, alignSelf: 'flex-start', borderRadius: 22, marginTop: 7, paddingHorizontal: 13, backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureLinkText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  quickActions: { gap: 8 },
  quickAction: { minHeight: 60, borderRadius: 18, paddingHorizontal: 12, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, flexDirection: 'row', alignItems: 'center', gap: 11 },
  quickCopy: { flex: 1, gap: 3 },
  quickTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  quickSubtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 11 },
  quickIcon: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.brand.primarySoft },
  appointmentCard: { minHeight: 60, borderRadius: 18, paddingHorizontal: 12, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, flexDirection: 'row', alignItems: 'center', gap: 11 },
  appointmentIcon: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.brand.primarySoft },
  pressed: { opacity: 0.76 },
});
