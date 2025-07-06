import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Switch, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard as Edit, Star, MapPin, Phone, Mail, Shield, CreditCard, Bell, Globe, LogOut, ChevronRight, Briefcase, Clock, Award, Users, TrendingUp, Settings, Camera, Eye, EyeOff, Lock, Download, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import SkillChip from '@/components/SkillChip';
import { useAuthState } from '@/hooks/useAuth';
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
  const { user, logout } = useAuthState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [profileVisibility, setProfileVisibility] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

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

  const renderWorkerProfile = () => (
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
                {user?.name || `${mockProfile.firstName} ${mockProfile.lastName}`}
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
        </ProfileSection>

        {/* Contact Information */}
        <ProfileSection title="Contact Information" action={handlePrivacySettings}>
          <SettingItem
            icon={Phone}
            title="Phone"
            subtitle={user?.phone}
          />
          <SettingItem
            icon={Mail}
            title="Email"
            subtitle={user?.email}
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

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={isTablet ? 24 : 20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );

  const renderClientProfile = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={isTablet ? 20 : 16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>4.6</Text>
              <Text style={styles.reviewCount}>(8 reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={isTablet ? 18 : 14} color={Colors.textSecondary} />
              <Text style={styles.location}>Beirut, Lebanon</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={isTablet ? 22 : 18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Client Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Briefcase size={isTablet ? 28 : 20} color={Colors.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={isTablet ? 28 : 20} color={Colors.secondary} />
            <Text style={styles.statValue}>4.6</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>

        {/* Contact Info */}
        <ProfileSection title="Contact Information">
          <SettingItem
            icon={Phone}
            title="Phone"
            subtitle={user?.phone}
          />
          <SettingItem
            icon={Mail}
            title="Email"
            subtitle={user?.email}
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

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={isTablet ? 24 : 20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return user.userType === 'worker' ? renderWorkerProfile() : renderClientProfile();
}

const createStyles = (dimensions: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    borderWidth: 4,
    borderColor: Colors.white,
    marginRight: isTablet ? 20 : 16,
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
  statTrend: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: isTablet ? 20 : 16,
    paddingTop: isTablet ? 28 : 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 20 : 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionAction: {
    padding: 8,
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
    fontWeight: '500',
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
  logoutContainer: {
    backgroundColor: Colors.white,
    marginBottom: isTablet ? 40 : 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 20 : 16,
    gap: isTablet ? 12 : 8,
  },
  logoutText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    color: Colors.error,
  },
});