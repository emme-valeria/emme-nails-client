import type { ReactNode } from 'react';
import { Modal as NativeModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { emmeTokens } from '../../theme';

export function Modal({ visible, title, children, onClose, accessibilityLabel }: { visible: boolean; title: string; children: ReactNode; onClose: () => void; accessibilityLabel?: string }) {
  return <NativeModal transparent visible={visible} animationType="fade" onRequestClose={onClose} accessibilityLabel={accessibilityLabel || title}>
    <View style={styles.scrim}>
      <Pressable accessibilityRole="button" accessibilityLabel="Cerrar diálogo" onPress={onClose} style={StyleSheet.absoluteFill} />
      <View accessibilityRole="alert" style={styles.panel}>
        <View style={styles.header}><Text style={styles.title}>{title}</Text><Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" style={styles.close}><X size={18} color={emmeTokens.modes.neutral.foreground} /></Pressable></View>
        {children}
      </View>
    </View>
  </NativeModal>;
}

const styles = StyleSheet.create({ scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22, backgroundColor: 'rgba(20,16,18,0.38)' }, panel: { width: '100%', maxWidth: 480, borderRadius: 26, padding: 20, backgroundColor: emmeTokens.modes.neutral.background, gap: 14 }, header: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, title: { flex: 1, color: emmeTokens.modes.neutral.foreground, fontSize: 20, fontWeight: '800' }, close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.modes.neutral.surface } });
