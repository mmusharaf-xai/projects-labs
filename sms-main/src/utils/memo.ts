/**
 * Memoization utilities for React components
 * 
 * Provides helpers for optimizing component re-renders.
 */
import { memo, ComponentType } from 'react';

/**
 * Creates a memoized component with custom comparison function.
 * 
 * @example
 * const MyComponent = memoWithProps(MyComponent, (prev, next) => {
 *   return prev.id === next.id && prev.name === next.name;
 * });
 */
export function memoWithProps<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
  return memo(Component, propsAreEqual);
}

/**
 * Shallow comparison for props - useful for simple objects.
 * Compares only the first level of properties.
 */
export function shallowEqual<P extends object>(
  prevProps: P,
  nextProps: P
): boolean {
  const prevKeys = Object.keys(prevProps) as (keyof P)[];
  const nextKeys = Object.keys(nextProps) as (keyof P)[];
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Creates a stable callback reference that can be used in dependency arrays.
 * Useful for callbacks passed to child components.
 */
export function createStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  let currentCallback = callback;
  
  const stableCallback = ((...args: Parameters<T>) => {
    return currentCallback(...args);
  }) as T;
  
  return stableCallback;
}
