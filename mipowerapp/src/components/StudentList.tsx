/**
 * Lista de estudiantes con búsqueda local.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text, RefreshControl } from 'react-native';
import StudentCard from './StudentCard';
import { G, R, S, T, glass } from '../constants/design';
import { Student } from '../types/student';

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function StudentList({
  students,
  onStudentPress,
  onRefresh,
  refreshing = false,
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;

    return students.filter(student =>
      (student.nombre ?? '').toLowerCase().includes(query) ||
      (student.apellido ?? '').toLowerCase().includes(query) ||
      (student.matricula ?? '').toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const renderStudent = useCallback(
    ({ item }: { item: Student }) => (
      <StudentCard student={item} onPress={onStudentPress} />
    ),
    [onStudentPress]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, apellido o matrícula"
          placeholderTextColor={G.textMute}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Buscar estudiante"
        />
      </View>
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // ERROR #16: pull-to-refresh con RefreshControl
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[G.accent]}
              tintColor={G.accent}
            />
          ) : undefined
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron estudiantes</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    ...glass.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: S.lg,
    marginTop: S.xs,
    paddingHorizontal: S.lg,
    borderRadius: R.lg,
    gap: S.sm,
  },
  searchIcon: {
    fontSize: 22,
    color: G.accent,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: G.text,
    fontSize: 15,
  },
  listContent: {
    padding: S.lg,
    paddingTop: S.lg,
    paddingBottom: S.xxl,
  },
  emptyText: {
    ...T.caption,
    textAlign: 'center',
    marginTop: S.xxl,
  },
});
