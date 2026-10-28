import { router, type Href } from 'expo-router';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabBarClearance } from '../src/expo/useTabBarClearance';
import { studioServices } from '../src/expo/serviceCatalog';
import { emmeTokens } from '../src/expo/theme';
import { OptimizedImage } from '../src/expo/components/OptimizedImage';

const groups = [
  { title: 'Manicura y uñas', ids: ['manicura-express', 'manicura-rusa-rubber', 'semi-permanente'] },
  { title: 'Extensiones y estructura', ids: ['soft-gel', 'acrilico-escultural'] },
  { title: 'Pedicura & spa', ids: ['pedicura-jelly-spa'] },
];

export default function ServicesScreen() {
  const tabBarClearance = useTabBarClearance();
  const { width } = useWindowDimensions();
  const isWide = width >= 680;
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver">
        <ArrowLeft size={18} color={emmeTokens.modes.neutral.secondary} /><Text style={styles.backText}>Volver</Text>
      </Pressable>
      <Text style={styles.kicker}>CUIDADO HECHO PARA TI</Text>
      <Text style={styles.title}>Nuestros servicios</Text>
      <Text style={styles.subtitle}>Técnicas y detalles para encontrar tu próximo favorito.</Text>
      {groups.map((group) => <View key={group.title} style={styles.group}>
        <Text style={styles.groupTitle}>{group.title}</Text>
        <View style={[styles.groupCard, isWide && styles.groupGrid]}>
          {group.ids.map((id, index) => {
            const service = studioServices.find((item) => item.id === id);
            if (!service) return null;
            return <View key={service.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${service.name}, ${service.duration}, $${service.price}. Ver detalles`}
                onPress={() => router.push({ pathname: '/service-detail', params: { service: service.id } } as unknown as Href)}
                style={({ pressed }) => [styles.row, isWide && styles.gridItem, pressed && styles.pressed]}
              >
                <OptimizedImage source={service.image as number} style={styles.icon} />
                <View style={styles.details}>
                  <Text numberOfLines={1} style={styles.name}>{service.name}</Text>
                  <Text numberOfLines={2} style={styles.description}>{service.detail}</Text>
                  <View style={styles.meta}><Clock3 size={13} color={emmeTokens.modes.neutral.muted} /><Text style={styles.duration}>{service.duration}</Text></View>
                </View>
                <View style={styles.price}><Text style={styles.priceText}>${service.price}</Text><ArrowRight size={16} color={emmeTokens.brand.primary} /></View>
              </Pressable>
            </View>;
          })}
        </View>
      </View>)}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background },
  content: { paddingHorizontal: 22, paddingTop: 10, maxWidth: 760, width: '100%', alignSelf: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  backText: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, fontWeight: '600' },
  kicker: { color: emmeTokens.brand.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 14 },
  title: { color: emmeTokens.modes.neutral.foreground, fontSize: 31, fontWeight: '800', letterSpacing: -1, marginTop: 7 },
  subtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, lineHeight: 20, marginTop: 5 },
  group: { marginTop: 25 },
  groupTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  groupCard: { backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, paddingHorizontal: 15, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingVertical: 10 },
  row: { minHeight: 94, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  gridItem: { width: '49%', minHeight: 112, paddingHorizontal: 9, borderRadius: 17 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: emmeTokens.modes.neutral.separator, marginLeft: 62 },
  icon: { width: 50, height: 58, borderRadius: 13, backgroundColor: emmeTokens.modes.neutral.surfaceSubtle },
  details: { flex: 1, minWidth: 0 },
  name: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  description: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  duration: { color: emmeTokens.modes.neutral.muted, fontSize: 12 },
  price: { alignItems: 'flex-end', justifyContent: 'center', gap: 5 },
  priceText: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
