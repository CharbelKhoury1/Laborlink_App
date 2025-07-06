import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Switch, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Edit, Star, MapPin, Phone, Mail, Shield, CreditCard, Bell, Globe, ChevronRight, Briefcase, Clock, Award, Users, TrendingUp, Settings, Camera, Eye, EyeOff, Lock, Download, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

// Enhanced professional profile data
const mockProfile = {
  id: 'profile-123',
  firstName: 'Ahmad',
  lastName: 'Hassan',
  professionalTitle: 'Senior Plumbing Specialist',
  company: 'Hassan Construction Services',
  email: 'ahmad.hassan@workconnect.com',
  phone: '+961 70 123 456',
  businessAddress: {
    street: '123 Hamra Street, Building A',
    city: 'Beirut',
    region: 'Beirut Governorate',
    postalCode: '1103-2070',
    country: 'Lebanon'
  },
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
  coverImage: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800&h=300',
  professionalSummary: 'Experienced plumbing specialist with 8+ years in residential and commercial projects. Certified in advanced pipe systems and emergency repairs.',
  verified: true,
  rating: 4.9,
  reviewCount: 127,
  jobsCompleted: 89,
  hoursWorked: 1247,
  responseRate: 98,
  onTimeRate: 96,
  memberSince: '2019',
  lastActive: new Date(),
  skills: [
    { id: '1', name: 'Advanced Plumbing', category: SKILL_CATEGORIES[1], experience: 'expert' as const, verified: true },
    { id: '2', name: 'Pipe Installation', category: SKILL_CATEGORIES[1], experience: 'expert' as const, verified: true },
    { id: '3', name: 'Emergency Repairs', category: SKILL_CATEGORIES[9], experience: 'expert' as const, verified: true },
    { id: '4', name: 'Water Systems', category: SKILL_CATEGORIES[1], experience: 'intermediate' as const, verified: false },
  ],
  certifications: [
    { name: 'Licensed Plumber', issuer: 'Lebanon Ministry of Labor', year: '2019' },
    { name: 'Safety Certification', issuer: 'OSHA Lebanon', year: '2023' }
  ],
  privacy: {
    showEmail: true,
    showPhone: true,
    showAddress: false,
    showLastActive: true,
    allowDirectContact: true
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [profileVisibility, setProfileVisibility] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const styles = createStyles(dimensions);

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Edit profile functionality would be implemented here.');
  };

  const handlePrivacySettings = () => {
    // Navigate to privacy settings
    Alert.alert('Privacy Settings', 'Privacy settings functionality would be implemented here.');
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Profile sharing functionality would be implemented here.');
  };

  const handleDownloadProfile = () => {
    Alert.alert('Download Profile', 'Profile download as PDF functionality would be implemented here.');
  };

  const ProfileSection = ({ title, children, action }: { 
    title: string, 
    children: React.ReactNode,
    action?: () => void 
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action && (
          <TouchableOpacity onPress={action} style={styles.sectionAction}>
            <Edit size={isTablet ? 18 : 16} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightElement,
    danger = false
  }: {
    icon: any,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showChevron?: boolean,
    rightElement?: React.ReactNode,
    danger?: boolean
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <View style={[styles.settingIconContainer, danger && styles.dangerIconContainer]}>
          <Icon size={isTablet ? 20 : 18} color={danger ? Colors.error : Colors.primary} />
        </View>
        <View style={styles.settingItemText}>
          <Text style={[styles.settingItemTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {rightElement}
        {showChevron && <ChevronRight size={isTablet ? 18 : 16} color={Colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ icon: Icon, value, label, color, trend }: {
    icon: any,
    value: string | number,
    label: string,
    color: string,
    trend?: string
  }) => (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[color, `${color}20`]}
        style={styles.statGradient}
      >
        <Icon size={isTablet ? 24 : 20} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {trend && (
          <Text style={[styles.statTrend, { color }]}>{trend}</Text>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Cover Image & Profile Header */}
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: mockProfile.coverImage }}
            style={styles.coverImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.coverOverlay}
          />
          
          <View style={styles.profileHeaderContainer}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: mockProfile.avatar }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={isTablet ? 20 : 16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {mockProfile.firstName} {mockProfile.lastName}
              </Text>
              <Text style={styles.professionalTitle}>
                {mockProfile.professionalTitle}
              </Text>
              <Text style={styles.company}>
                {mockProfile.company}
              </Text>
              
              <View style={styles.profileBadges}>
                {mockProfile.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={isTablet ? 16 : 14} color={Colors.success} />
                    <Text style={styles.verifiedText}>Verified Pro</Text>
                  </View>
                )}
                <View style={styles.ratingBadge}>
                  <Star size={isTablet ? 16 : 14} color={Colors.warning} fill={Colors.warning} />
                  <Text style={styles.ratingText}>{mockProfile.rating}</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
                <Edit size={isTablet ? 20 : 18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
                <Share2 size={isTablet ? 20 : 18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Professional Summary */}
        <ProfileSection title="Professional Summary" action={handleEditProfile}>
          <Text style={styles.summaryText}>{mockProfile.professionalSummary}</Text>
        </ProfileSection>

        {/* Performance Stats */}
        <ProfileSection title="Performance Metrics">
          <View style={styles.statsGrid}>
            <StatCard
              icon={Briefcase}
              value={mockProfile.jobsCompleted}
              label="Jobs Completed"
              color={Colors.primary}
              trend="+12 this month"
            />
            <StatCard
              icon={Clock}
              value={`${mockProfile.hoursWorked}h`}
              label="Hours Worked"
              color={Colors.secondary}
            />
            <StatCard
              icon={TrendingUp}
              value={`${mockProfile.responseRate}%`}
              label="Response Rate"
              color={Colors.success}
            />
            <StatCard
              icon={Award}
              value={`${mockProfile.onTimeRate}%`}
              label="On-Time Rate"
              color={Colors.info}
            />
          </View>
        </ProfileSection>

        {/* Skills & Certifications */}
        <ProfileSection title="Skills & Expertise" action={handleEditProfile}>
          <View style={styles.skillsContainer}>
            {mockProfile.skills.map((skill) => (
              <SkillChip key={skill.id} skill={skill} readonly />
            ))}
          </View>
          
          <View style={styles.certificationsContainer}>
            <Text style={styles.certificationsTitle}>Certifications</Text>
            {mockProfile.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <Award size={16} color={Colors.success} />
                <View style={styles.certificationInfo}>
                  <Text style={styles.certificationName}>{cert.name}</Text>
                  <Text style={styles.certificationIssuer}>{cert.issuer} • {cert.year}</Text>
                </View>
              </View>
            ))}
          </View>
        </ProfileSection>

        {/* Contact Information */}
        <ProfileSection title="Contact Information" action={handlePrivacySettings}>
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <Mail size={isTablet ? 20 : 18} color={Colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{mockProfile.email}</Text>
              </View>
              <View style={styles.privacyIndicator}>
                {mockProfile.privacy.showEmail ? (
                  <Eye size={14} color={Colors.success} />
                ) : (
                  <EyeOff size={14} color={Colors.textSecondary} />
                )}
              </View>
            </View>

            <View style={styles.contactItem}>
              <Phone size={isTablet ? 20 : 18} color={Colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{mockProfile.phone}</Text>
              </View>
              <View style={styles.privacyIndicator}>
                {mockProfile.privacy.showPhone ? (
                  <Eye size={14} color={Colors.success} />
                ) : (
                  <EyeOff size={14} color={Colors.textSecondary} />
                )}
              </View>
            </View>

            <View style={styles.contactItem}>
              <MapPin size={isTablet ? 20 : 18} color={Colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Business Address</Text>
                <Text style={styles.contactValue}>
                  {mockProfile.businessAddress.street}, {mockProfile.businessAddress.city}
                </Text>
              </View>
              <View style={styles.privacyIndicator}>
                {mockProfile.privacy.showAddress ? (
                  <Eye size={14} color={Colors.success} />
                ) : (
                  <EyeOff size={14} color={Colors.textSecondary} />
                )}
              </View>
            </View>
          </View>
        </ProfileSection>

        {/* Account Settings */}
        <ProfileSection title="Account Settings">
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="Manage your notification preferences"
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
            icon={Eye}
            title="Profile Visibility"
            subtitle={profileVisibility ? "Visible to clients" : "Hidden from search"}
            rightElement={
              <Switch
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                trackColor={{ false: Colors.borderLight, true: Colors.primaryLight }}
                thumbColor={profileVisibility ? Colors.primary : Colors.textLight}
              />
            }
            showChevron={false}
          />

          <SettingItem
            icon={Lock}
            title="Privacy Settings"
            subtitle="Control who can see your information"
            onPress={handlePrivacySettings}
          />

          <SettingItem
            icon={Globe}
            title="Language & Region"
            subtitle="English (US)"
          />

          <SettingItem
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Manage billing and payments"
          />

          <SettingItem
            icon={Download}
            title="Download Profile Data"
            subtitle="Export your profile as PDF"
            onPress={handleDownloadProfile}
          />

          <SettingItem
            icon={Settings}
            title="App Settings"
            subtitle="General app preferences"
          />
        </ProfileSection>

        {/* Account Status */}
        <View style={styles.accountStatus}>
          <LinearGradient
            colors={[Colors.success, Colors.successLight]}
            style={styles.statusGradient}
          >
            <Shield size={isTablet ? 24 : 20} color={Colors.white} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Professional Account</Text>
              <Text style={styles.statusDescription}>
                Verified professional member since {mockProfile.memberSince}
              </Text>
            </View>
          </LinearGradient>
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
  coverContainer: {
    position: 'relative',
    height: isTablet ? 280 : 220,
    marginBottom: isTablet ? 20 : 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  profileHeaderContainer: {
    position: 'absolute',
    bottom: isTablet ? 24 : 20,
    left: isTablet ? 32 : 20,
    right: isTablet ? 32 : 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: isTablet ? 20 : 16,
  },
  profileImage: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: isTablet ? 20 : 16,
    width: isTablet ? 40 : 32,
    height: isTablet ? 40 : 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  professionalTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  company: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  verifiedText: {
    fontSize: isTablet ? 12 : 11,
    color: Colors.white,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: isTablet ? 12 : 11,
    color: Colors.white,
    fontWeight: '600',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: isTablet ? 24 : 20,
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: isTablet ? 20 : 16,
    paddingTop: isTablet ? 28 : 24,
    paddingBottom: isTablet ? 28 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 20 : 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionAction: {
    padding: 8,
  },
  summaryText: {
    fontSize: isTablet ? 16 : 15,
    color: Colors.textSecondary,
    lineHeight: isTablet ? 24 : 22,
    paddingHorizontal: isTablet ? 32 : 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: isTablet ? 32 : 20,
    gap: isTablet ? 16 : 12,
  },
  statCard: {
    flex: 1,
    minWidth: isTablet ? 160 : 140,
    borderRadius: isTablet ? 16 : 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: isTablet ? 20 : 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  statTrend: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: isTablet ? 32 : 20,
    gap: isTablet ? 12 : 8,
    marginBottom: isTablet ? 24 : 20,
  },
  certificationsContainer: {
    paddingHorizontal: isTablet ? 32 : 20,
  },
  certificationsTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: isTablet ? 16 : 12,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 12 : 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  certificationInfo: {
    flex: 1,
  },
  certificationName: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  certificationIssuer: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
  },
  contactGrid: {
    paddingHorizontal: isTablet ? 32 : 20,
    gap: isTablet ? 20 : 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.text,
    fontWeight: '500',
  },
  privacyIndicator: {
    padding: 8,
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
  settingIconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: isTablet ? 12 : 10,
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isTablet ? 16 : 12,
  },
  dangerIconContainer: {
    backgroundColor: Colors.errorLight + '20',
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: Colors.text,
  },
  settingItemSubtitle: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    color: Colors.error,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountStatus: {
    marginHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 40 : 32,
    borderRadius: isTablet ? 16 : 12,
    overflow: 'hidden',
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 24 : 20,
    gap: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.white,
    opacity: 0.9,
  },
});