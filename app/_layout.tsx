import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthState } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
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

  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Bold': Cairo_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

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

  useEffect(() => {
    if (initialized && !loading && (fontsLoaded || fontError)) {
      console.log('🔄 Navigation check - User:', user?.email, 'Type:', user?.userType, 'Initialized:', initialized);
      
      if (user) {
        console.log('✅ Navigating to tabs with user:', user.userType);
        router.replace('/(tabs)');
      } else {
        console.log('ℹ️ Navigating to auth - no user found');
        router.replace('/auth');
      }
    }
  }, [user, initialized, loading, router, fontsLoaded, fontError]);

  // Show loading spinner while fonts are loading or auth is initializing
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.fullScreenContainer}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  if (!initialized || loading) {
    return (
      <View style={styles.fullScreenContainer}>
        <LoadingSpinner size="large" />
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
});