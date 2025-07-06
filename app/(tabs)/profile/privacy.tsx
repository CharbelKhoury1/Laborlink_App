import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Shield, Lock, Globe, Users, Phone, Mail, MapPin, Save } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface PrivacySettings {
  profileVisibility: 'public' | 'clients-only' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showLastActive: boolean;
  allowDirectContact: boolean;
  showRatings: boolean;
  showJobHistory: boolean;
  allowSearchEngines: boolean;
  dataCollection: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
}

export default function PrivacySettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: true,
    showAddress: false,
    showLastActive: true,
    allowDirectContact: true,
    showRatings: true,
    showJobHistory: true,
    allowSearchEngines: true,
    dataCollection: true,
    marketingEmails: false,
    pushNotifications: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate API call
    Alert.alert('Settings Saved', 'Your privacy settings have been updated successfully.');
    setHasChanges(false);
  };

  const PrivacySection = ({ title, description, children }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description && (
          <Text style={styles.sectionDescription}>{description}</Text>
        )}
      </View>
      {children}
    </View>
  );

  const PrivacyToggle = ({ 
    icon: Icon, 
    title, 
    description, 
    value, 
    onValueChange,
    iconColor = Colors.primary 
  }: {
    icon: any;
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    iconColor?: string;
  }) => (
    <View style={styles.toggleItem}>
      <View style={styles.toggleLeft}>
        <View style={[styles.toggleIcon, { backgroundColor: iconColor + '20' }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.toggleContent}>
          <Text style={styles.toggleTitle}>{title}</Text>
          <Text style={styles.toggleDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.borderLight, true: Colors.primaryLight }}
        thumbColor={value ? Colors.primary : Colors.textLight}
      />
    </View>
  );

  const VisibilityOption = ({ 
    value, 
    label, 
    description, 
    selected, 
    onSelect 
  }: {
    value: string;
    label: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.visibilityOption, selected && styles.visibilityOptionSelected]}
      onPress={onSelect}
    >
      <View style={styles.visibilityContent}>
        <Text style={[styles.visibilityLabel, selected && styles.visibilityLabelSelected]}>
          {label}
        </Text>
        <Text style={styles.visibilityDescription}>{description}</Text>
      </View>
      <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          disabled={!hasChanges}
        >
          <Save size={18} color={hasChanges ? Colors.white : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Visibility */}
        <PrivacySection 
          title="Profile Visibility"
          description="Control who can see your profile and information"
        >
          <VisibilityOption
            value="public"
            label="Public"
            description="Anyone can view your profile and contact you"
            selected={settings.profileVisibility === 'public'}
            onSelect={() => handleSettingChange('profileVisibility', 'public')}
          />
          <VisibilityOption
            value="clients-only"
            label="Clients Only"
            description="Only verified clients can view your profile"
            selected={settings.profileVisibility === 'clients-only'}
            onSelect={() => handleSettingChange('profileVisibility', 'clients-only')}
          />
          <VisibilityOption
            value="private"
            label="Private"
            description="Your profile is hidden from search results"
            selected={settings.profileVisibility === 'private'}
            onSelect={() => handleSettingChange('profileVisibility', 'private')}
          />
        </PrivacySection>

        {/* Contact Information */}
        <PrivacySection 
          title="Contact Information"
          description="Choose what contact details are visible to others"
        >
          <PrivacyToggle
            icon={Mail}
            title="Show Email Address"
            description="Allow clients to see your email address"
            value={settings.showEmail}
            onValueChange={(value) => handleSettingChange('showEmail', value)}
          />
          <PrivacyToggle
            icon={Phone}
            title="Show Phone Number"
            description="Display your phone number on your profile"
            value={settings.showPhone}
            onValueChange={(value) => handleSettingChange('showPhone', value)}
          />
          <PrivacyToggle
            icon={MapPin}
            title="Show Business Address"
            description="Display your business address publicly"
            value={settings.showAddress}
            onValueChange={(value) => handleSettingChange('showAddress', value)}
          />
        </PrivacySection>

        {/* Activity & Interaction */}
        <PrivacySection 
          title="Activity & Interaction"
          description="Control how others can interact with you"
        >
          <PrivacyToggle
            icon={Eye}
            title="Show Last Active"
            description="Let others see when you were last online"
            value={settings.showLastActive}
            onValueChange={(value) => handleSettingChange('showLastActive', value)}
          />
          <PrivacyToggle
            icon={Users}
            title="Allow Direct Contact"
            description="Let clients contact you directly without going through jobs"
            value={settings.allowDirectContact}
            onValueChange={(value) => handleSettingChange('allowDirectContact', value)}
          />
          <PrivacyToggle
            icon={Shield}
            title="Show Ratings & Reviews"
            description="Display your ratings and client reviews"
            value={settings.showRatings}
            onValueChange={(value) => handleSettingChange('showRatings', value)}
          />
          <PrivacyToggle
            icon={Globe}
            title="Show Job History"
            description="Display your completed jobs and work history"
            value={settings.showJobHistory}
            onValueChange={(value) => handleSettingChange('showJobHistory', value)}
          />
        </PrivacySection>

        {/* Search & Discovery */}
        <PrivacySection 
          title="Search & Discovery"
          description="Control how your profile appears in search results"
        >
          <PrivacyToggle
            icon={Globe}
            title="Allow Search Engines"
            description="Let search engines like Google index your profile"
            value={settings.allowSearchEngines}
            onValueChange={(value) => handleSettingChange('allowSearchEngines', value)}
          />
        </PrivacySection>

        {/* Data & Communications */}
        <PrivacySection 
          title="Data & Communications"
          description="Manage how we use your data and communicate with you"
        >
          <PrivacyToggle
            icon={Shield}
            title="Data Collection for Improvement"
            description="Allow anonymous usage data to improve our services"
            value={settings.dataCollection}
            onValueChange={(value) => handleSettingChange('dataCollection', value)}
            iconColor={Colors.info}
          />
          <PrivacyToggle
            icon={Mail}
            title="Marketing Emails"
            description="Receive emails about new features and opportunities"
            value={settings.marketingEmails}
            onValueChange={(value) => handleSettingChange('marketingEmails', value)}
            iconColor={Colors.secondary}
          />
          <PrivacyToggle
            icon={Globe}
            title="Push Notifications"
            description="Receive notifications about jobs and messages"
            value={settings.pushNotifications}
            onValueChange={(value) => handleSettingChange('pushNotifications', value)}
            iconColor={Colors.warning}
          />
        </PrivacySection>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Shield size={24} color={Colors.info} />
          <View style={styles.privacyNoticeContent}>
            <Text style={styles.privacyNoticeTitle}>Your Privacy Matters</Text>
            <Text style={styles.privacyNoticeText}>
              We're committed to protecting your privacy. These settings give you control over 
              your personal information. You can change these settings at any time.
            </Text>
            <TouchableOpacity style={styles.privacyPolicyLink}>
              <Text style={styles.privacyPolicyText}>Read our Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    paddingVertical: isTablet ? 24 : 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: isTablet ? 20 : 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: isTablet ? 14 : 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: isTablet ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
    borderRadius: isTablet ? 22 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isTablet ? 16 : 12,
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: isTablet ? 14 : 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: isTablet ? 16 : 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  visibilityOptionSelected: {
    backgroundColor: Colors.primaryLight + '10',
  },
  visibilityContent: {
    flex: 1,
  },
  visibilityLabel: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  visibilityLabelSelected: {
    color: Colors.primary,
  },
  visibilityDescription: {
    fontSize: isTablet ? 14 : 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  privacyNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  privacyNoticeContent: {
    flex: 1,
    marginLeft: 12,
  },
  privacyNoticeTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  privacyNoticeText: {
    fontSize: isTablet ? 14 : 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  privacyPolicyLink: {
    alignSelf: 'flex-start',
  },
  privacyPolicyText: {
    fontSize: isTablet ? 14 : 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});