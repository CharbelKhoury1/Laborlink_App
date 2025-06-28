import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Typewriter } from './Typewriter';
import Colors from '@/constants/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeDevice = screenWidth >= 414;
const isSmallDevice = screenWidth < 375;

const TypewriterDemo: React.FC = () => {
  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.content}>
        <Text style={styles.staticText}>We're born 🌞 to </Text>
        <Typewriter
          text={[
            'experience',
            'dance',
            'love',
            'be alive',
            'create things that make the world a better place',
          ]}
          speed={70}
          style={styles.typewriterText}
          waitTime={1500}
          deleteSpeed={40}
          cursorChar="_"
          cursorStyle={styles.cursor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: Colors.background,
    paddingHorizontal: isTablet ? 64 : isLargeDevice ? 32 : 16,
    paddingTop: isTablet ? 120 : isLargeDevice ? 80 : 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
  staticText: {
    fontSize: isTablet ? 48 : isLargeDevice ? 32 : isSmallDevice ? 24 : 28,
    fontWeight: '400',
    color: Colors.text,
    lineHeight: isTablet ? 56 : isLargeDevice ? 40 : isSmallDevice ? 32 : 36,
  },
  typewriterText: {
    fontSize: isTablet ? 48 : isLargeDevice ? 32 : isSmallDevice ? 24 : 28,
    fontWeight: '400',
    color: Colors.secondary,
    lineHeight: isTablet ? 56 : isLargeDevice ? 40 : isSmallDevice ? 32 : 36,
  },
  cursor: {
    fontSize: isTablet ? 48 : isLargeDevice ? 32 : isSmallDevice ? 24 : 28,
    color: Colors.secondary,
    fontWeight: '400',
  },
});

export { TypewriterDemo };