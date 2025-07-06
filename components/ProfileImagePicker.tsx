import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { Camera, Upload, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface ProfileImagePickerProps {
  currentImage?: string;
  onImageSelected: (imageUri: string) => void;
  onImageRemoved: () => void;
  style?: any;
}

export default function ProfileImagePicker({
  currentImage,
  onImageSelected,
  onImageRemoved,
  style
}: ProfileImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your profile photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: handleCamera },
        { text: 'Photo Library', onPress: handleLibrary },
      ]
    );
  };

  const handleCamera = async () => {
    try {
      setUploading(true);
      // In a real app, you would use expo-camera or expo-image-picker here
      // For demo purposes, we'll use a placeholder
      const mockImageUri = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400';
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onImageSelected(mockImageUri);
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLibrary = async () => {
    try {
      setUploading(true);
      // In a real app, you would use expo-image-picker here
      // For demo purposes, we'll use a placeholder
      const mockImageUri = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400';
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onImageSelected(mockImageUri);
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onImageRemoved },
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        {currentImage ? (
          <>
            <Image source={{ uri: currentImage }} style={styles.profileImage} />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemoveImage}
            >
              <X size={16} color={Colors.white} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Camera size={isTablet ? 32 : 24} color={Colors.textSecondary} />
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleImagePicker}
          disabled={uploading}
        >
          {uploading ? (
            <Text style={styles.uploadingText}>...</Text>
          ) : (
            <Camera size={isTablet ? 20 : 16} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.guidelines}>
        <Text style={styles.guidelinesTitle}>Photo Guidelines</Text>
        <Text style={styles.guidelinesText}>
          • Use a clear, professional headshot{'\n'}
          • Minimum resolution: 400x400 pixels{'\n'}
          • Maximum file size: 5MB{'\n'}
          • Accepted formats: JPG, PNG
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: isTablet ? 20 : 16,
  },
  profileImage: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    borderWidth: 3,
    borderColor: Colors.borderLight,
  },
  placeholderContainer: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: isTablet ? 12 : 10,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: isTablet ? 20 : 16,
    width: isTablet ? 40 : 32,
    height: isTablet ? 40 : 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  uploadingText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  guidelines: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 8,
    maxWidth: 300,
  },
  guidelinesTitle: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: isTablet ? 12 : 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});