import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet, Text } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { P } from '@/constants/palette';
import { Spacing, MaxContentWidth } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabPressable, pressed && styles.pressed]}>
      <View
        style={[
          styles.tabPill,
          isFocused ? styles.tabPillFocused : styles.tabPillIdle,
        ]}>
        <Text
          style={[
            styles.tabLabel,
            { color: isFocused ? P.ink : P.inkSoft },
          ]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.floatingWrap} pointerEvents="box-none">
      <View style={styles.glowAura} pointerEvents="none" />
      
      <ThemedView type="backgroundElement" style={styles.pill}>
        <Text style={styles.brand}>✿ dreamy</Text>

        <View style={styles.triggers}>{props.children}</View>

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.docsPressable}>
            <Text style={styles.docsText}>Docs</Text>
            <SymbolView
              tintColor={P.ink}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrap: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    zIndex: 100,
  },
  glowAura: {
    position: 'absolute',
    width: '70%',
    maxWidth: 560,
    height: 60,
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(90deg, ${P.lavenderStrong}, ${P.roseStrong}, ${P.yellowStrong}, ${P.mintStrong})`,
    opacity: 0.35,
    filter: 'blur(18px)' as any,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: P.ink,
    experimental_backgroundImage: `linear-gradient(90deg, ${P.lavenderSoft}, ${P.roseSoft}, ${P.yellowSoft})`,
    shadowColor: P.lavenderStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
  },
  brand: {
    marginRight: 'auto',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    color: P.ink,
    textTransform: 'lowercase' as any,
  },
  triggers: {
    flexDirection: 'row',
    gap: 6,
  },
  tabPressable: {
    borderRadius: 999,
  },
  tabPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: P.ink,
  },
  tabPillIdle: {
    backgroundColor: P.paper,
  },
  tabPillFocused: {
    experimental_backgroundImage: `linear-gradient(135deg, ${P.lavenderStrong}, ${P.roseStrong})`,
    shadowColor: P.roseStrong,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  docsPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: P.mint,
    borderWidth: 2,
    borderColor: P.ink,
  },
  docsText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    color: P.ink,
    textTransform: 'uppercase',
  },
});