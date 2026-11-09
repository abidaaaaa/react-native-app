/**
 * Pantalla de lista de estudiantes.
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StudentList from '../components/StudentList';
import { ErrorMessage, Loading } from '../components';
import { P } from '../constants/palette';
import { useStudents } from '../hooks/useStudents';
import { Student } from '../types/student';

export default function StudentsScreen() {
  const router = useRouter();
  const { students, loading, error, refresh } = useStudents();

  /**
   * ERROR #16: Estado sin usar (refreshing)
   * Problema: refreshing y onRefresh se definían pero nunca se usaban,
   * porque faltaba el RefreshControl en la lista.
   * Solución: se pasan onRefresh y refreshing a StudentList, que los
   * conecta al RefreshControl del FlatList (pull-to-refresh).
   */
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleStudentPress = useCallback((student: Student) => {
    router.push({
      pathname: '/student/[id]',
      params: { id: student.id },
    });
  }, [router]);

  if (loading && students.length === 0 && !refreshing) {
    return <Loading message="Cargando estudiantes..." fullScreen />;
  }

  if (error && students.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StudentList
        students={students}
        onStudentPress={handleStudentPress}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: P.bg,
  },
});