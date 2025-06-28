import { Tabs } from 'expo-router';
import { Chrome as Home, Search, MessageCircle, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import i18n from '@/utils/i18n';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.fullScreenContainer}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.borderLight,
            borderTopWidth: 1,
            paddingTop: isTablet ? 12 : 8,
            paddingBottom: Math.max(insets.bottom, isTablet ? 12 : 8),
            height: Math.max(60 + insets.bottom, isTablet ? 80 : 60),
            paddingHorizontal: isTablet ? 20 : 0,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: isTablet ? 14 : 12,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: isTablet ? 4 : 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: i18n.t('home'),
            tabBarIcon: ({ size, color }) => (
              <Home size={isTablet ? 28 : size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: i18n.t('jobs'),
            tabBarIcon: ({ size, color }) => (
              <Search size={isTablet ? 28 : size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: i18n.t('messages'),
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={isTablet ? 28 : size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: i18n.t('profile'),
            tabBarIcon: ({ size, color }) => (
              <User size={isTablet ? 28 : size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: Colors.background,
  },
});