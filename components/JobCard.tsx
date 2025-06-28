import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { MapPin, Clock, DollarSign, Star, CircleAlert as AlertCircle, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

// Modern color palette
const modernColors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  secondary: '#F59E0B',
  secondaryLight: '#FCD34D',
  accent: '#EF4444',
  accentLight: '#F87171',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  background: '#FAFBFC',
  surface: '#FFFFFF',
  surfaceElevated: '#F8FAFC',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

interface JobCardProps {
  job: Job;
  onPress: () => void;
  showDistance?: boolean;
  distance?: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function JobCard({ job, onPress, showDistance, distance }: JobCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'open':
        return modernColors.info;
      case 'assigned':
        return modernColors.warning;
      case 'in_progress':
        return modernColors.primary;
      case 'completed':
        return modernColors.success;
      case 'cancelled':
        return modernColors.accent;
      default:
        return modernColors.textSecondary;
    }
  };

  const getUrgencyColor = () => {
    switch (job.urgency) {
      case 'high':
        return modernColors.accent;
      case 'medium':
        return modernColors.warning;
      case 'low':
        return modernColors.success;
      default:
        return modernColors.textSecondary;
    }
  };

  const getUrgencyGradient = () => {
    switch (job.urgency) {
      case 'high':
        return [modernColors.accent, modernColors.accentLight];
      case 'medium':
        return [modernColors.warning, modernColors.secondaryLight];
      case 'low':
        return [modernColors.success, '#34D399'];
      default:
        return [modernColors.textSecondary, '#9CA3AF'];
    }
  };

  const styles = createStyles();

  return (
    <AnimatedTouchableOpacity 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Enhanced Urgency Indicator */}
      {job.urgency === 'high' && (
        <LinearGradient
          colors={getUrgencyGradient()}
          style={styles.urgencyStripe}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {job.title}
            </Text>
            {job.urgency === 'high' && (
              <View style={styles.urgencyIndicator}>
                <AlertCircle size={isTablet ? 18 : 16} color={modernColors.accent} />
                <Text style={styles.urgencyLabel}>Urgent</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            <LinearGradient
              colors={[getStatusColor(), getStatusColor() + '80']}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>{i18n.t(job.status)}</Text>
            </LinearGradient>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={isTablet ? 4 : 3}>
          {job.description}
        </Text>

        <View style={styles.skillsContainer}>
          {job.requiredSkills.slice(0, isTablet ? 4 : 3).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {job.requiredSkills.length > (isTablet ? 4 : 3) && (
            <LinearGradient
              colors={[modernColors.primary, modernColors.primaryLight]}
              style={styles.moreSkillsChip}
            >
              <Text style={styles.moreSkillsText}>+{job.requiredSkills.length - (isTablet ? 4 : 3)}</Text>
            </LinearGradient>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={isTablet ? 16 : 14} color={modernColors.textSecondary} />
              <Text style={styles.infoText}>
                {job.location.city}
                {showDistance && distance && ` • ${distance.toFixed(1)}km`}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Clock size={isTablet ? 16 : 14} color={modernColors.textSecondary} />
              <Text style={styles.infoText}>{job.duration}h</Text>
            </View>
          </View>

          <LinearGradient
            colors={[modernColors.success, '#34D399']}
            style={styles.budgetContainer}
          >
            <DollarSign size={isTablet ? 16 : 14} color={modernColors.surface} />
            <Text style={styles.budgetText}>
              ${job.budget.min}-${job.budget.max}
            </Text>
          </LinearGradient>
        </View>

        {job.urgency !== 'low' && (
          <View style={styles.urgencyFooter}>
            <LinearGradient
              colors={getUrgencyGradient()}
              style={styles.urgencyBadge}
            >
              <TrendingUp size={12} color={modernColors.surface} />
              <Text style={styles.urgencyText}>
                {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    backgroundColor: modernColors.surface,
    borderRadius: isTablet ? 24 : 20,
    marginBottom: isTablet ? 20 : 16,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: modernColors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  urgencyStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isTablet ? 6 : 4,
  },
  content: {
    padding: isTablet ? 28 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 16 : 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: isTablet ? 24 : isLargeDevice ? 20 : isSmallDevice ? 18 : 19,
    fontWeight: '800',
    color: modernColors.text,
    lineHeight: isTablet ? 32 : 26,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  urgencyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: modernColors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  urgencyLabel: {
    fontSize: 11,
    color: modernColors.accent,
    fontWeight: '700',
  },
  badges: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: isTablet ? 14 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 16 : 14,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: isTablet ? 12 : 11,
    color: modernColors.surface,
    fontWeight: '700',
  },
  description: {
    fontSize: isTablet ? 16 : 15,
    color: modernColors.textSecondary,
    lineHeight: isTablet ? 24 : 22,
    marginBottom: isTablet ? 20 : 16,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: isTablet ? 20 : 16,
    alignItems: 'center',
    gap: isTablet ? 8 : 6,
  },
  skillChip: {
    backgroundColor: modernColors.surfaceElevated,
    paddingHorizontal: isTablet ? 14 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 16 : 14,
    borderWidth: 1,
    borderColor: modernColors.border,
  },
  skillText: {
    fontSize: isTablet ? 14 : 12,
    color: modernColors.text,
    fontWeight: '600',
  },
  moreSkillsChip: {
    paddingHorizontal: isTablet ? 14 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 16 : 14,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moreSkillsText: {
    fontSize: isTablet ? 14 : 12,
    color: modernColors.surface,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  infoRow: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: isTablet ? 16 : 8,
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: isTablet ? 14 : 13,
    color: modernColors.textSecondary,
    fontWeight: '600',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 14 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 14 : 12,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 4,
  },
  budgetText: {
    fontSize: isTablet ? 14 : 13,
    color: modernColors.surface,
    fontWeight: '800',
  },
  urgencyFooter: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 16 : 14,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 16 : 14,
    gap: 4,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgencyText: {
    fontSize: isTablet ? 12 : 11,
    color: modernColors.surface,
    fontWeight: '700',
  },
});