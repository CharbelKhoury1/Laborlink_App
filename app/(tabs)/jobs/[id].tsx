import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Clock, DollarSign, Star, Phone, MessageCircle, Calendar, Camera, Shield, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SkillChip from '@/components/SkillChip';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

// Mock job data - in real app, fetch from API
const mockJobDetails: Job = {
  id: '1',
  clientId: 'client1',
  title: 'Kitchen Plumbing Repair',
  description: 'Need urgent plumbing repair for kitchen sink and pipes. Water is leaking under the sink and causing damage to the cabinet. The job requires immediate attention and should be completed within 24 hours. Previous attempts to fix this have failed, so we need an experienced professional.',
  location: {
    latitude: 33.8938,
    longitude: 35.5018,
    address: 'Hamra Street, Building 123, Apartment 4B',
    city: 'Beirut',
    region: 'Beirut'
  },
  requiredSkills: ['Plumbing', 'Pipe Repair', 'Emergency Repair'],
  duration: 3,
  budget: { min: 100, max: 200, currency: 'USD' },
  urgency: 'high',
  status: 'open',
  createdAt: new Date(),
  scheduledDate: new Date(),
  assignedWorkerId: undefined,
  photos: [
    'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1216544/pexels-photo-1216544.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
};

const mockClient = {
  id: 'client1',
  name: 'Ahmad Hassan',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  rating: 4.8,
  reviewCount: 24,
  verified: true,
  memberSince: '2022'
};

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Mock loading job details
    setJob(mockJobDetails);
  }, [id]);

  const handleApply = () => {
    Alert.alert(
      'Apply for Job',
      'Are you sure you want to apply for this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply', 
          onPress: () => {
            setApplied(true);
            Alert.alert('Success', 'Your application has been submitted!');
          }
        }
      ]
    );
  };

  const handleContact = () => {
    router.push('/messages');
  };

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getUrgencyColor = () => {
    switch (job.urgency) {
      case 'high': return Colors.error;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Photos */}
        {job.photos && job.photos.length > 0 && (
          <ScrollView horizontal style={styles.photosContainer} showsHorizontalScrollIndicator={false}>
            {job.photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.jobPhoto} />
            ))}
          </ScrollView>
        )}

        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor() }]}>
              <Text style={styles.urgencyText}>
                {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{job.location.address}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{job.duration} hours</Text>
            </View>
            <View style={styles.metaItem}>
              <DollarSign size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                ${job.budget.min}-${job.budget.max} {job.budget.currency}
              </Text>
            </View>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Required Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.requiredSkills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.clientCard}>
            <Image source={{ uri: mockClient.avatar }} style={styles.clientAvatar} />
            <View style={styles.clientInfo}>
              <View style={styles.clientHeader}>
                <Text style={styles.clientName}>{mockClient.name}</Text>
                {mockClient.verified && (
                  <Shield size={16} color={Colors.success} />
                )}
              </View>
              <View style={styles.clientRating}>
                <Star size={14} color={Colors.secondary} fill={Colors.secondary} />
                <Text style={styles.ratingText}>{mockClient.rating}</Text>
                <Text style={styles.reviewCount}>({mockClient.reviewCount} reviews)</Text>
              </View>
              <Text style={styles.memberSince}>Member since {mockClient.memberSince}</Text>
            </View>
            <View style={styles.clientActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleContact}>
                <MessageCircle size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <MapPin size={20} color={Colors.primary} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationAddress}>{job.location.address}</Text>
              <Text style={styles.locationCity}>{job.location.city}, {job.location.region}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.applyButton, applied && styles.appliedButton]}
          onPress={handleApply}
          disabled={applied}
        >
          <Text style={[styles.applyButtonText, applied && styles.appliedButtonText]}>
            {applied ? 'Applied' : 'Apply for Job'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  photosContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  jobPhoto: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  jobHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgencyText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  jobMeta: {
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  clientRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  clientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  locationCity: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  appliedButton: {
    backgroundColor: Colors.success,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  appliedButtonText: {
    color: Colors.white,
  },
});