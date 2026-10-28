import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native';
import { emmeTokens } from '../../theme';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  className?: string;
};

export function Input({ label, error, containerStyle, className, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  return <View style={containerStyle}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...props}
      accessibilityLabel={props.accessibilityLabel || label}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      placeholderTextColor={emmeTokens.modes.neutral.muted}
      style={[styles.input, focused && styles.focused, error && styles.invalid, props.style]}
      className={className}
    />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  label: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700', marginBottom: 7 },
  input: { minHeight: 48, borderRadius: emmeTokens.radius.field, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, backgroundColor: emmeTokens.modes.neutral.surface, paddingHorizontal: 15, paddingVertical: 12, color: emmeTokens.modes.neutral.foreground, fontSize: 15 },
  focused: { borderColor: emmeTokens.brand.primary },
  invalid: { borderColor: emmeTokens.semantic.error },
  error: { marginTop: 5, color: emmeTokens.semantic.error, fontSize: 12 },
});
