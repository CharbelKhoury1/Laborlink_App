import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, 
  KeyboardAvoidingView, Platform, Dimensions, Alert, Animated 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, 
  Shield, CheckCircle, AlertCircle, Briefcase, Users 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuthState } from '@/hooks/useAuth';
import FormValidation, { createValidationRules } from '@/components/FormValidation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'worker' | 'client';
}

interface FormErrors {
  [key: string]: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AuthLandingScreen() {
  const router = useRouter();
  const { login, register, loading } = useAuthState();
  const insets = useSafeAreaInsets();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'worker'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  React.useEffect(() => {
    // Form transition animation
    Animated.timing(formAnim, {
      toValue: isSignUp ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSignUp]);

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'username':
        if (isSignUp) {
          if (!value.trim()) return 'Username is required';
          if (value.length < 3) return 'Username must be at least 3 characters';
          if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        }
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        if (!/(?=.*[!@#$%^&*])/.test(value)) return 'Password must contain at least one special character';
        return undefined;
      
      case 'confirmPassword':
        if (isSignUp) {
          if (!value) return 'Please confirm your password';
          if (value !== formData.password) return 'Passwords do not match';
        }
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || '' }));
    }
    
    // Special case for confirm password when password changes
    if (field === 'password' && touched.confirmPassword && isSignUp) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError || '' }));
    }
  };

  const handleFieldBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error || '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const fieldsToValidate = isSignUp 
      ? ['username', 'email', 'password', 'confirmPassword'] as const
      : ['email', 'password'] as const;

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    if (isSignUp) {
      // Check for existing username/email (mock check)
      if (formData.email === 'existing@example.com') {
        setErrors({ email: 'This email is already registered' });
        return;
      }
      if (formData.username === 'existinguser') {
        setErrors({ username: 'This username is already taken' });
        return;
      }

      const success = await register({
        name: formData.username,
        email: formData.email.toLowerCase(),
        userType: formData.userType,
      });

      if (success) {
        Alert.alert(
          'Welcome to WorkConnect!',
          'Your account has been created successfully. You are now logged in.',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } else {
      const success = await login(formData.email.toLowerCase(), formData.password);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please check your credentials and try again.'
        );
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setTouched({});
    // Preserve email when switching modes
    setFormData(prev => ({
      username: '',
      email: prev.email,
      password: '',
      confirmPassword: '',
      userType: prev.userType
    }));
  };

  const getPasswordValidationRules = () => {
    if (!isSignUp || !touched.password) return [];
    
    return [
      createValidationRules.minLength(formData.password, 8, 'At least 8 characters'),
      createValidationRules.custom(formData.password, (val) => /(?=.*[a-z])/.test(val), 'One lowercase letter'),
      createValidationRules.custom(formData.password, (val) => /(?=.*[A-Z])/.test(val), 'One uppercase letter'),
      createValidationRules.custom(formData.password, (val) => /(?=.*\d)/.test(val), 'One number'),
      createValidationRules.custom(formData.password, (val) => /(?=.*[!@#$%^&*])/.test(val), 'One special character (!@#$%^&*)')
    ];
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
      style={[
        styles.inputContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[
        styles.inputWrapper,
        errors[field] && touched[field] && styles.inputError
      ]}>
        <Icon size={isTablet ? 22 : 20} color={
          errors[field] && touched[field] ? Colors.error : Colors.textSecondary
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
          autoCapitalize={field === 'email' ? 'none' : 'sentences'}
          autoComplete={field === 'email' ? 'email' : field === 'password' ? 'password' : 'off'}
        />
        {showToggle && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
          >
            {(field === 'password' ? showPassword : showConfirmPassword) ? (
              <EyeOff size={isTablet ? 22 : 20} color={Colors.textSecondary} />
            ) : (
              <Eye size={isTablet ? 22 : 20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && touched[field] && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={Colors.error} />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight, Colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <Animated.View 
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.logo}>WorkConnect</Text>
              <Text style={styles.logoSubtitle}>Lebanon</Text>
              <Text style={styles.tagline}>
                {isSignUp ? 'Join the community' : 'Welcome back'}
              </Text>
            </Animated.View>

            {/* Form Container */}
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Mode Toggle */}
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[styles.modeButton, !isSignUp && styles.modeButtonActive]}
                  onPress={() => !isSignUp || toggleMode()}
                >
                  <LogIn size={isTablet ? 20 : 18} color={!isSignUp ? Colors.white : Colors.primary} />
                  <Text style={[styles.modeButtonText, !isSignUp && styles.modeButtonTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeButton, isSignUp && styles.modeButtonActive]}
                  onPress={() => isSignUp || toggleMode()}
                >
                  <UserPlus size={isTablet ? 20 : 18} color={isSignUp ? Colors.white : Colors.primary} />
                  <Text style={[styles.modeButtonText, isSignUp && styles.modeButtonTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* User Type Selection (Sign Up Only) */}
              {isSignUp && (
                <Animated.View 
                  style={[
                    styles.userTypeSection,
                    {
                      opacity: formAnim,
                      transform: [
                        { 
                          translateY: formAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          })
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.userTypeTitle}>I am a</Text>
                  <View style={styles.userTypeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.userTypeButton,
                        formData.userType === 'worker' && styles.userTypeButtonActive
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, userType: 'worker' }))}
                    >
                      <Users size={isTablet ? 28 : 24} color={
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
                          <CheckCircle size={16} color={Colors.white} />
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
                      <Briefcase size={isTablet ? 28 : 24} color={
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
                          <CheckCircle size={16} color={Colors.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}

              {/* Form Fields */}
              <View style={styles.form}>
                {isSignUp && (
                  <InputField
                    field="username"
                    placeholder="Username"
                    icon={User}
                  />
                )}

                <InputField
                  field="email"
                  placeholder="Email Address"
                  icon={Mail}
                  keyboardType="email-address"
                />

                <InputField
                  field="password"
                  placeholder="Password"
                  icon={Lock}
                  secureTextEntry={!showPassword}
                  showToggle={true}
                />

                {/* Password Validation (Sign Up Only) */}
                {isSignUp && touched.password && (
                  <FormValidation 
                    rules={getPasswordValidationRules()}
                    style={styles.passwordValidation}
                  />
                )}

                {isSignUp && (
                  <InputField
                    field="confirmPassword"
                    placeholder="Confirm Password"
                    icon={Lock}
                    secureTextEntry={!showConfirmPassword}
                    showToggle={true}
                  />
                )}
              </View>

              {/* Submit Button */}
              <AnimatedTouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? [Colors.textSecondary, Colors.textLight] : [Colors.white, 'rgba(255,255,255,0.9)']}
                  style={styles.submitButtonGradient}
                >
                  {loading ? (
                    <Text style={[styles.submitButtonText, { color: Colors.white }]}>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </Text>
                  ) : (
                    <>
                      {isSignUp ? (
                        <UserPlus size={isTablet ? 22 : 20} color={Colors.primary} />
                      ) : (
                        <LogIn size={isTablet ? 22 : 20} color={Colors.primary} />
                      )}
                      <Text style={styles.submitButtonText}>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </AnimatedTouchableOpacity>

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Shield size={16} color={Colors.white} />
                <Text style={styles.securityText}>
                  Your data is protected with enterprise-grade security
                </Text>
              </View>

              {/* Demo Credentials */}
              {!isSignUp && (
                <Animated.View 
                  style={[
                    styles.demoSection,
                    {
                      opacity: fadeAnim,
                    },
                  ]}
                >
                  <Text style={styles.demoTitle}>Demo Credentials</Text>
                  <View style={styles.demoCredentials}>
                    <TouchableOpacity 
                      style={styles.demoButton}
                      onPress={() => {
                        setFormData(prev => ({ 
                          ...prev, 
                          email: 'worker@workconnect.com', 
                          password: 'Worker123!' 
                        }));
                        setTouched({});
                        setErrors({});
                      }}
                    >
                      <Text style={styles.demoButtonText}>Worker Demo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.demoButton}
                      onPress={() => {
                        setFormData(prev => ({ 
                          ...prev, 
                          email: 'client@workconnect.com', 
                          password: 'Client123!' 
                        }));
                        setTouched({});
                        setErrors({});
                      }}
                    >
                      <Text style={styles.demoButtonText}>Client Demo</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isTablet ? 60 : 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: isTablet ? 50 : 40,
  },
  logo: {
    fontSize: isTablet ? 48 : 42,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  logoSubtitle: {
    fontSize: isTablet ? 20 : 18,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: isTablet ? 20 : 16,
    fontWeight: '500',
  },
  tagline: {
    fontSize: isTablet ? 18 : 16,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 32 : 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    backdropFilter: 'blur(10px)',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: isTablet ? 16 : 12,
    padding: 4,
    marginBottom: isTablet ? 32 : 24,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: isTablet ? 12 : 8,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modeButtonText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  modeButtonTextActive: {
    color: Colors.white,
  },
  userTypeSection: {
    marginBottom: isTablet ? 32 : 24,
  },
  userTypeTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: isTablet ? 20 : 16,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: isTablet ? 16 : 12,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 20,
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
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: isTablet ? 12 : 8,
    marginBottom: 4,
  },
  userTypeButtonTextActive: {
    color: Colors.white,
  },
  userTypeButtonSubtext: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  userTypeButtonSubtextActive: {
    color: Colors.white,
    opacity: 0.9,
  },
  checkIcon: {
    position: 'absolute',
    top: isTablet ? 12 : 8,
    right: isTablet ? 12 : 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: isTablet ? 24 : 20,
    marginBottom: isTablet ? 32 : 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
    backgroundColor: Colors.white,
    gap: isTablet ? 16 : 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight + '10',
  },
  input: {
    flex: 1,
    paddingVertical: isTablet ? 20 : 16,
    fontSize: isTablet ? 18 : 16,
    color: Colors.text,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  errorText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.error,
    fontWeight: '500',
  },
  passwordValidation: {
    marginTop: -12,
  },
  submitButton: {
    borderRadius: isTablet ? 16 : 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    paddingVertical: isTablet ? 20 : 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isTablet ? 24 : 20,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: isTablet ? 12 : 10,
  },
  securityText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.white,
    fontWeight: '500',
    textAlign: 'center',
  },
  demoSection: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 20,
    marginTop: isTablet ? 24 : 20,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: isTablet ? 16 : 12,
  },
  demoCredentials: {
    flexDirection: 'row',
    gap: isTablet ? 16 : 12,
  },
  demoButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: isTablet ? 10 : 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  demoButtonText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.primary,
    fontWeight: '600',
  },
});