import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Colors from '@/constants/Colors';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Bold': Cairo_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  // Hide splash screen when everything is ready
  useEffect(() => {
    if (fontsLoaded || fontError) {
      console.log('✅ Hiding splash screen - Fonts loaded:', fontsLoaded);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.appTitle}>WorkConnect</Text>
          <Text style={styles.appSubtitle}>Lebanon</Text>
          <LoadingSpinner size="large" showText text="Loading fonts..." />
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.fullScreenContainer}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="typewriter-demo" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: Colors.background,
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
});