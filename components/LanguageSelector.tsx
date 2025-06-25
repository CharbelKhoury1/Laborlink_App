import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import i18n from '@/utils/i18n';

interface LanguageSelectorProps {
  onLanguageChange: (language: 'en' | 'ar') => void;
  currentLanguage: 'en' | 'ar';
}

export default function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    i18n.locale = newLanguage;
    onLanguageChange(newLanguage);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
      <Globe size={20} color={Colors.primary} />
      <Text style={styles.languageText}>
        {currentLanguage === 'en' ? 'العربية' : 'English'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});