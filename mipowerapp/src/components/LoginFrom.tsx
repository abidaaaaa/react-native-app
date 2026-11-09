import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BLOCK, MONO, P } from '../constants/palette';
import { LoginFormProps } from '../interfaces/auth.interface';

/* ---------- Decoración flotante ---------- */
function FloatingEmoji({
  emoji,
  style,
  delay = 0,
  size = 28,
}: {
  emoji: string;
  style?: any;
  delay?: number;
  size?: number;
}) {
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-18, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    rot.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const a = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[style, a]} pointerEvents="none">
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

/* ---------- Fondo degradado + estrellas ---------- */
function DreamBg() {
  return (
    <>
      <View style={styles.gradientBg} pointerEvents="none" />

      <FloatingEmoji emoji="✨" size={22} delay={0}    style={styles.starA} />
      <FloatingEmoji emoji="🌙" size={40} delay={400}  style={styles.starB} />
      <FloatingEmoji emoji="☁️" size={44} delay={800}  style={styles.starC} />
      <FloatingEmoji emoji="🌸" size={26} delay={1200} style={styles.starD} />
      <FloatingEmoji emoji="⭐" size={20} delay={1600} style={styles.starE} />
      <FloatingEmoji emoji="✨" size={18} delay={2000} style={styles.starF} />
      <FloatingEmoji emoji="☁️" size={36} delay={600}  style={styles.starG} />
      <FloatingEmoji emoji="🌷" size={24} delay={1400} style={styles.starH} />
    </>
  );
}

export default function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  /**
   * ERROR #12: Race condition con mountedRef en el login
   * Problema: el login es asíncrono; si el usuario sale de la pantalla
   * mientras se valida, el componente intenta actualizar estado ya desmontado.
   * Solución: mountedRef (useRef) indica si el componente sigue montado
   * y se pone en false en el cleanup del useEffect.
   */
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.trim() !== '') setEmailError('');
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.trim() !== '') setPasswordError('');
  };

  /**
   * ERROR #12 (parte 2): handleLogin revisa mountedRef antes de actuar
   * Si el componente ya se desmontó, la función termina sin hacer nada.
   * Después espera (await) a onLogin para manejar bien la operación asíncrona.
   */
  const handleLogin = async () => {
    if (!mountedRef.current) return;
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (email.trim() === '') {
      setEmailError('El correo electrónico es obligatorio');
      valid = false;
    }
    if (password.trim() === '') {
      setPasswordError('La contraseña es obligatoria');
      valid = false;
    }
    if (!valid) return;
    await onLogin(email.trim(), password);
  };

  return (
    <View style={styles.root}>
      <DreamBg />

      <View style={styles.content}>
        <View style={styles.eyebrowTag}>
          <Text style={styles.eyebrow}>✦ PORTAL DEL ALUMNO ✦</Text>
        </View>

        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Bienvenido a tu mundo de sueños</Text>

        <View style={styles.divider} />

        {/* Correo */}
        <View style={styles.labelRow}>
          <Text style={styles.labelIcon}>✧</Text>
          <Text style={styles.label}>Correo Electrónico</Text>
        </View>
        <TextInput
          style={[styles.input, emailError !== '' && styles.inputError]}
          placeholder="Ingresa tu correo electrónico"
          placeholderTextColor={P.inkMute}
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!loading}
        />
        {emailError !== '' && <Text style={styles.error}>{emailError}</Text>}

        {/* Contraseña */}
        <View style={styles.labelRow}>
          <Text style={styles.labelIcon}>✧</Text>
          <Text style={styles.label}>Contraseña</Text>
        </View>
        <View
          style={[
            styles.passwordContainer,
            passwordError !== '' && styles.inputError,
          ]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={P.inkMute}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!loading}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
            disabled={loading}>
            <Text style={styles.showText}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </Pressable>
        </View>
        {passwordError !== '' && (
          <Text style={styles.error}>{passwordError}</Text>
        )}

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.submit,
            pressed && styles.submitPressed,
            loading && styles.submitDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}>
          <Text style={styles.submitText}>
            {loading ? 'Validando...' : 'Iniciar sesión'}
          </Text>
          <View style={styles.submitArrow}>
            <Text style={styles.submitArrowText}>▶</Text>
          </View>
        </Pressable>

        <Text style={styles.footnote}>✿ vuela alto, sueña profundo ✿</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    experimental_backgroundImage: `linear-gradient(180deg, ${P.lavenderSoft} 0%, ${P.roseSoft} 45%, ${P.yellowSoft} 100%)`,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },

  /* Decoraciones flotantes */
  starA: { position: 'absolute', top: '8%',  left: '10%' },
  starB: { position: 'absolute', top: '14%', right: '8%' },
  starC: { position: 'absolute', top: '32%', left: '4%' },
  starD: { position: 'absolute', top: '44%', right: '12%' },
  starE: { position: 'absolute', top: '60%', left: '14%' },
  starF: { position: 'absolute', top: '72%', right: '18%' },
  starG: { position: 'absolute', bottom: '12%', left: '8%' },
  starH: { position: 'absolute', bottom: '20%', right: '10%' },

  eyebrowTag: {
    alignSelf: 'flex-start',
    backgroundColor: P.yellow,
    borderWidth: 2,
    borderColor: P.ink,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    borderRadius: 999,
    shadowColor: P.yellowStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  eyebrow: {
    color: P.ink,
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '900',
    color: P.ink,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    textShadowColor: P.roseStrong,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 14,
    color: P.inkSoft,
    fontFamily: MONO,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  divider: {
    height: 4,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 28,
    experimental_backgroundImage: `linear-gradient(90deg, ${P.lavenderStrong}, ${P.roseStrong}, ${P.yellowStrong}, ${P.mintStrong})`,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  labelIcon: {
    color: P.lavenderDeep,
    fontSize: 16,
    fontWeight: '900',
  },
  label: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: P.ink,
  },
  input: {
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: P.paper,
    color: P.ink,
    fontSize: 15,
    shadowColor: P.lavenderStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: P.paper,
    overflow: 'hidden',
    shadowColor: P.lavenderStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: P.ink,
    fontSize: 15,
  },
  showButton: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    backgroundColor: P.mint,
    borderLeftWidth: 2,
    borderLeftColor: P.ink,
  },
  showText: {
    color: P.ink,
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputError: {
    borderColor: P.roseInk,
    backgroundColor: P.roseSoft,
  },
  error: {
    color: P.roseInk,
    fontFamily: MONO,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  submit: {
    ...BLOCK,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    experimental_backgroundImage: `linear-gradient(135deg, ${P.lavenderStrong}, ${P.roseStrong})`,
    marginTop: 12,
    overflow: 'hidden',
  },
  submitPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    color: P.ink,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  submitArrow: {
    width: 60,
    backgroundColor: P.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitArrowText: { color: P.yellow, fontSize: 18 },
  footnote: {
    textAlign: 'center',
    marginTop: 28,
    fontFamily: MONO,
    fontSize: 11,
    color: P.inkMute,
    letterSpacing: 1.5,
  },
});