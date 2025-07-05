import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
  showText?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = Colors.primary,
  style,
  showText = false,
  text = 'Loading...',
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Start spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue, fadeValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    const baseSize = isTablet ? 8 : 4;
    switch (size) {
      case 'small':
        return baseSize * 4; // 16dp or 32dp
      case 'medium':
        return baseSize * 6; // 24dp or 48dp
      case 'large':
        return baseSize * 10; // 40dp or 80dp
      default:
        return baseSize * 6;
    }
  };

  const spinnerSize = getSize();

  return (
    <Animated.View style={[styles.container, style, { opacity: fadeValue }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <LinearGradient
          colors={[color, `${color}80`, 'transparent', 'transparent']}
          style={[
            styles.gradient,
            {
              width: spinnerSize,
              height: spinnerSize,
              borderRadius: spinnerSize / 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      {showText && (
        <Text style={[styles.loadingText, { color }]}>{text}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  gradient: {
    position: 'absolute',
  },
  loadingText: {
    marginTop: 16,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingSpinner;