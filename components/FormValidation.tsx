import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ValidationRule {
  id: string;
  label: string;
  isValid: boolean;
  type: 'required' | 'format' | 'length' | 'custom';
}

interface FormValidationProps {
  rules: ValidationRule[];
  showOnlyErrors?: boolean;
  style?: any;
}

export default function FormValidation({ 
  rules, 
  showOnlyErrors = false, 
  style 
}: FormValidationProps) {
  const visibleRules = showOnlyErrors ? rules.filter(rule => !rule.isValid) : rules;

  if (visibleRules.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {visibleRules.map((rule) => (
        <View key={rule.id} style={styles.ruleItem}>
          {rule.isValid ? (
            <CheckCircle size={16} color={Colors.success} />
          ) : (
            <AlertCircle size={16} color={Colors.error} />
          )}
          <Text style={[
            styles.ruleText,
            rule.isValid ? styles.validText : styles.invalidText
          ]}>
            {rule.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  ruleText: {
    fontSize: 12,
    flex: 1,
  },
  validText: {
    color: Colors.success,
  },
  invalidText: {
    color: Colors.error,
  },
});

// Validation utility functions
export const createValidationRules = {
  required: (value: string, label: string): ValidationRule => ({
    id: `required-${label}`,
    label: `${label} is required`,
    isValid: value.trim().length > 0,
    type: 'required'
  }),

  minLength: (value: string, minLength: number, label: string): ValidationRule => ({
    id: `minLength-${label}`,
    label: `${label} must be at least ${minLength} characters`,
    isValid: value.length >= minLength,
    type: 'length'
  }),

  maxLength: (value: string, maxLength: number, label: string): ValidationRule => ({
    id: `maxLength-${label}`,
    label: `${label} must not exceed ${maxLength} characters`,
    isValid: value.length <= maxLength,
    type: 'length'
  }),

  email: (value: string): ValidationRule => ({
    id: 'email-format',
    label: 'Must be a valid email address',
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    type: 'format'
  }),

  phone: (value: string, country: string = 'lebanon'): ValidationRule => {
    const phoneRegex = country === 'lebanon' 
      ? /^\+961\s?\d{2}\s?\d{3}\s?\d{3}$/
      : /^\+\d{1,3}\s?\d{6,14}$/;
    
    return {
      id: 'phone-format',
      label: 'Must be a valid phone number',
      isValid: phoneRegex.test(value.replace(/\s/g, '')),
      type: 'format'
    };
  },

  custom: (value: string, validator: (val: string) => boolean, label: string): ValidationRule => ({
    id: `custom-${label}`,
    label,
    isValid: validator(value),
    type: 'custom'
  })
};