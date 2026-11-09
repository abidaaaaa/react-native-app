import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { G, R, S, T, glass } from '../constants/design';
import { ApiError, ErrorType } from '../types/errors';
import { GlassButton } from './glass';

interface ErrorMessageProps {
  error: ApiError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  /**
   * ERROR #5 y #6: Stale closure y dependencias de hooks
   * onRetryRef siempre guarda la última versión de onRetry, y handleRetry
   * (useCallback sin dependencias) la lee desde la ref.
   * Los hooks van ANTES del return condicional.
   */
  const onRetryRef = useRef(onRetry);

  useEffect(() => {
    onRetryRef.current = onRetry;
  }, [onRetry]);

  const handleRetry = useCallback(() => {
    if (onRetryRef.current) {
      Alert.alert('Reintentar', '¿Seguro que deseas intentar de nuevo?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: () => onRetryRef.current && onRetryRef.current() },
      ]);
    }
  }, []);

  if (!error) return null;

  // ERROR #4: mensaje validado fuera del JSX
  const message = error.message ? error.message : 'Error desconocido';

  const getIcon = () => {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR: return '🔌';
      case ErrorType.UNAUTHORIZED: return '🔐';
      case ErrorType.VALIDATION_ERROR: return '⚠️';
      case ErrorType.SERVER_ERROR: return '🖥️';
      default: return '☁️';
    }
  };

  // ERROR #7: texto alternativo para lectores de pantalla
  const getIconLabel = () => {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR: return 'Error de red';
      case ErrorType.UNAUTHORIZED: return 'No autorizado';
      case ErrorType.VALIDATION_ERROR: return 'Advertencia';
      case ErrorType.SERVER_ERROR: return 'Error del servidor';
      default: return 'Error';
    }
  };

  const canRetry =
    error.type === ErrorType.NETWORK_ERROR || error.type === ErrorType.TIMEOUT;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconChip}>
          {/* ERROR #7 */}
          <Text
            style={styles.icon}
            accessibilityLabel={getIconLabel()}
            accessibilityRole="image">
            {getIcon()}
          </Text>
        </View>
        {/* ERROR #4 */}
        <Text style={styles.message}>{message}</Text>
      </View>

      {((canRetry && onRetry) || onDismiss) && (
        <View style={styles.actions}>
          {canRetry && onRetry && (
            // ERROR #5 y #6: usa handleRetry en lugar de onRetry directo
            <GlassButton title="Reintentar" onPress={handleRetry} style={styles.action} />
          )}
          {onDismiss && (
            <GlassButton
              title="Cerrar"
              variant="secondary"
              onPress={onDismiss}
              style={styles.action}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...glass.card,
    margin: S.lg,
    padding: S.lg,
    gap: S.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: G.dangerSoft,
  },
  icon: { fontSize: 24 },
  message: {
    ...T.body,
    flex: 1,
    flexShrink: 1,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: S.md,
  },
  action: { flex: 1 },
});
