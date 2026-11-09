/**
 * Lista de estudiantes con búsqueda local.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text, RefreshControl } from 'react-native';
import StudentCard from './StudentCard';
import { MONO, P } from '../constants/palette';
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
        <View style={styles.searchCell}>
          <Text style={styles.searchIcon}>⌕</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, apellido o matrícula..."
          placeholderTextColor={P.inkMute}
          value={searchQuery}
          onChangeText={setSearchQuery}
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
              colors={[P.lavenderStrong]}
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
    backgroundColor: P.bg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: P.paper,
    marginHorizontal: 16,
    marginTop: 4,
    borderWidth: 2,
    borderColor: P.ink,
  },
  searchCell: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: P.lavenderStrong,
    borderRightWidth: 2,
    borderRightColor: P.ink,
  },
  searchIcon: {
    fontSize: 24,
    color: P.ink,
    fontWeight: '900',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    color: P.ink,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: P.inkMute,
    fontFamily: MONO,
    fontSize: 14,
    marginTop: 40,
  },
});