import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BLOCK, P } from '../constants/palette';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };
/**
 * ERROR #11: Memory leak en el reset del ErrorBoundary
 * Problema: handleReset llamaba a setState sin saber si el componente
 * seguía montado, y si se desmontaba al mismo tiempo se actualizaba
 * estado de un componente que ya no existe.
 * Solución: la bandera `mounted` (true en componentDidMount, false en
 * componentWillUnmount) y solo se resetea si sigue montado.
 */

  // ERROR #11: bandera para saber si el componente sigue montado
  private mounted = false;

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // ERROR #11
  public componentDidMount() {
    this.mounted = true;
  }

  // ERROR #11
  public componentWillUnmount() {
    this.mounted = false;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por boundary:', error, errorInfo);
  }

  // ERROR #11: solo resetea si sigue montado
  private handleReset = () => {
    if (this.mounted) {
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.emoji}>☁️</Text>
            <Text style={styles.title}>Algo salió mal</Text>
            <Text style={styles.message}>
              {this.state.error && this.state.error.message ? this.state.error.message : 'Error desconocido'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: P.bg,
  },
  card: {
    ...BLOCK,
    width: '100%',
    maxWidth: 420,
    padding: 28,
    backgroundColor: P.paper,
    alignItems: 'center',
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 12,
    color: P.ink,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: P.inkSoft,
    marginBottom: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: P.lavenderStrong,
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: P.lavenderStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: {
    color: P.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});