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
import { G, S, T } from '../constants/design';
import { GlassBackground, GlassCard } from './glass';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const DOT_COLORS = [G.accent, G.accentEnd, G.violet, G.accent];

function Dot({ delay, color }: { delay: number; color: string }) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 420, easing: Easing.out(Easing.ease) }),
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
  return <Animated.View style={[styles.dot, { backgroundColor: color }, a]} />;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Cargando...',
  fullScreen = false,
}) => {
  const content = (
    <View style={styles.container}>
      <GlassCard style={styles.box}>
        <Dot delay={0} color={DOT_COLORS[0]} />
        <Dot delay={120} color={DOT_COLORS[1]} />
        <Dot delay={240} color={DOT_COLORS[2]} />
        <Dot delay={360} color={DOT_COLORS[3]} />
      </GlassCard>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );

  if (fullScreen) {
    return <GlassBackground style={styles.fullScreen}>{content}</GlassBackground>;
  }
  return content;
};

const styles = StyleSheet.create({
  container: {
    padding: S.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    justifyContent: 'center',
  },
  box: {
    width: 104,
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  message: {
    ...T.label,
    marginTop: S.lg,
    fontSize: 13,
    color: G.textSoft,
  },
});
