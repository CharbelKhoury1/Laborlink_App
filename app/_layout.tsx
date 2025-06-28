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
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function RootLayout() {
  useFrameworkReady();
  
  const router = useRouter();
  const { user, initialized, loading } = useAuthState();

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
    if (initialized && !loading) {
      console.log('Navigation check - User:', user, 'Initialized:', initialized); // Debug log
      if (user) {
        console.log('Navigating to tabs with user:', user.userType); // Debug log
        router.replace('/(tabs)');
      } else {
        console.log('Navigating to auth'); // Debug log
        router.replace('/auth');
      }
    }
  }, [user, initialized, loading]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="typewriter-demo" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});