import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useAuthState } from '@/hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface LoginForm {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const router = useRouter();
  const { login, loading } = useAuthState();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof LoginForm, value: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field: keyof LoginForm) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof LoginForm>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const success = await login(formData.email.trim().toLowerCase(), formData.password);
    if (!success) {
      Alert.alert(
        'Login Failed', 
        'Invalid email or password. Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const InputField = ({ 
    field, 
    placeholder, 
    icon: Icon, 
    secureTextEntry = false,
    keyboardType = 'default' 
  }: {
    field: keyof LoginForm;
    placeholder: string;
    icon: any;
    secureTextEntry?: boolean;
    keyboardType?: any;
  }) => (
    <Animated.View 
      entering={FadeInDown.delay(200).duration(600)}
      style={styles.inputContainer}
    >
      <Text style={styles.label}>{placeholder}</Text>
      <View style={[
        styles.inputWrapper,
        errors[field] && touched[field] && styles.inputError
      ]}>
        <Icon size={20} color={
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
          autoComplete={field === 'email' ? 'email' : 'password'}
        />
        {field === 'password' && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={Colors.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && touched[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
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
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(100).duration(800)}
          style={styles.welcomeSection}
        >
          <Text style={styles.welcomeTitle}>Sign In</Text>
          <Text style={styles.welcomeSubtitle}>
            Continue building Lebanon's future
          </Text>
        </Animated.View>

        <View style={styles.form}>
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
          />

          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.forgotPasswordContainer}
          >
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View 
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.actionSection}
        >
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? [Colors.textSecondary, Colors.textLight] : [Colors.primary, Colors.primaryLight]}
              style={styles.buttonGradient}
            >
              {loading ? (
                <Text style={styles.loginButtonText}>Signing In...</Text>
              ) : (
                <>
                  <LogIn size={20} color={Colors.white} />
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.signUpLinkText}>
              Don't have an account? <Text style={styles.signUpLinkHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Demo Credentials */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.demoSection}
        >
          <Text style={styles.demoTitle}>Demo Credentials</Text>
          <View style={styles.demoCredentials}>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => {
                setFormData({ email: 'worker@workconnect.com', password: 'password123' });
                setTouched({});
                setErrors({});
              }}
            >
              <Text style={styles.demoButtonText}>Worker Demo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => {
                setFormData({ email: 'client@workconnect.com', password: 'password123' });
                setTouched({});
                setErrors({});
              }}
            >
              <Text style={styles.demoButtonText}>Client Demo</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPassword: {
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionSection: {
    gap: 16,
    marginBottom: 32,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  signUpLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  signUpLinkText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signUpLinkHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  demoSection: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  demoCredentials: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});