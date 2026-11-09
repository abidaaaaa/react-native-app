import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AVATAR_TONES, G, R, S, T, glass } from '../constants/design';
import { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
}

const StudentCard = React.memo(({ student, onPress }: StudentCardProps) => {
  const tone = AVATAR_TONES[(Number(student.id) || 0) % AVATAR_TONES.length];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(student)}
      activeOpacity={0.8}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Estudiante ${student.nombre ?? ''} ${student.apellido ?? ''}`}
      accessibilityHint="Toca para ver los detalles del estudiante">
      <View style={[styles.avatar, { backgroundColor: tone }]}>
        <Text style={styles.avatarText}>
          {student.nombre ? student.nombre.charAt(0) : '?'}
          {student.apellido ? student.apellido.charAt(0) : '?'}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {student.nombre} {student.apellido}
        </Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{student.matricula}</Text>
        </View>
        <Text style={styles.email} numberOfLines={1}>
          {student.email}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
});

StudentCard.displayName = 'StudentCard';
export default StudentCard;

const styles = StyleSheet.create({
  card: {
    ...glass.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: S.md,
    gap: S.md,
    marginBottom: S.md,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: G.border,
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: G.text },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  name: { ...T.heading, fontSize: 16, lineHeight: 21 },
  chip: { ...glass.chip },
  chipText: { fontSize: 12, fontWeight: '700', color: G.accent },
  email: { ...T.caption },
  arrow: {
    fontSize: 28,
    lineHeight: 30,
    color: G.textMute,
    paddingRight: S.xs,
  },
});
