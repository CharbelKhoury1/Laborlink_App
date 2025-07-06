import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}