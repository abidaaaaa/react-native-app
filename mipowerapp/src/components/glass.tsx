/**
 * Piezas reutilizables del diseño glass.
 * Si cambias algo aquí (o en constants/design.ts), cambia en toda la app.
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BLOBS, G, R, S, T, glass } from '../constants/design';

/* ---------- Mancha de color suave (círculos concéntricos) ---------- */
const LAYERS = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

function Blob({
  size,
  color,
  strength,
  style,
}: {
  size: number;
  color: string;
  strength: number;
  style: ViewStyle;
}) {
  return (
    <View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size }, style]}>
      {LAYERS.map(k => {
        const d = size * k;
        return (
          <View
            key={k}
            style={{
              position: 'absolute',
              width: d,
              height: d,
              borderRadius: d / 2,
              left: (size - d) / 2,
              top: (size - d) / 2,
              backgroundColor: color,
              opacity: 0.045 * strength,
            }}
          />
        );
      })}
    </View>
  );
}

/* ---------- Fondo oscuro con manchas de color (va detrás de todo) ---------- */
export function GlassBackground({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.root, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {BLOBS.map((b, i) => (
          <Blob key={i} size={b.size} color={b.color} strength={b.strength} style={b.pos} />
        ))}
      </View>
      {children}
    </View>
  );
}

/* ---------- Tarjeta de vidrio ---------- */
export function GlassCard({
  children,
  style,
  strong = false,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  strong?: boolean;
}) {
  return <View style={[glass.card, strong && styles.cardStrong, style]}>{children}</View>;
}

/* ---------- Botón ---------- */
type Variant = 'primary' | 'secondary' | 'danger';

interface GlassButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}: GlassButtonProps) {
  const isDisabled = disabled || loading;
  const textColor =
    variant === 'primary' ? G.onAccent : variant === 'danger' ? G.danger : G.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

/* ---------- Botón cuadrado de icono (menú, regresar, perfil...) ---------- */
export function GlassIconButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: string;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [glass.iconBox, pressed && styles.pressed]}>
      <Text style={styles.iconButtonText}>{icon}</Text>
    </Pressable>
  );
}

/* ---------- Barra superior (respeta la zona segura; nada se encima) ---------- */
export function GlassHeader({
  title,
  eyebrow,
  left,
  right,
}: {
  title: string;
  eyebrow?: string;
  left?: { icon: string; onPress: () => void; label: string };
  right?: { icon: string; onPress: () => void; label: string };
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + S.md }]}>
      {/* Los dos lados reservan siempre 44 px para que el título quede centrado */}
      <View style={styles.headerSide}>
        {left ? (
          <GlassIconButton icon={left.icon} onPress={left.onPress} accessibilityLabel={left.label} />
        ) : null}
      </View>
      <View style={styles.headerCopy}>
        {eyebrow ? (
          <Text style={styles.headerEyebrow} numberOfLines={1}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.headerSide}>
        {right ? (
          <GlassIconButton
            icon={right.icon}
            onPress={right.onPress}
            accessibilityLabel={right.label}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: G.bg,
    overflow: 'hidden',
  },
  cardStrong: {
    backgroundColor: G.glassStrong,
  },
  button: {
    minHeight: 50,
    borderRadius: R.md,
    paddingHorizontal: S.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: G.accent,
    borderColor: 'rgba(255,255,255,0.35)',
    experimental_backgroundImage: `linear-gradient(135deg, ${G.accent}, ${G.accentEnd})`,
  },
  secondary: {
    backgroundColor: G.glassStrong,
    borderColor: G.border,
  },
  danger: {
    backgroundColor: G.dangerSoft,
    borderColor: G.danger,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  buttonText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  iconButtonText: { fontSize: 20, color: G.text, fontWeight: '800' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    paddingHorizontal: S.lg,
    paddingBottom: S.md,
    backgroundColor: G.glass,
    borderBottomWidth: 1,
    borderBottomColor: G.border,
  },
  headerSide: { width: 44, height: 44 },
  headerCopy: { flex: 1, minWidth: 0, alignItems: 'center' },
  headerEyebrow: { ...T.label, color: G.accentEnd, letterSpacing: 1.4, textTransform: 'uppercase' },
  headerTitle: { ...T.heading, fontWeight: '800' },
});
