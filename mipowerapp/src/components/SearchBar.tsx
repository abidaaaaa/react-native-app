import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { P } from '../constants/palette';

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
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNotified = useRef(value);

  useEffect(() => {
    setLocalValue(value);
    lastNotified.current = value;
  }, [value]);

  useEffect(() => {
    if (localValue === lastNotified.current) return;
    debounceTimer.current = setTimeout(() => {
      lastNotified.current = localValue;
      onChangeText(localValue);
    }, debounceMs);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [localValue, debounceMs, onChangeText]);

  const handleClear = () => {
    setLocalValue('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCell}>
        <Text style={styles.icon}>⌕</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={P.inkMute}
        value={localValue}
        onChangeText={setLocalValue}
      />
      {localValue.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: P.paper,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: P.lavenderStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  iconCell: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: P.lavenderStrong,
    borderRightWidth: 2,
    borderRightColor: P.ink,
  },
  icon: {
    fontSize: 24,
    color: P.ink,
    fontWeight: '900',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: P.ink,
  },
  clearButton: {
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: P.rose,
    borderLeftWidth: 2,
    borderLeftColor: P.ink,
  },
  clearText: {
    color: P.ink,
    fontSize: 16,
    fontWeight: '900',
  },
});