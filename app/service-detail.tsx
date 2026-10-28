import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Clock3, Sparkles } from 'lucide-react-native';
import { useWindowDimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { findStudioService } from '../src/expo/serviceCatalog';
import { useTintedImageTheme } from '../src/expo/tintedPalette';
import { emmeTokens } from '../src/expo/theme';
import { OptimizedImage } from '../src/expo/components/OptimizedImage';

export default function ServiceDetailScreen() {
  const { service: serviceParam } = useLocalSearchParams<{ service?: string }>();
  const service = findStudioService(typeof serviceParam === 'string' ? serviceParam : undefined);
  const tinted = useTintedImageTheme(service.image);
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(Math.max(height * 0.52, 380), 520);

  return <SafeAreaView style={[styles.safe, { backgroundColor: tinted.background }]} edges={['top', 'bottom']}>
    <OptimizedImage source={service.image as number} blurRadius={46} style={styles.ambientImage} />
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${tinted.background}D9` }]} />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <OptimizedImage source={service.image as number} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[tinted.scrimTop, 'rgba(17,12,15,0.14)', tinted.scrimBottom]} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.heroTop}>
          <Pressable onPress={() => router.back()} style={styles.navButton} accessibilityRole="button" accessibilityLabel="Volver a servicios" hitSlop={8}>
            <ArrowLeft size={21} color="#FFFFFF" />
          </Pressable>
          <View style={styles.photoTag}><Sparkles size={13} color="#FFFFFF" /><Text style={styles.photoTagText}>DISEÑO EMME</Text></View>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroKicker}>{service.technique.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>{service.name}</Text>
          <Text style={styles.heroSubtitle}>Un acabado pensado para tu estilo.</Text>
        </View>
      </View>

      <View style={styles.detailsWrap}>
        <View style={styles.factsCard}>
          <View style={styles.fact}><Clock3 size={18} color={emmeTokens.brand.primary} /><View><Text style={styles.factLabel}>Duración</Text><Text style={styles.factValue}>{service.duration}</Text></View></View>
          <View style={styles.factDivider} />
          <View style={styles.fact}><Sparkles size={18} color={emmeTokens.brand.primary} /><View><Text style={styles.factLabel}>Técnica</Text><Text numberOfLines={1} style={styles.factValue}>{service.technique}</Text></View></View>
          <View style={styles.factDivider} />
          <View style={styles.fact}><Text style={styles.currency}>$</Text><View><Text style={styles.factLabel}>Desde</Text><Text style={styles.factValue}>${service.price}</Text></View></View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Sobre este servicio</Text>
          <Text style={styles.description}>{service.description}</Text>
          <View style={styles.includeRow}><Check size={17} color={emmeTokens.semantic.success} /><Text style={styles.includeText}>Preparación y cuidado de uñas</Text></View>
          <View style={styles.includeRow}><Check size={17} color={emmeTokens.semantic.success} /><Text style={styles.includeText}>Acabado profesional en estudio</Text></View>
        </View>
        <View style={styles.note}>
          <Text style={styles.noteText}>El precio final puede variar según largo y detalles de nail art. Lo revisaremos contigo antes de empezar.</Text>
        </View>
      </View>
    </ScrollView>

    <View style={styles.stickyFooter}>
      <View style={styles.footerPrice}><Text style={styles.footerLabel}>Desde</Text><Text style={styles.footerValue}>${service.price}</Text></View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Reservar ${service.name}, desde ${service.price} pesos`}
        onPress={() => router.push({ pathname: '/booking', params: { service: service.name } })}
        style={({ pressed }) => [styles.bookButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.bookButtonText}>Reservar este servicio</Text>
      </Pressable>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  ambientImage: { position: 'absolute', top: -90, left: -50, right: -50, height: 560, opacity: 0.42 },
  scroll: { paddingBottom: 130 },
  hero: { width: '100%', overflow: 'hidden', justifyContent: 'space-between' },
  heroTop: { paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(16,12,14,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', alignItems: 'center', justifyContent: 'center' },
  photoTag: { minHeight: 34, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(16,12,14,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.26)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  photoTagText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  heroCopy: { paddingHorizontal: 24, paddingBottom: 28, gap: 7 },
  heroKicker: { color: 'rgba(255,255,255,0.86)', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  heroTitle: { color: '#FFFFFF', fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 21 },
  detailsWrap: { paddingHorizontal: 20, paddingTop: 16, gap: 14, maxWidth: 760, width: '100%', alignSelf: 'center' },
  factsCard: { minHeight: 88, backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  fact: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8 },
  factLabel: { color: emmeTokens.modes.neutral.muted, fontSize: 11 },
  factValue: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700', marginTop: 3 },
  factDivider: { width: StyleSheet.hairlineWidth, height: 35, backgroundColor: emmeTokens.modes.neutral.separator },
  currency: { color: emmeTokens.brand.primary, fontSize: 21, fontWeight: '800' },
  descriptionCard: { backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)', padding: 19, gap: 12 },
  sectionTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 18, fontWeight: '700' },
  description: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, lineHeight: 21 },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 32 },
  includeText: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '500' },
  note: { paddingHorizontal: 4 },
  noteText: { color: '#FFFFFF', fontSize: 12, lineHeight: 18 },
  stickyFooter: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 13, paddingBottom: 10, backgroundColor: 'rgba(250,248,247,0.94)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.6)', flexDirection: 'row', alignItems: 'center', gap: 14 },
  footerPrice: { minWidth: 72 },
  footerLabel: { color: emmeTokens.modes.neutral.secondary, fontSize: 11 },
  footerValue: { color: emmeTokens.modes.neutral.foreground, fontSize: 19, fontWeight: '800', marginTop: 2 },
  bookButton: { flex: 1, minHeight: 52, borderRadius: 26, backgroundColor: emmeTokens.brand.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  bookButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  buttonPressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
});
