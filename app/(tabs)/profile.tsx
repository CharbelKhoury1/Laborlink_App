import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Switch } from 'react-native';
import { Settings, CreditCard as Edit, Star, MapPin, Phone, Mail, Shield, CreditCard, Bell, Globe, LogOut, ChevronRight, Briefcase, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SkillChip from '@/components/SkillChip';
import { useAuthState } from '@/hooks/useAuth';
import { SKILL_CATEGORIES } from '@/constants/SkillCategories';
import i18n from '@/utils/i18n';

// Mock worker profile data
const mockWorkerSkills = [
  { id: '1', name: 'Plumbing', category: SKILL_CATEGORIES[1], experience: 'expert' as const, verified: true },
  { id: '2', name: 'Pipe Repair', category: SKILL_CATEGORIES[1], experience: 'expert' as const, verified: true },
  { id: '3', name: 'Electrical', category: SKILL_CATEGORIES[2], experience: 'intermediate' as const, verified: false },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    await logout();
  };

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
        <Icon size={20} color={Colors.textSecondary} />
        <View style={styles.settingItemText}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {rightElement}
        {showChevron && <ChevronRight size={16} color={Colors.textSecondary} />}
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
              <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>4.8</Text>
              <Text style={styles.reviewCount}>(24 reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.location}>Beirut, Lebanon</Text>
            </View>
            {user?.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={14} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Worker Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Briefcase size={20} color={Colors.primary} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={20} color={Colors.secondary} />
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
            <LogOut size={20} color={Colors.error} />
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
              <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>4.6</Text>
              <Text style={styles.reviewCount}>(8 reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.location}>Beirut, Lebanon</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Client Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Briefcase size={20} color={Colors.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={20} color={Colors.secondary} />
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
            <LogOut size={20} color={Colors.error} />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '500',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginBottom: 16,
    paddingVertical: 20,
    gap: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: 12,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  settingItemSubtitle: {
    fontSize: 12,
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
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
  },
});