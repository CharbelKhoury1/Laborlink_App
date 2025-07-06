import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthState } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Alert, Dimensions, Text } from 'react-native';
import Colors from '@/constants/Colors';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const router = useRouter();
  const { user, initialized, loading, error, clearError } = useAuthState();
  const [navigationReady, setNavigationReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Bold': Cairo_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  // Hide splash screen when everything is ready
  useEffect(() => {
    if ((fontsLoaded || fontError) && initialized) {
      console.log('✅ Hiding splash screen - Fonts loaded:', fontsLoaded, 'Auth initialized:', initialized);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, initialized]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Authentication Error',
        error,
        [
          { text: 'OK', onPress: clearError }
        ]
      );
    }
  }, [error, clearError]);

  // Navigation logic - production mode
  useEffect(() => {
    if (initialized && !loading && (fontsLoaded || fontError) && !navigationReady) {
      console.log('🔄 Navigation check - User:', user?.email, 'Type:', user?.userType, 'Initialized:', initialized);
      
      // Delay navigation to ensure UI is ready
      const navigationTimeout = setTimeout(() => {
        setNavigationReady(true);
        
        if (user) {
          console.log('✅ Navigating to tabs with user:', user.userType);
          router.replace('/(tabs)');
        } else {
          console.log('ℹ️ Navigating to auth - no user found');
          router.replace('/auth');
        }
      }, 300);

      return () => clearTimeout(navigationTimeout);
    }
  }, [user, initialized, loading, router, fontsLoaded, fontError, navigationReady]);

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

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.appTitle}>WorkConnect</Text>
          <Text style={styles.appSubtitle}>Lebanon</Text>
          <LoadingSpinner size="large" showText text="Initializing..." />
        </View>
      </View>
    );
  }

  // Show loading while navigation is preparing
  if (!navigationReady) {
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.appTitle}>WorkConnect</Text>
          <Text style={styles.appSubtitle}>Lebanon</Text>
          <LoadingSpinner size="large" showText text="Preparing..." />
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.fullScreenContainer}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
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