import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ArrowLeft, ArrowRight, Camera, ChevronRight, Clock3, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { studioServices } from '../src/expo/serviceCatalog';
import { useTabBarClearance } from '../src/expo/useTabBarClearance';
import { emmeTokens } from '../src/expo/theme';
import { OptimizedImage } from '../src/expo/components/OptimizedImage';
import { PressableScale } from '../src/expo/components/ui/PressableScale';

const categories = ['Todo', 'Manicura', 'Soft Gel', 'Acrílico', 'Nail art', 'Pedicura'];
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ServiceCatalogCard({ service, wide, onPress }: { service: (typeof studioServices)[number]; wide: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <AnimatedPressable
    onPress={onPress}
    onPressIn={() => { if (!reduceMotion) scale.value = withSpring(0.975, { damping: 18, stiffness: 320 }); }}
    onPressOut={() => { scale.value = withSpring(1, { damping: 16, stiffness: 260 }); }}
    style={[styles.serviceCard, wide && styles.wideCard, pressStyle]}
    accessibilityRole="button"
    accessibilityLabel={`${service.name}, ${service.duration}, desde ${service.price} pesos`}
  >
    <View style={styles.techniqueMark}><Sparkles size={17} color={emmeTokens.brand.primary} /></View>
    <View style={styles.serviceCopy}><Text numberOfLines={2} style={styles.serviceName}>{service.name}</Text><Text numberOfLines={1} style={styles.serviceDetail}>{service.technique} · {service.duration}</Text></View>
    <View style={styles.servicePrice}><Text style={styles.price}>${service.price}</Text><ChevronRight size={17} color={emmeTokens.modes.neutral.muted} /></View>
  </AnimatedPressable>;
}

function matchesCategory(serviceName: string, category: string) {
  if (category === 'Todo') return true;
  if (category === 'Manicura') return /manicura|semi-permanente/i.test(serviceName);
  if (category === 'Nail art') return /manicura|soft gel|acr/i.test(serviceName);
  return serviceName.toLowerCase().includes(category.toLowerCase());
}

export default function DesignsScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const initialCategory = categories.find((item) => item.toLowerCase() === params.category?.toLowerCase()) || 'Todo';
  const [category, setCategory] = useState(initialCategory);
  const tabBarClearance = useTabBarClearance();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const visibleServices = useMemo(() => studioServices.filter((service) => matchesCategory(service.name, category)), [category]);
  const feature = studioServices[1];

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <FlashList
      data={visibleServices}
      key={width >= 680 ? 'wide' : 'compact'}
      numColumns={width >= 680 ? 2 : 1}
      keyExtractor={(service) => service.id}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(360)} style={styles.headerContent}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver">
          <ArrowLeft size={20} color={emmeTokens.modes.neutral.foreground} />
        </Pressable>
        <View style={styles.heading}><Text style={styles.kicker}>INSPIRACIÓN EMME</Text><Text style={styles.title}>Encuentra tu estilo</Text><Text style={styles.subtitle}>Diseños y técnicas para tu próxima visita.</Text></View>
      </View>

      <Pressable onPress={() => router.push({ pathname: '/service-detail', params: { service: feature.id } } as unknown as Href)} accessibilityRole="button" accessibilityLabel={`Diseño destacado: ${feature.name}`}>
        <View style={styles.feature}>
          <OptimizedImage source={feature.image as number} fill style={styles.featureImage} />
          <LinearGradient colors={['rgba(20,14,16,0.02)', 'rgba(20,14,16,0.12)', 'rgba(20,14,16,0.78)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.featureTag}><Sparkles size={13} color="#FFFFFF" /><Text style={styles.featureTagText}>DISEÑO DESTACADO</Text></View>
          <View style={styles.featureCopy}><Text style={styles.featureName}>Nude con detalle minimal</Text><Text style={styles.featureService}>{feature.name} · {feature.duration}</Text><View style={styles.featureLink}><Text style={styles.featureLinkText}>Ver servicio</Text><ArrowRight size={15} color="#FFFFFF" /></View></View>
        </View>
      </Pressable>

      <Text style={styles.sectionTitle}>Explora por técnica</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map((item) => <PressableScale key={item} onPress={() => setCategory(item)} accessibilityRole="button" accessibilityState={{ selected: category === item }} style={[styles.chip, category === item && styles.chipSelected]}>
          <Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item}</Text>
        </PressableScale>)}
      </ScrollView>

      <View style={styles.listHeader}><Text style={styles.sectionTitle}>{category === 'Todo' ? 'Servicios para explorar' : category}</Text><Text style={styles.resultCount}>{visibleServices.length}</Text></View>
      </Animated.View>}
      ListFooterComponent={<Pressable onPress={() => router.push('/quotes')} style={[styles.quoteAction, { marginHorizontal: 20, marginTop: 17 }]} accessibilityRole="button" accessibilityLabel="Cotizar un diseño con una foto">
        <View style={styles.quoteIcon}><Camera size={18} color={emmeTokens.brand.primary} /></View>
        <View style={styles.quoteCopy}><Text style={styles.quoteTitle}>¿Tienes una referencia?</Text><Text style={styles.quoteText}>Cotiza tu diseño con una foto.</Text></View>
        <ArrowRight size={17} color={emmeTokens.brand.primary} />
      </Pressable>}
      renderItem={({ item: service, index }) => <Animated.View entering={reduceMotion ? undefined : FadeInDown.delay(Math.min(index, 6) * 45).duration(280)}><ServiceCatalogCard service={service} wide={width >= 680} onPress={() => router.push({ pathname: '/service-detail', params: { service: service.id } } as unknown as Href)} /></Animated.View>}
      ListEmptyComponent={<Text style={[styles.empty, { paddingHorizontal: 20 }]}>Pronto añadiremos más diseños de esta técnica.</Text>}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingTop: 8 },
  headerContent: { paddingHorizontal: 20, gap: 17 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: emmeTokens.modes.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  heading: { flex: 1, gap: 3, paddingTop: 2 },
  kicker: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: emmeTokens.modes.neutral.foreground, fontSize: 27, lineHeight: 32, fontWeight: '800', letterSpacing: -0.65 },
  subtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, lineHeight: 18 },
  feature: { height: 260, borderRadius: 24, overflow: 'hidden', justifyContent: 'space-between', padding: 18 },
  featureImage: { borderRadius: 24 },
  featureTag: { alignSelf: 'flex-start', minHeight: 32, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(18,12,14,0.38)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureTagText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  featureCopy: { gap: 5 },
  featureName: { color: '#FFFFFF', fontSize: 23, lineHeight: 28, fontWeight: '800' },
  featureService: { color: 'rgba(255,255,255,0.92)', fontSize: 12 },
  featureLink: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 13, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)' },
  featureLinkText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  sectionTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 18, fontWeight: '800', letterSpacing: -0.25 },
  categories: { gap: 8 },
  chip: { minHeight: 42, paddingHorizontal: 15, borderRadius: 999, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, backgroundColor: emmeTokens.modes.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: emmeTokens.brand.primarySoft, borderColor: '#E7C6D2' },
  chipText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: emmeTokens.brand.primary, fontWeight: '700' },
  listHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  resultCount: { color: emmeTokens.modes.neutral.muted, fontSize: 12 },
  serviceCard: { minHeight: 74, flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 5, marginVertical: 4, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 16, backgroundColor: emmeTokens.modes.neutral.surface },
  wideCard: { maxWidth: '48.5%' },
  techniqueMark: { width: 38, height: 38, borderRadius: 14, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  serviceCopy: { flex: 1, gap: 4 },
  serviceName: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  serviceDetail: { color: emmeTokens.modes.neutral.secondary, fontSize: 11 },
  servicePrice: { alignItems: 'flex-end', gap: 4 },
  price: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  empty: { padding: 18, color: emmeTokens.modes.neutral.secondary, fontSize: 13 },
  quoteAction: { minHeight: 68, paddingHorizontal: 13, borderRadius: 19, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, backgroundColor: emmeTokens.modes.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: 11 },
  quoteIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  quoteCopy: { flex: 1, gap: 2 },
  quoteTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' },
  quoteText: { color: emmeTokens.modes.neutral.secondary, fontSize: 11 },
  pressed: { opacity: 0.75 },
});
