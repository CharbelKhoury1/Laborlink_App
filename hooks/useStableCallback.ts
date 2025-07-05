import { useCallback, useRef } from 'react';

/**
 * Creates a stable callback that doesn't change between renders
 * Useful for preventing unnecessary re-renders in child components
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(((...args: any[]) => {
    return callbackRef.current(...args);
  }) as T, []);
}