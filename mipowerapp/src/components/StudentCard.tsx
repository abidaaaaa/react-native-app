import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BLOCK, MONO, P, TILES } from '../constants/palette';
import { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
}

const StudentCard = React.memo(({ student, onPress }: StudentCardProps) => {
  const tone = TILES[(Number(student.id) || 0) % TILES.length];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(student)}
      activeOpacity={0.8}
      accessible
      accessibilityLabel={`Estudiante ${student.nombre ?? ''} ${student.apellido ?? ''}`}
      accessibilityHint="Toca para ver los detalles del estudiante">
      <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
        <Text style={styles.avatarText}>
          {student.nombre ? student.nombre.charAt(0) : '?'}
          {student.apellido ? student.apellido.charAt(0) : '?'}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {student.nombre} {student.apellido}
        </Text>
        <Text style={styles.matricula}>✧ {student.matricula}</Text>
        <View style={styles.footer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.email} numberOfLines={1}>
            {student.email}
          </Text>
        </View>
      </View>

      <View style={styles.arrowCell}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
});

StudentCard.displayName = 'StudentCard';
export default StudentCard;

const styles = StyleSheet.create({
  card: {
    ...BLOCK,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: P.paper,
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderRightColor: P.ink,
  },
  avatarText: {
    fontFamily: MONO,
    fontSize: 22,
    fontWeight: '900',
    color: P.ink,
  },
  info: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '900',
    color: P.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  matricula: {
    fontFamily: MONO,
    fontSize: 12,
    color: P.lavenderDeep,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: P.lavenderSoft,
    borderStyle: 'dashed',
  },
  label: {
    fontFamily: MONO,
    fontSize: 10,
    fontWeight: '700',
    color: P.inkMute,
    marginRight: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  email: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 11,
    color: P.inkSoft,
  },
  arrowCell: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    experimental_backgroundImage: `linear-gradient(180deg, ${P.lavenderStrong}, ${P.roseStrong})`,
  },
  arrow: {
    color: P.ink,
    fontSize: 18,
    fontWeight: '900',
  },
});