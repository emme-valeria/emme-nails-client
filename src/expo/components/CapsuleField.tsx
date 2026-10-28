import { ChevronDown } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { emmeTokens } from '../theme';

type CapsuleFieldProps = {
  label?: string;
  value?: string;
  placeholder: string;
  accessibilityLabel: string;
  leading?: ReactNode;
  onPress: () => void;
};

export function CapsuleField({ label, value, placeholder, accessibilityLabel, leading, onPress }: CapsuleFieldProps) {
  return <View style={styles.fieldGroup}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Abre las opciones disponibles"
      onPress={onPress}
      style={({ pressed }) => [styles.field, pressed && styles.pressed]}
    >
      {leading}
      <Text numberOfLines={1} style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
      <ChevronDown size={19} color={emmeTokens.modes.neutral.secondary} />
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  fieldGroup: { gap: 8 },
  label: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  field: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: emmeTokens.radius.pill,
    borderWidth: 1,
    borderColor: emmeTokens.modes.neutral.border,
    backgroundColor: emmeTokens.modes.neutral.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  value: { flex: 1, color: emmeTokens.modes.neutral.foreground, fontSize: 15, fontWeight: '600' },
  placeholder: { color: emmeTokens.modes.neutral.muted, fontWeight: '400' },
  pressed: { opacity: 0.76 },
});
