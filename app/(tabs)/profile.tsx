import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Switch, Dimensions } from 'react-native';
import { Settings, CreditCard as Edit, Star, MapPin, Phone, Mail, Shield, CreditCard, Bell, Globe, LogOut, ChevronRight, Briefcase, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SkillChip from '@/components/SkillChip';
import ErrorBoundary from '@/components/ErrorBoundary'; // Added ErrorBoundary
import { useAuthState } from '@/hooks/useAuth';
import { SKILL_CATEGORIES } from '@/constants/SkillCategories';
import i18n from '@/utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

// Mock worker profile data
const mockWorkerSkills = [
  { id: '1', name: 'Plumbing', category: SKILL_CATEGORIES[1], experience: 'expert' as const, verified: true },
  { id: '2', name: 'Pipe Repair', category: SKILL_CATEGORIES[1], experience: 'expert' as const, verified: true },
  { id: '3', name: 'Electrical', category: SKILL_CATEGORIES[2], experience: 'intermediate' as const, verified: false },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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

  const renderWorkerProfile = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={isTablet ? 20 : 16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>4.8</Text>
              <Text style={styles.reviewCount}>(24 reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={isTablet ? 18 : 14} color={Colors.textSecondary} />
              <Text style={styles.location}>Beirut, Lebanon</Text>
            </View>
            {user?.verified && (
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

        {/* Worker Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Briefcase size={isTablet ? 28 : 20} color={Colors.primary} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={isTablet ? 28 : 20} color={Colors.secondary} />
            <Text style={styles.statValue}>145</Text>
            <Text style={styles.statLabel}>Hours Worked</Text>
          </View>
        </View>

        {/* Skills */}
        <ProfileSection title={i18n.t('skills')}>
          <View style={styles.skillsContainer}>
            {mockWorkerSkills.map((skill) => (
              <SkillChip key={skill.id} skill={skill} readonly />
            ))}
          </View>
        </ProfileSection>

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

  const content = user.userType === 'worker' ? renderWorkerProfile() : renderClientProfile();
  return <ErrorBoundary>{content}</ErrorBoundary>;
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