import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  Keyboard,
} from 'react-native';
import { G, S, T, glass } from '../constants/design';
import { Student, CreateStudentData } from '../types/student';
import { GlassButton } from './glass';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: CreateStudentData) => Promise<void>;
  onCancel: () => void;
}

export default function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const [nombre, setNombre] = useState(student?.nombre || '');
  const [apellido, setApellido] = useState(student?.apellido || '');
  const [matricula, setMatricula] = useState(student?.matricula || '');
  const [email, setEmail] = useState(student?.email || '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nombre.trim() || !apellido.trim() || !matricula.trim() || !email.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        matricula: matricula.trim(),
        email: email.trim(),
        password,
      });
      Keyboard.dismiss();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el estudiante');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * ERROR #18: Callback sin dependencias
   * Problema: resetForm era un useCallback sin dependencias que se usaba
   * como dependencia del useEffect.
   * Solución: la lógica de limpiar el formulario va directo dentro del
   * useEffect, y este solo depende de `student`.
   */
  useEffect(() => {
    if (!student) {
      setNombre('');
      setApellido('');
      setMatricula('');
      setEmail('');
      setPassword('');
    }
  }, [student]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{student ? 'Editar' : 'Nuevo'} estudiante</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor={G.textMute}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor={G.textMute}
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        placeholderTextColor={G.textMute}
        value={matricula}
        onChangeText={setMatricula}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={G.textMute}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={student ? 'Nueva contraseña (mín. 6)' : 'Contraseña (mín. 6)'}
        placeholderTextColor={G.textMute}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <View style={styles.buttons}>
        <GlassButton
          title="Cancelar"
          variant="secondary"
          onPress={onCancel}
          style={styles.button}
        />
        <GlassButton
          title={student ? 'Actualizar' : 'Crear'}
          onPress={handleSubmit}
          loading={submitting}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...glass.card,
    margin: S.lg,
    padding: S.xl,
    gap: S.md,
  },
  title: { ...T.title, fontSize: 22, lineHeight: 28, marginBottom: S.xs },
  input: { ...glass.input },
  buttons: {
    flexDirection: 'row',
    gap: S.md,
    marginTop: S.sm,
  },
  button: { flex: 1 },
});
