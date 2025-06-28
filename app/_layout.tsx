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
import { View, StyleSheet, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    if (initialized && !loading) {
      console.log('🔄 Navigation check - User:', user?.email, 'Type:', user?.userType, 'Initialized:', initialized); // Debug log
      
      if (user) {
        console.log('✅ Navigating to tabs with user:', user.userType); // Debug log
        router.replace('/(tabs)');
      } else {
        console.log('ℹ️ Navigating to auth - no user found'); // Debug log
        router.replace('/auth');
      }
    }
  }, [user, initialized, loading, router]);

  // Show loading spinner while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  // Show loading spinner while auth is initializing
  if (!initialized || loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});