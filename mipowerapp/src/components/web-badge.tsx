import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme, StyleSheet, View, Text } from 'react-native';

import { Spacing } from '@/constants/theme';
import { P } from '@/constants/palette';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.versionText}>✿ v{version}</Text>
      </View>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    backgroundColor: P.lavenderSoft,
    borderWidth: 2,
    borderColor: P.ink,
    borderRadius: 999,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
    color: P.ink,
    letterSpacing: 1,
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});