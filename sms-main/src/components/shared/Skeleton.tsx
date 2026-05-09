/**
 * Skeleton Component
 * 
 * Reusable skeleton loading component with animation.
 * Defined at module level for proper memoization.
 */
import React, { useEffect, useRef, memo } from 'react';
import { Animated, ViewStyle, StyleSheet } from 'react-native';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = memo(({
  width,
  height,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * FadeInView wraps content that replaces a skeleton loader,
 * fading it in smoothly to avoid a jarring swap.
 */
interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
}

const FadeInView: React.FC<FadeInViewProps> = memo(({ children, duration = 300 }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {children}
    </Animated.View>
  );
});

FadeInView.displayName = 'FadeInView';

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e2e8f0',
  },
});

export default Skeleton;
export { FadeInView };
