import { router } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return <SafeAreaView style={styles.safe}><View style={styles.content}>
    <View style={styles.icon}><Sparkles size={25} color="#E05286" /></View>
    <Text style={styles.title}>No encontramos esta pantalla</Text>
    <Text style={styles.body}>Regresa al inicio para seguir explorando Emme Studio.</Text>
    <Pressable onPress={() => router.replace('/')} style={styles.button}><ArrowLeft size={16} color="#FFFFFF" /><Text style={styles.buttonText}>Ir al inicio</Text></Pressable>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#FBFBFD' }, content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }, icon: { width: 58, height: 58, borderRadius: 24, backgroundColor: 'rgba(224,82,134,0.1)', alignItems: 'center', justifyContent: 'center' }, title: { color: '#1D1D1F', fontSize: 21, fontWeight: '800', textAlign: 'center', marginTop: 19 }, body: { color: '#86868B', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 8, maxWidth: 280 }, button: { minHeight: 46, borderRadius: 20, backgroundColor: '#E05286', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18, marginTop: 22 }, buttonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' } });
