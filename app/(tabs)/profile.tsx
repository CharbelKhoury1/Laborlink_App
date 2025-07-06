import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Switch, Dimensions } from 'react-native';
import { Settings, CreditCard as Edit, Star, MapPin, Phone, Mail, Shield, CreditCard, Bell, Globe, LogOut, ChevronRight, Briefcase, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SkillChip from '@/components/SkillChip';
import { SKILL_CATEGORIES } from '@/constants/SkillCategories';
import i18n from '@/utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

// Mock profile data
const mockProfile = {
  id: 'profile-123',
  name: 'Guest User',
  email: 'guest@workconnect.com',
  phone: '+961 70 123 456',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
  verified: false,
  rating: 4.5,
  reviewCount: 12,
  jobsCompleted: 8,
  hoursWorked: 96,
  skills: [
    { id: '1', name: 'Plumbing', category: SKILL_CATEGORIES[1], experience: 'intermediate' as const, verified: false },
    { id: '2', name: 'Electrical', category: SKILL_CATEGORIES[2], experience: 'beginner' as const, verified: false },
  ]
};

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const styles = createStyles(dimensions);

  const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightElement 
  }: {
    icon: any,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showChevron?: boolean,
    rightElement?: React.ReactNode
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <Icon size={isTablet ? 24 : 20} color={Colors.textSecondary} />
        <View style={styles.settingItemText}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {rightElement}
        {showChevron && <ChevronRight size={isTablet ? 20 : 16} color={Colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: mockProfile.avatar }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{mockProfile.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={isTablet ? 20 : 16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>{mockProfile.rating}</Text>
              <Text style={styles.reviewCount}>({mockProfile.reviewCount} reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={isTablet ? 18 : 14} color={Colors.textSecondary} />
              <Text style={styles.location}>Beirut, Lebanon</Text>
            </View>
            {mockProfile.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={isTablet ? 18 : 14} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={isTablet ? 22 : 18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Briefcase size={isTablet ? 28 : 20} color={Colors.primary} />
            <Text style={styles.statValue}>{mockProfile.jobsCompleted}</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={isTablet ? 28 : 20} color={Colors.secondary} />
            <Text style={styles.statValue}>{mockProfile.hoursWorked}</Text>
            <Text style={styles.statLabel}>Hours Worked</Text>
          </View>
        </View>

        {/* Skills */}
        <ProfileSection title={i18n.t('skills')}>
          <View style={styles.skillsContainer}>
            {mockProfile.skills.map((skill) => (
              <SkillChip key={skill.id} skill={skill} readonly />
            ))}
          </View>
        </ProfileSection>

        {/* Contact Info */}
        <ProfileSection title="Contact Information">
          <SettingItem
            icon={Phone}
            title="Phone"
            subtitle={mockProfile.phone}
          />
          <SettingItem
            icon={Mail}
            title="Email"
            subtitle={mockProfile.email}
          />
        </ProfileSection>

        {/* Settings */}
        <ProfileSection title="Settings">
          <SettingItem
            icon={Bell}
            title="Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.borderLight, true: Colors.primaryLight }}
                thumbColor={notificationsEnabled ? Colors.primary : Colors.textLight}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English"
          />
          <SettingItem
            icon={CreditCard}
            title="Payment Methods"
          />
          <SettingItem
            icon={Shield}
            title="Privacy & Security"
          />
        </ProfileSection>

        {/* Guest Mode Notice */}
        <View style={styles.guestNotice}>
          <Text style={styles.guestNoticeTitle}>Guest Mode</Text>
          <Text style={styles.guestNoticeText}>
            You're browsing as a guest. Create an account to save your preferences and access all features.
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const createStyles = (dimensions: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: isTablet ? 32 : 20,
    paddingBottom: isTablet ? 32 : 24,
    backgroundColor: Colors.white,
    marginBottom: isTablet ? 20 : 16,
  },
  profileImage: {
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: isTablet ? 50 : 40,
    marginRight: isTablet ? 20 : 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isTablet ? 24 : isLargeDevice ? 20 : isSmallDevice ? 18 : 19,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: isTablet ? 12 : 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 8 : 6,
  },
  rating: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 12 : 8,
  },
  location: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 16 : 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: isTablet ? 12 : 11,
    color: Colors.success,
    fontWeight: '500',
    marginLeft: 4,
  },
  editButton: {
    padding: isTablet ? 12 : 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginBottom: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 28 : 20,
    gap: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: isTablet ? 12 : 8,
  },
  statValue: {
    fontSize: isTablet ? 24 : isLargeDevice ? 20 : isSmallDevice ? 18 : 19,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: isTablet ? 20 : 16,
    paddingTop: isTablet ? 28 : 20,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 20 : 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingBottom: isTablet ? 28 : 20,
    gap: isTablet ? 12 : 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: isTablet ? 16 : 12,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    color: Colors.text,
  },
  settingItemSubtitle: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestNotice: {
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 40 : 32,
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 16 : 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  guestNoticeTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  guestNoticeText: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
    lineHeight: isTablet ? 24 : 20,
  },
});