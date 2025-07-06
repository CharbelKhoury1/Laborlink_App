import React, { useState, useRef } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, 
  TextInput, Image, Alert, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Camera, Save, User, Briefcase, Mail, Phone, MapPin, 
  FileText, Building, Globe, Calendar, Award, X, Plus, Check
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import InlineError from '@/components/InlineError';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface FormData {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  company: string;
  email: string;
  phone: string;
  businessAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  professionalSummary: string;
  website: string;
  linkedIn: string;
  yearsExperience: string;
}

interface FormErrors {
  [key: string]: string;
}

const COUNTRIES = ['Lebanon', 'Syria', 'Jordan', 'Palestine', 'Iraq'];
const REGIONS_LEBANON = ['Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Nabatieh', 'Baalbek-Hermel', 'Akkar'];

export default function EditProfileScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: 'Ahmad',
    lastName: 'Hassan',
    professionalTitle: 'Senior Plumbing Specialist',
    company: 'Hassan Construction Services',
    email: 'ahmad.hassan@workconnect.com',
    phone: '+961 70 123 456',
    businessAddress: {
      street: '123 Hamra Street, Building A',
      city: 'Beirut',
      region: 'Beirut',
      postalCode: '1103-2070',
      country: 'Lebanon'
    },
    professionalSummary: 'Experienced plumbing specialist with 8+ years in residential and commercial projects. Certified in advanced pipe systems and emergency repairs.',
    website: 'www.hassanconstruction.com',
    linkedIn: 'linkedin.com/in/ahmad-hassan',
    yearsExperience: '8'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.professionalTitle.trim()) {
      newErrors.professionalTitle = 'Professional title is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Lebanese format)
    const phoneRegex = /^\+961\s?\d{2}\s?\d{3}\s?\d{3}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Lebanese phone number (+961 XX XXX XXX)';
    }

    // Professional summary validation
    if (!formData.professionalSummary.trim()) {
      newErrors.professionalSummary = 'Professional summary is required';
    } else if (formData.professionalSummary.length < 50) {
      newErrors.professionalSummary = 'Professional summary must be at least 50 characters';
    } else if (formData.professionalSummary.length > 500) {
      newErrors.professionalSummary = 'Professional summary must not exceed 500 characters';
    }

    // Address validation
    if (!formData.businessAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.businessAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Years of experience validation
    const yearsExp = parseInt(formData.yearsExperience);
    if (isNaN(yearsExp) || yearsExp < 0 || yearsExp > 50) {
      newErrors.yearsExperience = 'Please enter valid years of experience (0-50)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors before saving.');
      return;
    }

    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    error, 
    multiline = false,
    keyboardType = 'default',
    maxLength,
    required = false,
    icon: Icon
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    error?: string;
    multiline?: boolean;
    keyboardType?: any;
    maxLength?: number;
    required?: boolean;
    icon?: any;
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        {Icon && <Icon size={16} color={Colors.textSecondary} />}
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        {maxLength && (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
      {error && <InlineError message={error} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <>
              <Save size={18} color={Colors.white} />
              <Text style={styles.saveButtonText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400' }}
                style={styles.profilePhoto}
              />
              <TouchableOpacity style={styles.photoEditButton}>
                <Camera size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoHint}>
              Upload a professional photo (minimum 400x400px, max 5MB)
            </Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  placeholder="Enter first name"
                  error={errors.firstName}
                  required
                  icon={User}
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  placeholder="Enter last name"
                  error={errors.lastName}
                  required
                  icon={User}
                />
              </View>
            </View>

            <InputField
              label="Professional Title"
              value={formData.professionalTitle}
              onChangeText={(text) => handleInputChange('professionalTitle', text)}
              placeholder="e.g., Senior Plumbing Specialist"
              error={errors.professionalTitle}
              required
              icon={Briefcase}
            />

            <InputField
              label="Company/Organization"
              value={formData.company}
              onChangeText={(text) => handleInputChange('company', text)}
              placeholder="Enter company name"
              icon={Building}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Years of Experience"
                  value={formData.yearsExperience}
                  onChangeText={(text) => handleInputChange('yearsExperience', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.yearsExperience}
                  icon={Calendar}
                />
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              error={errors.email}
              required
              icon={Mail}
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="+961 XX XXX XXX"
              keyboardType="phone-pad"
              error={errors.phone}
              required
              icon={Phone}
            />

            <InputField
              label="Website"
              value={formData.website}
              onChangeText={(text) => handleInputChange('website', text)}
              placeholder="www.yourwebsite.com"
              keyboardType="url"
              icon={Globe}
            />

            <InputField
              label="LinkedIn Profile"
              value={formData.linkedIn}
              onChangeText={(text) => handleInputChange('linkedIn', text)}
              placeholder="linkedin.com/in/yourprofile"
              keyboardType="url"
              icon={Globe}
            />
          </View>

          {/* Business Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Address</Text>
            
            <InputField
              label="Street Address"
              value={formData.businessAddress.street}
              onChangeText={(text) => handleInputChange('businessAddress.street', text)}
              placeholder="Street address, building, apartment"
              error={errors.street}
              required
              icon={MapPin}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="City"
                  value={formData.businessAddress.city}
                  onChangeText={(text) => handleInputChange('businessAddress.city', text)}
                  placeholder="City"
                  error={errors.city}
                  required
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Postal Code"
                  value={formData.businessAddress.postalCode}
                  onChangeText={(text) => handleInputChange('businessAddress.postalCode', text)}
                  placeholder="Postal code"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Region/State"
                  value={formData.businessAddress.region}
                  onChangeText={(text) => handleInputChange('businessAddress.region', text)}
                  placeholder="Region"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Country"
                  value={formData.businessAddress.country}
                  onChangeText={(text) => handleInputChange('businessAddress.country', text)}
                  placeholder="Country"
                />
              </View>
            </View>
          </View>

          {/* Professional Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            
            <InputField
              label="About Your Professional Experience"
              value={formData.professionalSummary}
              onChangeText={(text) => handleInputChange('professionalSummary', text)}
              placeholder="Describe your professional background, expertise, and what makes you unique..."
              multiline
              maxLength={500}
              error={errors.professionalSummary}
              required
              icon={FileText}
            />
            
            <Text style={styles.hint}>
              Write a compelling summary that highlights your expertise and experience. 
              This will be visible to potential clients.
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: isTablet ? 32 : 24,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    borderWidth: 4,
    borderColor: Colors.borderLight,
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  photoHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    paddingVertical: isTablet ? 24 : 20,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: isTablet ? 20 : 16,
  },
  inputGroup: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  required: {
    color: Colors.error,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  halfWidth: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    marginTop: 8,
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});