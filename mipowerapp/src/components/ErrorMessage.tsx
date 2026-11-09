import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BLOCK, P } from '../constants/palette';
import { ApiError, ErrorType } from '../types/errors';

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
  // ERROR #5 y #6: ref siempre actualizada para evitar stale closure.
  // Los hooks van ANTES del return condicional.
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

  // ERROR #4: mensaje calculado fuera del JSX
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
        <View style={styles.iconCell}>
          {/* ERROR #7 */}
          <Text
            style={styles.icon}
            accessibilityLabel={getIconLabel()}
            accessibilityRole="image"
          >
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
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          )}
          {onDismiss && (
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissText}>Cerrar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...BLOCK,
    backgroundColor: P.paper,
    margin: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  iconCell: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: P.roseStrong,
    borderRightWidth: 2,
    borderRightColor: P.ink,
  },
  icon: { fontSize: 26 },
  message: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    fontWeight: '700',
    color: P.ink,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: P.ink,
  },
  retryButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: P.mintStrong,
  },
  retryText: {
    color: P.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: P.lavender,
    borderLeftWidth: 2,
    borderLeftColor: P.ink,
  },
  dismissText: {
    color: P.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});