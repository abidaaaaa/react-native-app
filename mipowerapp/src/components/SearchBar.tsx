import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { G, R, S, glass } from '../constants/design';
import { debounce } from '../utils/debounce';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const lastNotified = useRef(value);

  // Sincronizar con el valor externo
  useEffect(() => {
    setLocalValue(value);
    lastNotified.current = value;
  }, [value]);

  /**
   * ERROR #20: Debounce timer sin cleanup en unmount
   * Problema: el effect creaba un timer nuevo con cada carácter escrito
   * (si el usuario escribe "juan" rápido, se crean 4 timers).
   * Solución: una sola función con debounce (useCallback) y .cancel()
   * en el cleanup del effect para limpiar el timer pendiente.
   */
  const debouncedOnChange = useCallback(
    debounce((text: string) => {
      lastNotified.current = text;
      onChangeText(text);
    }, debounceMs),
    [onChangeText, debounceMs]
  );

  useEffect(() => {
    if (localValue === lastNotified.current) return;
    debouncedOnChange(localValue);
    return () => {
      debouncedOnChange.cancel();
    };
  }, [localValue, debouncedOnChange]);

  const handleClear = () => {
    setLocalValue('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={G.textMute}
        value={localValue}
        onChangeText={setLocalValue}
        accessibilityLabel={placeholder}
      />
      {localValue.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Borrar búsqueda">
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...glass.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: S.lg,
    marginVertical: S.md,
    paddingHorizontal: S.lg,
    borderRadius: R.lg,
    gap: S.sm,
  },
  icon: { fontSize: 22, color: G.accent },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: G.text,
    fontSize: 15,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: R.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: G.accentSoft,
  },
  clearText: { color: G.accent, fontSize: 13, fontWeight: '800' },
});
