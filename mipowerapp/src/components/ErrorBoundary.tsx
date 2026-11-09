import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { S, T } from '../constants/design';
import { GlassBackground, GlassButton, GlassCard } from './glass';

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
   * Solución: la bandera `isMounted` (true en componentDidMount, false en
   * componentWillUnmount) y solo se resetea si sigue montado.
   */
  private isMounted: boolean = false;

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidMount() {
    this.isMounted = true;
  }

  public componentWillUnmount() {
    this.isMounted = false;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por boundary:', error, errorInfo);
  }

  private handleReset = () => {
    if (this.isMounted) {
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <GlassBackground style={styles.center}>
          <GlassCard style={styles.card}>
            <Text style={styles.emoji}>☁️</Text>
            <Text style={styles.title}>Algo salió mal</Text>
            <Text style={styles.message}>
              {this.state.error && this.state.error.message ? this.state.error.message : 'Error desconocido'}
            </Text>
            <View style={styles.actions}>
              <GlassButton title="Intentar de nuevo" onPress={this.handleReset} />
            </View>
          </GlassCard>
        </GlassBackground>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    padding: S.xl,
  },
  card: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.md,
  },
  emoji: { fontSize: 44 },
  title: { ...T.title, fontSize: 24, textAlign: 'center' },
  message: { ...T.body, textAlign: 'center', color: T.caption.color },
  actions: { alignSelf: 'stretch', marginTop: S.sm },
});
