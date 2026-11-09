/**
 * Hook para manejar la lista de estudiantes contra `studentService`.
 * Mantiene la lista visible durante los refrescos y hace rollback si falla el borrado.
 */

import { useCallback, useEffect, useState } from 'react';
import { studentService } from '../services/studentService';
import { Student } from '../types/student';
import { ApiError } from '../types/errors';
import { handleApiError } from '../utils/errorHandler';

interface UseStudentsState {
  students: Student[];
  loading: boolean;
  error: ApiError | null;
}

export const useStudents = () => {
  const [state, setState] = useState<UseStudentsState>({
    students: [],
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const students = await studentService.getAll();
      setState({ students, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
    }
  }, []);

  /**
   * ERROR #19: Optimistic update sin rollback correcto
   * Problema: previousStudents capturaba la lista completa antes del
   * borrado, y con varios borrados seguidos el rollback podía restaurar
   * una lista desactualizada.
   * Solución: functional update; se guarda solo el estudiante eliminado
   * (deletedStudent) y en caso de error se restaura únicamente ese.
   */
  const deleteStudent = useCallback(async (id: number) => {
    let deletedStudent: Student | undefined;

    setState(prev => {
      deletedStudent = prev.students.find(student => student.id === id);
      return {
        ...prev,
        students: prev.students.filter(student => student.id !== id),
      };
    });

    try {
      await studentService.delete(id);
    } catch (error) {
      setState(prev => ({
        ...prev,
        students: deletedStudent ? [...prev.students, deletedStudent] : prev.students,
        error: handleApiError(error),
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
    deleteStudent,
  };
};