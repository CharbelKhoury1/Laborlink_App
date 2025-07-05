import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Camera, X, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuthState } from '@/hooks/useAuth';
import i18n from '@/utils/i18n';

// 🔒 PRODUCTION MODE: Normal user type checks
const DEV_MODE_SKIP_USER_TYPE_CHECKS = false;

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Low Priority', color: Colors.success },
  { value: 'medium', label: 'Medium Priority', color: Colors.warning },
  { value: 'high', label: 'High Priority', color: Colors.error },
];

const SKILL_SUGGESTIONS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
  'Gardening', 'Moving', 'Delivery', 'Repair', 'Installation'
];

export default function PostJobScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minBudget: '',
    maxBudget: '',
    duration: '',
    urgency: 'medium',
    location: '',
    requiredSkills: [] as string[],
  });
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = (skill: string) => {
    if (!formData.requiredSkills.includes(skill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skill]
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skill)
    });
  };

  const handleAddPhoto = () => {
    // Mock photo addition - in real app, use expo-camera or expo-image-picker
    const mockPhoto = 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400';
    setPhotos([...photos, mockPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.minBudget || !formData.maxBudget) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.requiredSkills.length === 0) {
      Alert.alert('Error', 'Please add at least one required skill');
      return;
    }

    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your job has been posted successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 2000);
  };

  // 🚨 DEV MODE: Allow all users to post jobs
  if (!DEV_MODE_SKIP_USER_TYPE_CHECKS && user?.userType !== 'client') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Only clients can post jobs</Text>
        {DEV_MODE_SKIP_USER_TYPE_CHECKS && (
          <Text style={styles.devModeText}>🚨 Development Mode: User type checks disabled</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Development Mode Indicator */}
      {DEV_MODE_SKIP_USER_TYPE_CHECKS && (
        <View style={styles.devModeIndicator}>
          <Text style={styles.devModeText}>🚨 Development Mode: User type checks disabled</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="e.g., Kitchen Plumbing Repair"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Describe the job in detail..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget (USD) *</Text>
          <View style={styles.budgetRow}>
            <TextInput
              style={[styles.input, styles.budgetInput]}
              value={formData.minBudget}
              onChangeText={(text) => setFormData({ ...formData, minBudget: text })}
              placeholder="Min"
              keyboardType="numeric"
            />
            <Text style={styles.budgetSeparator}>to</Text>
            <TextInput
              style={[styles.input, styles.budgetInput]}
              value={formData.maxBudget}
              onChangeText={(text) => setFormData({ ...formData, maxBudget: text })}
              placeholder="Max"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estimated Duration (hours)</Text>
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
            placeholder="e.g., 3"
            keyboardType="numeric"
          />
        </View>

        {/* Urgency */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority Level</Text>
          <View style={styles.urgencyContainer}>
            {URGENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyOption,
                  formData.urgency === option.value && { backgroundColor: option.color }
                ]}
                onPress={() => setFormData({ ...formData, urgency: option.value })}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    formData.urgency === option.value && { color: Colors.white }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationContainer}>
            <MapPin size={20} color={Colors.textSecondary} />
            <TextInput
              style={[styles.input, styles.locationInput]}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Enter address or area"
            />
          </View>
        </View>

        {/* Required Skills */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Required Skills *</Text>
          <View style={styles.skillsContainer}>
            {formData.requiredSkills.map((skill, index) => (
              <View key={index} style={styles.selectedSkill}>
                <Text style={styles.selectedSkillText}>{skill}</Text>
                <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                  <X size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.skillSuggestions}>
            {SKILL_SUGGESTIONS.filter(skill => !formData.requiredSkills.includes(skill)).map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={styles.skillSuggestion}
                onPress={() => handleAddSkill(skill)}
              >
                <Plus size={14} color={Colors.primary} />
                <Text style={styles.skillSuggestionText}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photos */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photos (Optional)</Text>
          <View style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <X size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 5 && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Camera size={24} color={Colors.textSecondary} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Posting...' : 'Post Job'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  devModeText: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  devModeIndicator: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
  },
  budgetSeparator: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  locationInput: {
    flex: 1,
    borderWidth: 0,
    marginLeft: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectedSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedSkillText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
  skillSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  skillSuggestionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  addPhotoText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});