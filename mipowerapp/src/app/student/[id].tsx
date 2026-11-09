/**
 * Pantalla de detalle de un estudiante.
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useApi } from '../../hooks/useApi';
import { studentService } from '../../services/studentService';
import { Student } from '../../types/student';
import { ErrorMessage, Loading } from '../../components';
import { GlassBackground, GlassButton, GlassCard } from '../../components/glass';
import { AVATAR_TONES, G, R, S, T, glass } from '../../constants/design';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: string;
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowDivider]}>
      <View style={styles.iconChip}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const studentId = Number(id);

  const {
    data: student,
    loading,
    error,
    execute: loadStudent,
  } = useApi<Student>();

  const { execute: executeDelete, loading: deleting } = useApi<void>();

  const load = useCallback(() => {
    loadStudent(() => studentService.getById(studentId));
  }, [loadStudent, studentId]);

  useEffect(() => {
    load();
  }, [load]);

  const deleteStudent = useCallback(async () => {
    const result = await executeDelete(() => studentService.delete(studentId));
    if (result !== null) {
      // Si se entró directo por URL no hay historial al que regresar.
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/students');
      }
    } else {
      Alert.alert('Error', 'No se pudo eliminar el estudiante');
    }
  }, [executeDelete, router, studentId]);

  const handleDelete = () => {
    // En web `Alert.alert` es un no-op, así que se usa el confirm nativo.
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' &&
        window.confirm('¿Estás seguro que deseas eliminar este estudiante?')) {
        deleteStudent();
      }
      return;
    }

    Alert.alert(
      'Eliminar estudiante',
      '¿Estás seguro que deseas eliminar este estudiante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: deleteStudent,
        },
      ]
    );
  };

  if (loading) {
    return <Loading message="Cargando estudiante..." fullScreen />;
  }

  if (error) {
    return (
      <GlassBackground>
        <ErrorMessage error={error} onRetry={load} />
      </GlassBackground>
    );
  }

  if (!student) {
    return (
      <GlassBackground>
        <Text style={styles.emptyText}>Estudiante no encontrado</Text>
      </GlassBackground>
    );
  }

  const tone = AVATAR_TONES[(Number(student.id) || 0) % AVATAR_TONES.length];

  return (
    <GlassBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: `${student.nombre} ${student.apellido}` }} />

        <GlassCard style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: tone }]}>
            <Text style={styles.avatarText}>
              {student.nombre ? student.nombre.charAt(0) : '?'}
              {student.apellido ? student.apellido.charAt(0) : '?'}
            </Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.name}>
              {student.nombre} {student.apellido}
            </Text>
            <View style={glass.chip}>
              <Text style={styles.matricula}>Matrícula: {student.matricula}</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Información de contacto</Text>
        <GlassCard>
          <InfoRow icon="📧" label="Email" value={student.email} />
          <InfoRow icon="🆔" label="ID" value={student.id} last />
        </GlassCard>

        <Text style={styles.sectionTitle}>Fechas</Text>
        <GlassCard>
          <InfoRow
            icon="📅"
            label="Creado"
            value={formatDate(student.created_at ?? student.createdAt)}
          />
          <InfoRow
            icon="🔄"
            label="Actualizado"
            value={formatDate(student.updated_at)}
            last
          />
        </GlassCard>

        <GlassButton
          title={deleting ? 'Eliminando...' : 'Eliminar estudiante'}
          variant="danger"
          onPress={handleDelete}
          disabled={deleting}
          style={styles.deleteButton}
        />
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: S.lg,
    paddingBottom: S.xxl,
    gap: S.md,
  },
  emptyText: { ...T.caption, textAlign: 'center', marginTop: S.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.lg,
    padding: S.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: R.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: G.border,
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: G.text },
  headerCopy: { flex: 1, minWidth: 0, gap: S.sm },
  name: { ...T.title, fontSize: 22, lineHeight: 28 },
  matricula: { fontSize: 12, fontWeight: '700', color: G.accent },
  sectionTitle: { ...T.label, marginTop: S.md, marginLeft: S.xs },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    padding: S.md,
  },
  infoRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: G.divider,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: R.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: G.accentSoft,
  },
  icon: { fontSize: 20 },
  infoContent: { flex: 1, minWidth: 0, gap: 2 },
  label: { ...T.label, fontSize: 11 },
  value: { ...T.body, fontWeight: '700' },
  deleteButton: { marginTop: S.lg },
});
