import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import LanguageSelector from '@/components/LanguageSelector';
import i18n from '@/utils/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

// Responsive dimensions
const getResponsiveDimensions = () => {
  const padding = isTablet ? 40 : isLargeDevice ? 24 : 20;
  const cardPadding = isTablet ? 32 : 24;
  const fontSize = {
    logo: isTablet ? 48 : isLargeDevice ? 36 : isSmallDevice ? 28 : 32,
    subtitle: isTablet ? 24 : isLargeDevice ? 18 : 16,
    body: isTablet ? 20 : isLargeDevice ? 16 : 14,
    title: isTablet ? 28 : isLargeDevice ? 20 : 18,
    small: isTablet ? 16 : 14,
  };
  
  return { padding, cardPadding, fontSize };
};

export default function AuthIndex() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleUserTypeSelect = (userType: 'worker' | 'client') => {
    router.push(`/auth/register?userType=${userType}`);
  };

  const responsiveDimensions = getResponsiveDimensions();
  const styles = createStyles(responsiveDimensions, dimensions, insets);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>WorkConnect</Text>
              <Text style={styles.logoSubtitle}>Lebanon</Text>
            </View>

            <Text style={styles.tagline}>
              {language === 'en' 
                ? 'Connecting Lebanese workers with local opportunities'
                : 'ربط العمال اللبنانيين بالفرص المحلية'
              }
            </Text>

            <View style={styles.userTypeContainer}>
              <Text style={styles.selectTitle}>
                {i18n.t('selectUserType')}
              </Text>

              <TouchableOpacity
                style={styles.userTypeCard}
                onPress={() => handleUserTypeSelect('worker')}
              >
                <Users size={isTablet ? 64 : isLargeDevice ? 48 : 40} color={Colors.primary} />
                <Text style={styles.userTypeTitle}>
                  {i18n.t('worker')}
                </Text>
                <Text style={styles.userTypeDescription}>
                  {i18n.t('workerDescription')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.userTypeCard}
                onPress={() => handleUserTypeSelect('client')}
              >
                <Briefcase size={isTablet ? 64 : isLargeDevice ? 48 : 40} color={Colors.primary} />
                <Text style={styles.userTypeTitle}>
                  {i18n.t('client')}
                </Text>
                <Text style={styles.userTypeDescription}>
                  {i18n.t('clientDescription')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginText}>
                {language === 'en' 
                  ? 'Already have an account? Login'
                  : 'لديك حساب بالفعل؟ تسجيل الدخول'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const createStyles = (responsiveDimensions: any, dimensions: any, insets: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: dimensions.height,
    paddingTop: insets.top,
    paddingBottom: Math.max(insets.bottom, 20),
  },
  header: {
    alignItems: 'flex-end',
    padding: responsiveDimensions.padding,
    paddingTop: isTablet ? 40 : 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveDimensions.padding,
    paddingBottom: isTablet ? 60 : 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: isTablet ? 40 : 30,
  },
  logo: {
    fontSize: responsiveDimensions.fontSize.logo,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: isTablet ? 12 : 8,
  },
  logoSubtitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  tagline: {
    fontSize: responsiveDimensions.fontSize.body,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: isTablet ? 60 : 40,
    opacity: 0.9,
    lineHeight: isTablet ? 32 : 24,
    paddingHorizontal: isTablet ? 40 : 0,
  },
  userTypeContainer: {
    marginBottom: isTablet ? 50 : 30,
  },
  selectTitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: isTablet ? 40 : 30,
    fontWeight: '600',
  },
  userTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: isTablet ? 24 : 16,
    padding: responsiveDimensions.cardPadding,
    alignItems: 'center',
    marginBottom: isTablet ? 24 : 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: isTablet ? 180 : isLargeDevice ? 140 : 120,
    justifyContent: 'center',
  },
  userTypeTitle: {
    fontSize: responsiveDimensions.fontSize.title,
    fontWeight: '600',
    color: Colors.text,
    marginTop: isTablet ? 20 : 12,
    marginBottom: isTablet ? 12 : 8,
  },
  userTypeDescription: {
    fontSize: responsiveDimensions.fontSize.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
    paddingHorizontal: isTablet ? 20 : 0,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: isTablet ? 40 : 30,
  },
  loginText: {
    fontSize: responsiveDimensions.fontSize.small,
    color: Colors.white,
    textDecorationLine: 'underline',
  },
});