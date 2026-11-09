/**
 * SISTEMA DE DISEÑO (glass oscuro / cristal translúcido)
 * -------------------------------------------------------
 * Este es el ÚNICO archivo que necesitas editar para cambiar el aspecto
 * de toda la app: colores, esquinas, espacios, tipografía, manchas de fondo
 * y presets.
 *
 *  G      → colores              R      → radios (esquinas)
 *  S      → espacios             T      → textos
 *  BLOBS  → manchas del fondo    glass  → presets (tarjeta, input, chip, fila)
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

/* ============ COLORES ============ */
export const G = {
  // Fondo base (detrás de las manchas de color)
  bg: '#070A16',
  // Fondo de barras / menús que necesitan ser opacos
  bgRaised: '#0D1226',

  // Vidrio: casi transparente, apenas una capa de luz (NO lechoso)
  glass: 'rgba(255,255,255,0.05)',
  glassStrong: 'rgba(255,255,255,0.09)',
  glassSoft: 'rgba(255,255,255,0.03)',

  // Bordes de luz del vidrio (finos y claros)
  border: 'rgba(255,255,255,0.18)',
  borderSoft: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.10)',

  // Textos (contraste alto sobre fondo oscuro)
  text: '#EAF0FF',
  textSoft: '#B4C0E0',
  textMute: '#8A97BC',
  onAccent: '#06101F',

  // Acento principal: azul → cian
  accent: '#5BA8FF',
  accentEnd: '#22D3EE',
  accentSoft: 'rgba(91,168,255,0.16)',
  // Acento secundario: violeta
  violet: '#A78BFA',
  violetSoft: 'rgba(167,139,250,0.16)',
  cyanSoft: 'rgba(34,211,238,0.14)',

  // Estados
  danger: '#FF7A9C',
  dangerSoft: 'rgba(255,122,156,0.14)',
  success: '#4ADE9B',
  successSoft: 'rgba(74,222,155,0.14)',

  // Colores de las manchas del fondo (azul, cian y violeta armonizados)
  blob: {
    blue: '#2F6BFF',
    cyan: '#12B5D6',
    violet: '#7C4DFF',
    indigo: '#4338CA',
  },
} as const;

/** Tonos para avatares (se elige uno según el id del estudiante) */
export const AVATAR_TONES = [
  'rgba(91,168,255,0.30)',
  'rgba(34,211,238,0.28)',
  'rgba(167,139,250,0.32)',
  'rgba(129,140,248,0.30)',
  'rgba(56,189,248,0.28)',
  'rgba(192,132,252,0.30)',
] as const;

/* ============ MEDIDAS ============ */
export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
// Esquinas compactas. `pill` se conserva solo para círculos/avatares.
export const R = { sm: 8, md: 10, lg: 14, xl: 16, pill: 999 } as const;

/* ============ TEXTOS ============ */
type TextKey = 'title' | 'heading' | 'body' | 'label' | 'caption';

export const T: Record<TextKey, TextStyle> = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: G.text, letterSpacing: -0.3 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: G.text },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500', color: G.text },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: G.textSoft, letterSpacing: 0.6 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500', color: G.textMute },
};

/* ============ MANCHAS DEL FONDO ============ */
// Cada mancha: tamaño, color, posición e intensidad (0 a 1). Edita aquí el fondo.
export const BLOBS: { size: number; color: string; strength: number; pos: ViewStyle }[] = [
  { size: 440, color: G.blob.blue, strength: 0.9, pos: { top: -170, left: -170 } },
  { size: 360, color: G.blob.violet, strength: 0.85, pos: { top: '30%', right: -190 } },
  { size: 400, color: G.blob.cyan, strength: 0.7, pos: { bottom: -190, left: -120 } },
  { size: 240, color: G.blob.indigo, strength: 0.8, pos: { bottom: '20%', right: -90 } },
];

/* ============ EFECTOS ============ */
// En web se agrega desenfoque real del fondo; en móvil se ignora sin romper nada.
const webBlur: object =
  Platform.OS === 'web' ? { backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' } : {};

const SOFT_SHADOW = '0px 8px 28px rgba(0,0,0,0.35)';

/* ============ PRESETS ============ */
export const glass = {
  /** Tarjeta de vidrio */
  card: {
    backgroundColor: G.glass,
    borderWidth: 1,
    borderColor: G.border,
    borderRadius: R.xl,
    overflow: 'hidden',
    boxShadow: SOFT_SHADOW,
    ...webBlur,
  } as ViewStyle,

  /** Campo de texto */
  input: {
    backgroundColor: G.glassStrong,
    borderWidth: 1,
    borderColor: G.border,
    borderRadius: R.md,
    paddingHorizontal: S.lg,
    paddingVertical: 14,
    color: G.text,
    fontSize: 15,
  } as TextStyle,

  /** Campo con error */
  inputError: {
    borderColor: G.danger,
    backgroundColor: G.dangerSoft,
  } as TextStyle,

  /** Etiqueta pequeña */
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: G.accentSoft,
    borderWidth: 1,
    borderColor: G.borderSoft,
    borderRadius: R.sm,
    paddingHorizontal: S.md,
    paddingVertical: 5,
  } as ViewStyle,

  /** Cuadrito para iconos / botones de barra (cuadrado de esquinas suaves) */
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: G.glassStrong,
    borderWidth: 1,
    borderColor: G.border,
  } as ViewStyle,

  /** Fila tocable (opciones de menú, ajustes, accesos rápidos) */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    paddingVertical: S.md,
    paddingHorizontal: S.md,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: G.borderSoft,
    backgroundColor: G.glass,
  } as ViewStyle,
};

/** Opciones de encabezado para las pantallas de expo-router */
export const headerOptions = {
  headerStyle: { backgroundColor: G.bgRaised },
  headerTitleStyle: { fontWeight: '800' as const, color: G.text },
  headerTintColor: G.text,
  headerShadowVisible: false,
  headerTitleAlign: 'left' as const,
  contentStyle: { backgroundColor: G.bg },
};
