import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

interface AnimationConfig {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  headerAnim: Animated.Value;
  statsAnim: Animated.Value;
  jobsAnim: Animated.Value;
}

export function useAnimationSequence() {
  const animations = useRef<AnimationConfig>({
    fadeAnim: new Animated.Value(0),
    slideAnim: new Animated.Value(50),
    scaleAnim: new Animated.Value(0.95),
    headerAnim: new Animated.Value(0),
    statsAnim: new Animated.Value(0),
    jobsAnim: new Animated.Value(0),
  }).current;

  const startEntranceAnimation = useCallback(() => {
    // Reset all animations
    Object.values(animations).forEach(anim => {
      if (anim === animations.slideAnim) {
        anim.setValue(50);
      } else if (anim === animations.scaleAnim) {
        anim.setValue(0.95);
      } else {
        anim.setValue(0);
      }
    });

    // Start sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(animations.fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animations.slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animations.scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(200, [
        Animated.timing(animations.headerAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animations.statsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animations.jobsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [animations]);

  return {
    animations,
    startEntranceAnimation,
  };
}