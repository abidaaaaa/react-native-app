import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BLOCK, MONO, P } from '../constants/palette';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const DOT_COLORS = [P.lavenderStrong, P.roseStrong, P.yellowStrong, P.mintStrong];

function Dot({ delay, color }: { delay: number; color: string }) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: 420, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 420, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, []);
  const a = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));
  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color, shadowColor: color },
        a,
      ]}
    />
  );
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Cargando...',
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.box}>
        <Dot delay={0} color={DOT_COLORS[0]} />
        <Dot delay={120} color={DOT_COLORS[1]} />
        <Dot delay={240} color={DOT_COLORS[2]} />
        <Dot delay={360} color={DOT_COLORS[3]} />
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    experimental_backgroundImage: `linear-gradient(180deg, ${P.lavenderSoft}, ${P.roseSoft})`,
  },
  box: {
    ...BLOCK,
    width: 100,
    height: 100,
    backgroundColor: P.paper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  message: {
    marginTop: 22,
    fontFamily: MONO,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: P.ink,
  },
});