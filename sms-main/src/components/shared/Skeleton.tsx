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

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e2e8f0',
  },
});

export default Skeleton;
