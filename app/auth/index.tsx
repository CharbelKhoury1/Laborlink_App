import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import LanguageSelector from '@/components/LanguageSelector';
import i18n from '@/utils/i18n';

export default function AuthIndex() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const handleUserTypeSelect = (userType: 'worker' | 'client') => {
    router.push(`/auth/register?userType=${userType}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <Users size={48} color={Colors.primary} />
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
                <Briefcase size={48} color={Colors.primary} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'flex-end',
    padding: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  logoSubtitle: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
    lineHeight: 24,
  },
  userTypeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  selectTitle: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  userTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  userTypeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  userTypeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.white,
    textDecorationLine: 'underline',
  },
});