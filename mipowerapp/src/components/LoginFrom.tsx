import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { G, R, S, T, glass } from '../constants/design';
import { LoginFormProps } from '../interfaces/auth.interface';
import { GlassButton, GlassCard } from './glass';

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
    <GlassCard style={styles.card}>
      <View style={glass.chip}>
        <Text style={styles.eyebrow}>Portal del alumno</Text>
      </View>

      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.subtitle}>Bienvenido de nuevo</Text>

      {/* Correo */}
      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[styles.input, emailError !== '' && glass.inputError]}
          placeholder="Ingresa tu correo electrónico"
          placeholderTextColor={G.textMute}
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!loading}
        />
        {emailError !== '' && <Text style={styles.error}>{emailError}</Text>}
      </View>

      {/* Contraseña */}
      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
      <View style={[styles.passwordRow, passwordError !== '' && (glass.inputError as any)]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={G.textMute}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!loading}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
            disabled={loading}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            <Text style={styles.showText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        </View>
        {passwordError !== '' && <Text style={styles.error}>{passwordError}</Text>}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <GlassButton
        title={loading ? 'Validando...' : 'Iniciar sesión'}
        onPress={handleLogin}
        disabled={loading}
        style={styles.submit}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: S.xl,
    gap: S.md,
  },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: G.accent },
  title: { ...T.title },
  subtitle: { ...T.caption, fontSize: 15, marginTop: -S.sm, marginBottom: S.sm },
  field: { gap: 6 },
  label: { ...T.label },
  input: { ...glass.input },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: G.glassStrong,
    borderWidth: 1,
    borderColor: G.border,
    borderRadius: R.md,
    paddingRight: S.sm,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: S.lg,
    paddingVertical: 14,
    color: G.text,
    fontSize: 15,
  },
  showButton: {
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    borderRadius: R.sm,
    backgroundColor: G.accentSoft,
  },
  showText: { fontSize: 12, fontWeight: '700', color: G.accent },
  error: { fontSize: 13, fontWeight: '600', color: G.danger },
  submit: { marginTop: S.sm },
});
