import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, User, Mail, Phone, Lock, Users, Briefcase, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useAuthState } from '@/hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'worker' | 'client';
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUp() {
  const router = useRouter();
  const { register, loading } = useAuthState();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'worker',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^(\+961|961)?[0-9]{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid Lebanese phone number';
        }
        return undefined;
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        return undefined;
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    
    // Special case for confirm password when password changes
    if (field === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleFieldBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
      if (field !== 'userType') {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field as keyof ValidationErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    const success = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      userType: formData.userType,
    });

    if (success) {
      Alert.alert(
        'Welcome to WorkConnect!',
        'Your account has been created successfully.',
        [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
      );
    }
  };

  const InputField = ({ 
    field, 
    placeholder, 
    icon: Icon, 
    secureTextEntry = false,
    keyboardType = 'default',
    showToggle = false 
  }: {
    field: keyof FormData;
    placeholder: string;
    icon: any;
    secureTextEntry?: boolean;
    keyboardType?: any;
    showToggle?: boolean;
  }) => (
    <Animated.View 
      entering={FadeInDown.delay(200).duration(600)}
      style={styles.inputContainer}
    >
      <Text style={styles.label}>{placeholder}</Text>
      <View style={[
        styles.inputWrapper,
        errors[field as keyof ValidationErrors] && touched[field] && styles.inputError
      ]}>
        <Icon size={20} color={
          errors[field as keyof ValidationErrors] && touched[field] 
            ? Colors.error 
            : Colors.textSecondary
        } />
        <TextInput
          style={styles.input}
          value={formData[field]}
          onChangeText={(value) => handleFieldChange(field, value)}
          onBlur={() => handleFieldBlur(field)}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          autoComplete={field === 'email' ? 'email' : field === 'password' ? 'password' : 'off'}
        />
        {showToggle && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
          >
            {(field === 'password' ? showPassword : showConfirmPassword) ? (
              <EyeOff size={20} color={Colors.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {errors[field as keyof ValidationErrors] && touched[field] && (
        <Text style={styles.errorText}>{errors[field as keyof ValidationErrors]}</Text>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          entering={FadeInUp.delay(100).duration(800)}
          style={styles.welcomeSection}
        >
          <Text style={styles.welcomeTitle}>Join WorkConnect</Text>
          <Text style={styles.welcomeSubtitle}>
            Connect with opportunities across Lebanon
          </Text>
        </Animated.View>

        {/* User Type Selection */}
        <Animated.View 
          entering={FadeInDown.delay(150).duration(600)}
          style={styles.userTypeSection}
        >
          <Text style={styles.sectionTitle}>I am a</Text>
          <View style={styles.userTypeButtons}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                formData.userType === 'worker' && styles.userTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, userType: 'worker' }))}
            >
              <Users size={24} color={
                formData.userType === 'worker' ? Colors.white : Colors.primary
              } />
              <Text style={[
                styles.userTypeButtonText,
                formData.userType === 'worker' && styles.userTypeButtonTextActive
              ]}>
                Worker
              </Text>
              <Text style={[
                styles.userTypeButtonSubtext,
                formData.userType === 'worker' && styles.userTypeButtonSubtextActive
              ]}>
                Looking for work
              </Text>
              {formData.userType === 'worker' && (
                <View style={styles.checkIcon}>
                  <Check size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                formData.userType === 'client' && styles.userTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, userType: 'client' }))}
            >
              <Briefcase size={24} color={
                formData.userType === 'client' ? Colors.white : Colors.primary
              } />
              <Text style={[
                styles.userTypeButtonText,
                formData.userType === 'client' && styles.userTypeButtonTextActive
              ]}>
                Client
              </Text>
              <Text style={[
                styles.userTypeButtonSubtext,
                formData.userType === 'client' && styles.userTypeButtonSubtextActive
              ]}>
                Need to hire
              </Text>
              {formData.userType === 'client' && (
                <View style={styles.checkIcon}>
                  <Check size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Form Fields */}
        <View style={styles.form}>
          <InputField
            field="name"
            placeholder="Full Name"
            icon={User}
          />

          <InputField
            field="email"
            placeholder="Email Address"
            icon={Mail}
            keyboardType="email-address"
          />

          <InputField
            field="phone"
            placeholder="Phone Number (+961 70 123 456)"
            icon={Phone}
            keyboardType="phone-pad"
          />

          <InputField
            field="password"
            placeholder="Password"
            icon={Lock}
            secureTextEntry={!showPassword}
            showToggle={true}
          />

          <InputField
            field="confirmPassword"
            placeholder="Confirm Password"
            icon={Lock}
            secureTextEntry={!showConfirmPassword}
            showToggle={true}
          />
        </View>

        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.actionSection}
        >
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? [Colors.textSecondary, Colors.textLight] : [Colors.primary, Colors.primaryLight]}
              style={styles.buttonGradient}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  userTypeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  userTypeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  userTypeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  userTypeButtonTextActive: {
    color: Colors.white,
  },
  userTypeButtonSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  userTypeButtonSubtextActive: {
    color: Colors.white,
    opacity: 0.9,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    gap: 12,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  actionSection: {
    gap: 16,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLinkHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
});