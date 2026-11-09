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
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { BLOCK, MONO, P } from '../constants/palette';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.stripes}>
            <View style={[styles.stripe, { backgroundColor: P.roseStrong }]} />
            <View style={[styles.stripe, { backgroundColor: P.peachStrong }]} />
            <View style={[styles.stripe, { backgroundColor: P.lavenderStrong }]} />
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos</Text>
        </View>

        {error && (
          <ErrorMessage error={error} onDismiss={clearError} />
        )}

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.half]}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={P.inkMute}
              placeholder="Juan"
                value={form.nombre}
                onChangeText={(v) => updateForm('nombre', v)}
              />
            </View>

            <View style={[styles.inputContainer, styles.half]}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={P.inkMute}
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
              placeholderTextColor={P.inkMute}
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
              placeholderTextColor={P.inkMute}
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
              placeholderTextColor={P.inkMute}
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
              placeholderTextColor={P.inkMute}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChangeText={(v) => updateForm('confirmPassword', v)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.back()}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: P.bg },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: { paddingBottom: 26 },
  stripes: { borderBottomWidth: 3, borderBottomColor: P.ink, marginBottom: 30 },
  stripe: { height: 12 },
  title: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    color: P.ink,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontFamily: MONO,
    fontSize: 13,
    color: P.inkSoft,
    marginTop: 10,
    marginHorizontal: 24,
    paddingTop: 10,
    borderTopWidth: 6,
    borderTopColor: P.ink,
  },
  form: { flex: 1, paddingHorizontal: 24, width: '100%', maxWidth: 560, alignSelf: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  inputContainer: { marginBottom: 18 },
  label: {
    alignSelf: 'flex-start',
    backgroundColor: P.lavender,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: P.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: P.ink,
  },
  input: {
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: P.ink,
    backgroundColor: P.paper,
  },
  button: {
    ...BLOCK,
    backgroundColor: P.mintStrong,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: P.ink, fontSize: 14, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  linkButton: { marginTop: 22, alignItems: 'center' },
  linkText: { color: P.lavenderDeep, fontSize: 14, fontWeight: '800', textDecorationLine: 'underline' },
});
