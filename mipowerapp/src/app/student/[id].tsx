/**
 * Pantalla de detalle de un estudiante.
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useApi } from '../../hooks/useApi';
import { studentService } from '../../services/studentService';
import { Student } from '../../types/student';
import { ErrorMessage, Loading } from '../../components';
import { BLOCK, MONO, P, TILES } from '../../constants/palette';

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
      <View style={styles.container}>
        <ErrorMessage error={error} onRetry={load} />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Estudiante no encontrado</Text>
      </View>
    );
  }

  const tone = TILES[(Number(student.id) || 0) % TILES.length];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `${student.nombre} ${student.apellido}` }} />

      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
          <Text style={styles.avatarText}>
            {student.nombre ? student.nombre.charAt(0) : '?'}
            {student.apellido ? student.apellido.charAt(0) : '?'}
          </Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.name}>
            {student.nombre} {student.apellido}
          </Text>
          <View style={styles.matriculaTag}>
            <Text style={styles.matricula}>Matrícula: {student.matricula}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Información de contacto</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.table}>
          <View style={styles.infoRow}>
            <View style={[styles.iconCell, styles.cellLavender]}><Text style={styles.icon}>📧</Text></View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{student.email}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <View style={[styles.iconCell, styles.cellPeach]}><Text style={styles.icon}>🆔</Text></View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>ID</Text>
              <Text style={styles.value}>{student.id}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Fechas</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.table}>
          <View style={styles.infoRow}>
            <View style={[styles.iconCell, styles.cellMint]}><Text style={styles.icon}>📅</Text></View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Creado</Text>
              <Text style={styles.value}>
                {formatDate(student.created_at ?? student.createdAt)}
              </Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <View style={[styles.iconCell, styles.cellRose]}><Text style={styles.icon}>🔄</Text></View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Actualizado</Text>
              <Text style={styles.value}>{formatDate(student.updated_at)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={deleting}
        >
          <Text style={styles.deleteText}>
            {deleting ? 'Eliminando...' : '🗑️ Eliminar estudiante'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: P.bg },
  content: { paddingBottom: 30 },
  emptyText: { textAlign: 'center', color: P.inkMute, fontFamily: MONO, fontSize: 14, marginTop: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: P.peach,
    borderBottomWidth: 3,
    borderBottomColor: P.ink,
  },
  avatar: {
    ...BLOCK,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: MONO, color: P.ink, fontSize: 32, fontWeight: '900' },
  headerCopy: { flex: 1 },
  name: { fontSize: 22, lineHeight: 26, fontWeight: '900', color: P.ink, textTransform: 'uppercase', marginBottom: 10 },
  matriculaTag: { alignSelf: 'flex-start', backgroundColor: P.paper, borderWidth: 2, borderColor: P.ink, paddingHorizontal: 10, paddingVertical: 4 },
  matricula: { fontFamily: MONO, fontSize: 12, fontWeight: '700', color: P.ink },
  section: { marginTop: 28, marginHorizontal: 20 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sectionTitle: { fontFamily: MONO, fontSize: 12, fontWeight: '700', letterSpacing: 2, color: P.ink, textTransform: 'uppercase' },
  sectionRule: { flex: 1, height: 3, backgroundColor: P.ink },
  table: { ...BLOCK, backgroundColor: P.paper },
  infoRow: { flexDirection: 'row', alignItems: 'stretch', borderBottomWidth: 2, borderBottomColor: P.ink },
  infoRowLast: { borderBottomWidth: 0 },
  iconCell: { width: 60, alignItems: 'center', justifyContent: 'center', borderRightWidth: 2, borderRightColor: P.ink },
  cellLavender: { backgroundColor: P.lavenderStrong },
  cellPeach: { backgroundColor: P.peachStrong },
  cellMint: { backgroundColor: P.mintStrong },
  cellRose: { backgroundColor: P.roseStrong },
  icon: { fontSize: 22 },
  infoContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 14 },
  label: { fontFamily: MONO, fontSize: 10, fontWeight: '700', color: P.inkMute, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 },
  value: { fontSize: 15, fontWeight: '800', color: P.ink },
  actions: { paddingHorizontal: 20, paddingTop: 30 },
  deleteButton: { ...BLOCK, backgroundColor: P.rose, paddingVertical: 16, alignItems: 'center' },
  deleteButtonDisabled: { opacity: 0.6 },
  deleteText: { fontSize: 13, color: P.roseInk, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' },
});
