import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Keyboard,
} from 'react-native';
import { BLOCK, P } from '../constants/palette';
import { Student, CreateStudentData } from '../types/student';

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
      <View style={styles.topStripe} />
      <View style={styles.body}>
        <Text style={styles.title}>✿ {student ? 'Editar' : 'Nuevo'} estudiante</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor={P.inkMute}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor={P.inkMute}
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          placeholderTextColor={P.inkMute}
          value={matricula}
          onChangeText={setMatricula}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={P.inkMute}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={student ? 'Nueva contraseña (mín. 6)' : 'Contraseña (mín. 6)'}
          placeholderTextColor={P.inkMute}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}>
            <Text style={styles.submitText}>
              {student ? 'Actualizar' : 'Crear'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...BLOCK,
    backgroundColor: P.paper,
    margin: 16,
    overflow: 'hidden',
  },
  topStripe: {
    height: 14,
    experimental_backgroundImage: `linear-gradient(90deg, ${P.lavenderStrong}, ${P.roseStrong}, ${P.yellowStrong}, ${P.mintStrong})`,
    borderBottomWidth: 2,
    borderBottomColor: P.ink,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: P.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: P.lavenderStrong,
    borderRadius: 18,
    backgroundColor: P.lavenderSoft,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 15,
    color: P.ink,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: P.paper,
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 18,
    alignItems: 'center',
  },
  cancelText: {
    color: P.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: P.ink,
    alignItems: 'center',
    experimental_backgroundImage: `linear-gradient(135deg, ${P.mintStrong}, ${P.mint})`,
  },
  submitButtonDisabled: {
    backgroundColor: P.lavender,
    opacity: 0.6,
  },
  submitText: {
    color: P.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});