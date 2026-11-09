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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const success = await login({ email, password });
    
    if (success) {
      router.replace('/home');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Iniciando sesión..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.stripes}>
            <View style={[styles.stripe, { backgroundColor: P.lavenderStrong }]} />
            <View style={[styles.stripe, { backgroundColor: P.peachStrong }]} />
            <View style={[styles.stripe, { backgroundColor: P.mintStrong }]} />
          </View>
          <Text style={styles.title}>Sistema Escolar</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {error && (
          <ErrorMessage 
            error={error} 
            onDismiss={clearError}
            onRetry={() => handleLogin()}
          />
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={P.inkMute}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={P.inkMute}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.linkText}>
              ¿No tienes cuenta? Regístrate
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
