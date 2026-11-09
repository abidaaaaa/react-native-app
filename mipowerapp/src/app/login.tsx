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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
                <ErrorMessage 
                  error={error} 
                  onDismiss={clearError}
                  onRetry={() => handleLogin()}
                />
              </View>
            )}

            <GlassCard style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>Sistema Escolar</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={G.textMute}
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
                  placeholderTextColor={G.textMute}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <GlassButton
                title="Iniciar Sesión"
                onPress={handleLogin}
                disabled={loading}
                style={styles.button}
              />

              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.linkText}>
                  ¿No tienes cuenta? Regístrate
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
    maxWidth: 480,
    alignSelf: 'center',
    gap: S.lg,
  },
  // ErrorMessage trae su propio margen; se compensa para que quede alineado con la tarjeta
  errorWrap: { marginHorizontal: -S.lg, marginVertical: -S.lg },
  card: { padding: S.xl, gap: S.lg },
  header: { gap: S.xs },
  title: { ...T.title },
  subtitle: { ...T.caption, fontSize: 15 },
  inputContainer: { gap: 6 },
  label: { ...T.label },
  input: { ...glass.input },
  button: { marginTop: S.sm },
  linkButton: { alignItems: 'center', paddingVertical: S.md },
  linkText: { color: G.accent, fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
