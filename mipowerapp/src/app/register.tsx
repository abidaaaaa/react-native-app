import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { GlassBackground, GlassButton, GlassCard } from '../components/glass';
import { G, S, T, glass } from '../constants/design';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.nombre || !form.apellido || !form.matricula || 
        !form.email || !form.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const success = await register({
      nombre: form.nombre,
      apellido: form.apellido,
      matricula: form.matricula,
      email: form.email,
      password: form.password,
    });

    if (success) {
      Alert.alert('Éxito', 'Cuenta creada exitosamente');
      router.replace('/home');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Creando cuenta..." />;
  }

  return (
    <GlassBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + S.xl, paddingBottom: insets.bottom + S.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>
            {error && (
              <View style={styles.errorWrap}>
                <ErrorMessage error={error} onDismiss={clearError} />
              </View>
            )}

            <GlassCard style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Completa tus datos</Text>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.half]}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={G.textMute}
                    placeholder="Juan"
                    value={form.nombre}
                    onChangeText={(v) => updateForm('nombre', v)}
                  />
                </View>

                <View style={[styles.inputContainer, styles.half]}>
                  <Text style={styles.label}>Apellido</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={G.textMute}
                    placeholder="Pérez"
                    value={form.apellido}
                    onChangeText={(v) => updateForm('apellido', v)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Matrícula</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={G.textMute}
                  placeholder="A00123456"
                  value={form.matricula}
                  onChangeText={(v) => updateForm('matricula', v)}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={G.textMute}
                  placeholder="tu@email.com"
                  value={form.email}
                  onChangeText={(v) => updateForm('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={G.textMute}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChangeText={(v) => updateForm('password', v)}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={G.textMute}
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChangeText={(v) => updateForm('confirmPassword', v)}
                  secureTextEntry
                />
              </View>

              <GlassButton
                title="Crear Cuenta"
                onPress={handleRegister}
                disabled={loading}
                style={styles.button}
              />

              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => router.back()}
              >
                <Text style={styles.linkText}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: S.xl,
  },
  column: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: S.lg,
  },
  // ErrorMessage trae su propio margen; se compensa para que quede alineado con la tarjeta
  errorWrap: { marginHorizontal: -S.lg, marginVertical: -S.lg },
  card: { padding: S.xl, gap: S.lg },
  header: { gap: S.xs },
  title: { ...T.title },
  subtitle: { ...T.caption, fontSize: 15 },
  row: { flexDirection: 'row', gap: S.md },
  half: { flex: 1, minWidth: 0 },
  inputContainer: { gap: 6 },
  label: { ...T.label },
  input: { ...glass.input },
  button: { marginTop: S.sm },
  linkButton: { alignItems: 'center', paddingVertical: S.md },
  linkText: { color: G.accent, fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
