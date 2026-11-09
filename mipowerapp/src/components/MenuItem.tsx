import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { G, R, S, T, glass } from '../constants/design';
import { MenuItemProps } from '../interfaces/menu.interface';

export default function MenuItem({ title, icon, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...glass.row,
    marginBottom: S.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: R.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: G.accentSoft,
    borderWidth: 1,
    borderColor: G.borderSoft,
  },
  icon: { fontSize: 18 },
  title: {
    ...T.body,
    flex: 1,
    minWidth: 0,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 18,
    fontWeight: '700',
    color: G.accentEnd,
  },
});
