import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Colors from '@/constants/Colors';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const router = useRouter();
  const [navigationReady, setNavigationReady] = useState(false);

  // Direct navigation to main app - no authentication required
  useEffect(() => {
    if (!navigationReady) {
      console.log('🔄 Direct navigation to main app');
      
      // Delay navigation to ensure UI is ready
      const navigationTimeout = setTimeout(() => {
        setNavigationReady(true);
        console.log('✅ Navigating directly to tabs');
        router.replace('/(tabs)');
      }, 300);

      return () => clearTimeout(navigationTimeout);
    }
  }, [router, navigationReady]);

  // Show loading while navigation is preparing
  if (!navigationReady) {
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.appTitle}>WorkConnect</Text>
          <Text style={styles.appSubtitle}>Lebanon</Text>
          <LoadingSpinner size="large" showText text="Loading..." />
        </View>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="typewriter-demo" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

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
        <AppNavigator />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
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