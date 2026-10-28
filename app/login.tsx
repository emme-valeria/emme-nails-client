import { ArrowLeft, ArrowRight, MessageCircle, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpoAuth } from '../src/expo/AuthContext';

export default function LoginScreen() {
  const { signInWithPhone } = useExpoAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');

  const requestCode = () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Escribe un número de 10 dígitos para continuar.');
      return;
    }
    setError('');
    setShowCode(true);
  };

  const verifyCode = async () => {
    if (code.replace(/\D/g, '').length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }
    setError('');
    await signInWithPhone(name, `+52${phone.replace(/\D/g, '')}`);
  };

  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}><View style={styles.brandIcon}><Sparkles size={19} color="#FFFFFF" /></View><Text style={styles.brandText}><Text style={styles.brandRose}>emme</Text> studio</Text></View>
        <View style={styles.hero}><View style={styles.heroIcon}><MessageCircle size={26} color="#E05286" /></View><Text style={styles.title}>{showCode ? 'Revisa tu código' : 'Tu momento empieza aquí'}</Text><Text style={styles.subtitle}>{showCode ? `Continúa con tu número +52 ${phone}` : 'Accede a tus citas, descubre servicios y guarda tus diseños favoritos.'}</Text></View>
        <View style={styles.form}>
          {!showCode ? <>
            <Text style={styles.label}>¿Cómo te llamas?</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Tu nombre" placeholderTextColor="#A59BA2" autoCapitalize="words" returnKeyType="next" style={styles.input} />
            <Text style={styles.label}>Número de WhatsApp</Text>
            <View style={styles.phoneRow}><View style={styles.country}><Text style={styles.countryText}>🇲🇽  +52</Text></View><TextInput value={phone} onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))} placeholder="10 dígitos" placeholderTextColor="#A59BA2" keyboardType="phone-pad" returnKeyType="done" style={styles.phoneInput} /></View>
            <Pressable onPress={requestCode} style={styles.primary}><Text style={styles.primaryText}>Continuar</Text><ArrowRight size={17} color="#FFFFFF" /></Pressable>
            <Text style={styles.disclaimer}>El acceso de Expo es local de desarrollo; aún no envía SMS ni verifica una cuenta de Firebase.</Text>
          </> : <>
            <Pressable onPress={() => { setShowCode(false); setCode(''); setError(''); }} style={styles.back}><ArrowLeft size={16} color="#6D626A" /><Text style={styles.backText}>Cambiar número</Text></Pressable>
            <Text style={styles.label}>Código de 6 dígitos</Text>
            <TextInput value={code} onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))} placeholder="— — — — — —" placeholderTextColor="#C6BBC2" keyboardType="number-pad" textContentType="oneTimeCode" style={styles.codeInput} />
            <Text style={styles.disclaimer}>La integración de SMS todavía no está conectada. Para desarrollo, cualquier código de 6 dígitos continúa con un perfil local.</Text>
            <Pressable onPress={verifyCode} style={styles.primary}><Text style={styles.primaryText}>Entrar a Emme</Text><ArrowRight size={17} color="#FFFFFF" /></Pressable>
          </>}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Text style={styles.footer}>EMME STUDIO · CUIDADO QUE SE SIENTE TUYO</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF7F9' }, keyboard: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center' }, content: { flexGrow: 1, paddingHorizontal: 25, paddingTop: 25, paddingBottom: 22, justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#E05286', alignItems: 'center', justifyContent: 'center' }, brandText: { color: '#1D1D1F', fontSize: 19, fontWeight: '800', letterSpacing: -0.6 }, brandRose: { color: '#E05286' },
  hero: { alignItems: 'center', marginTop: 49, marginBottom: 36 }, heroIcon: { width: 63, height: 63, borderRadius: 28, backgroundColor: '#F7E4EB', alignItems: 'center', justifyContent: 'center' }, title: { color: '#1D1D1F', fontSize: 27, fontWeight: '800', textAlign: 'center', letterSpacing: -0.8, marginTop: 19 }, subtitle: { maxWidth: 315, color: '#86868B', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 19, borderWidth: 1, borderColor: '#EEE7EB', shadowColor: '#493640', shadowOpacity: 0.05, shadowRadius: 18, shadowOffset: { width: 0, height: 7 } }, label: { color: '#40363D', fontSize: 12, fontWeight: '700', marginBottom: 7, marginTop: 14 }, input: { height: 48, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FBFBFD', paddingHorizontal: 13, color: '#1D1D1F', fontSize: 14 }, phoneRow: { flexDirection: 'row', gap: 8 }, country: { minWidth: 83, height: 48, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FBFBFD', alignItems: 'center', justifyContent: 'center' }, countryText: { color: '#51464D', fontSize: 13, fontWeight: '600' }, phoneInput: { flex: 1, height: 48, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FBFBFD', paddingHorizontal: 13, color: '#1D1D1F', fontSize: 14 }, primary: { minHeight: 50, borderRadius: 24, backgroundColor: '#E05286', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 20, shadowColor: '#E05286', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }, primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }, codeInput: { height: 56, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FBFBFD', textAlign: 'center', letterSpacing: 8, color: '#1D1D1F', fontSize: 20, fontWeight: '700' }, back: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5 }, backText: { color: '#6D626A', fontSize: 12, fontWeight: '600' }, disclaimer: { color: '#968B92', fontSize: 10, lineHeight: 15, marginTop: 12, textAlign: 'center' }, error: { color: '#B42346', fontSize: 12, marginTop: 10 }, footer: { color: '#A79DA3', fontSize: 9, fontWeight: '700', letterSpacing: 1.15, textAlign: 'center', marginTop: 22 },
});
