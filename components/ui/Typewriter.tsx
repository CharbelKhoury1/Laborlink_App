import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  initialDelay?: number;
  waitTime?: number;
  deleteSpeed?: number;
  loop?: boolean;
  style?: any;
  showCursor?: boolean;
  hideCursorOnType?: boolean;
  cursorChar?: string;
  cursorStyle?: any;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  style,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = '|',
  cursorStyle,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Animation for cursor blinking
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  const texts = Array.isArray(text) ? text : [text];

  // Cursor blinking animation
  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (showCursor) {
      blinkAnimation.start();
    }

    return () => blinkAnimation.stop();
  }, [showCursor, cursorOpacity]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const currentText = texts[currentTextIndex];

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === '') {
          setIsDeleting(false);
          if (currentTextIndex === texts.length - 1 && !loop) {
            return;
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setCurrentIndex(0);
          timeout = setTimeout(() => {}, waitTime);
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, deleteSpeed);
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          }, speed);
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, waitTime);
        }
      }
    };

    // Apply initial delay only at the start
    if (currentIndex === 0 && !isDeleting && displayText === '') {
      timeout = setTimeout(startTyping, initialDelay);
    } else {
      startTyping();
    }

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    displayText,
    isDeleting,
    speed,
    deleteSpeed,
    waitTime,
    texts,
    currentTextIndex,
    loop,
    initialDelay,
  ]);

  const shouldShowCursor = showCursor && (!hideCursorOnType || 
    (currentIndex >= texts[currentTextIndex].length && !isDeleting));

  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]}>
        {displayText}
        {shouldShowCursor && (
          <Animated.Text
            style={[
              styles.cursor,
              cursorStyle,
              { opacity: cursorOpacity }
            ]}
          >
            {cursorChar}
          </Animated.Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  cursor: {
    fontSize: 16,
    color: '#000',
    marginLeft: 2,
  },
});

export { Typewriter };