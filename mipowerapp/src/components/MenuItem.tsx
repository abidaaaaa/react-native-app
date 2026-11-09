import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MONO, P } from '../constants/palette';
import { MenuItemProps } from '../interfaces/menu.interface';

export default function MenuItem({ title, icon, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: P.lavender,
    borderWidth: 2,
    borderColor: P.ink,
  },
  icon: { fontSize: 18 },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: P.ink,
  },
  arrow: {
    fontFamily: MONO,
    fontSize: 18,
    fontWeight: '700',
    color: P.lavenderDeep,
  },
});