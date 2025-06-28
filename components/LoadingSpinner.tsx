import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = Colors.primary,
  style,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

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
        return baseSize * 8; // 32dp or 64dp
      default:
        return baseSize * 6;
    }
  };

  const spinnerSize = getSize();

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <LinearGradient
          colors={[color, `${color}80`, 'transparent']}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: Colors.primary,
    borderRightColor: Colors.primary,
  },
});

export default LoadingSpinner;