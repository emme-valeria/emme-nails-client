import { ChevronRight, Heart, Settings, UserRound } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpoAuth } from '../../src/expo/AuthContext';
import { useTabBarClearance } from '../../src/expo/useTabBarClearance';
import { emmeTokens } from '../../src/expo/theme';

const rows = [{ title: 'Mis preferencias', icon: Heart }, { title: 'Configuración', icon: Settings }];

export default function ProfileScreen() {
  const { client, signOut } = useExpoAuth();
  const tabBarClearance = useTabBarClearance();
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}>
    <Text style={styles.kicker}>TU CUENTA</Text><Text style={styles.title}>Mi perfil</Text>
    <View style={styles.profile}><View style={styles.avatar}><UserRound size={25} color={emmeTokens.brand.primary} /></View><View><Text style={styles.name}>{client?.name || 'Clienta Emme'}</Text><Text style={styles.caption}>{client?.phone || 'Perfil de este dispositivo'}</Text></View></View>
    <View style={styles.menu}>{rows.map(({ title, icon: Icon }) => <Pressable key={title} style={styles.row}><View style={styles.rowIcon}><Icon size={18} color={emmeTokens.brand.primary} /></View><Text style={styles.rowTitle}>{title}</Text><ChevronRight size={17} color={emmeTokens.modes.neutral.muted} /></Pressable>)}</View>
    <Pressable onPress={() => void signOut()} style={styles.signOut}><Text style={styles.signOutText}>Cerrar sesión</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background }, content: { padding: 22, paddingTop: 26, maxWidth: 760, width: '100%', alignSelf: 'center' }, kicker: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 }, title: { color: emmeTokens.modes.neutral.foreground, fontSize: 31, fontWeight: '800', letterSpacing: -1, marginTop: 7 }, profile: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, padding: 17, marginTop: 23, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border }, avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center' }, name: { color: emmeTokens.modes.neutral.foreground, fontSize: 16, fontWeight: '700' }, caption: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, marginTop: 4 }, menu: { backgroundColor: emmeTokens.modes.neutral.surface, borderRadius: 24, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, paddingHorizontal: 13, marginTop: 16 }, row: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: emmeTokens.modes.neutral.separator }, rowIcon: { width: 38, height: 38, borderRadius: 14, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center' }, rowTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '600', flex: 1 }, signOut: { alignItems: 'center', justifyContent: 'center', minHeight: 48, marginTop: 16, borderRadius: 24, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border }, signOutText: { color: emmeTokens.semantic.error, fontSize: 12, fontWeight: '700' } });
