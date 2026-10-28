import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { emmeTokens } from '../theme';

type BottomSheetProps = {
  visible: boolean;
  title: string;
  accessibilityLabel?: string;
  children: ReactNode;
  onClose: () => void;
};

export function BottomSheet({ visible, title, accessibilityLabel, children, onClose }: BottomSheetProps) {
  return <Modal
    transparent
    visible={visible}
    animationType="slide"
    statusBarTranslucent
    onRequestClose={onClose}
    accessibilityLabel={accessibilityLabel || title}
  >
    <View style={styles.modalRoot}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar opciones" />
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.close} accessibilityRole="button" accessibilityLabel="Cerrar">
              <X size={19} color={emmeTokens.modes.neutral.foreground} />
            </Pressable>
          </View>
        </View>
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(20,16,18,0.34)' },
  sheet: {
    maxHeight: '82%',
    backgroundColor: emmeTokens.modes.neutral.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  header: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 14 },
  handle: { width: 38, height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: '#C8C2C5', marginBottom: 18 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  title: { flex: 1, color: emmeTokens.modes.neutral.foreground, fontSize: 20, fontWeight: '700' },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.modes.neutral.surface },
  body: { flexShrink: 1 },
  bodyContent: { paddingHorizontal: 22, paddingBottom: 24, gap: 8 },
});
