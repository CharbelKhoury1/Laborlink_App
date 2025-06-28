import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MapPin, Clock, DollarSign, Star, CircleAlert as AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

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

export default function JobCard({ job, onPress, showDistance, distance }: JobCardProps) {
  const getStatusColor = () => {
    switch (job.status) {
      case 'open':
        return Colors.statusOpen;
      case 'assigned':
        return Colors.statusAssigned;
      case 'in_progress':
        return Colors.statusInProgress;
      case 'completed':
        return Colors.statusCompleted;
      case 'cancelled':
        return Colors.statusCancelled;
      default:
        return Colors.textSecondary;
    }
  };

  const getUrgencyColor = () => {
    switch (job.urgency) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getUrgencyGradient = () => {
    switch (job.urgency) {
      case 'high':
        return [Colors.error, '#FF6B6B'];
      case 'medium':
        return [Colors.warning, '#FFD93D'];
      case 'low':
        return [Colors.success, '#6BCF7F'];
      default:
        return [Colors.textSecondary, Colors.textLight];
    }
  };

  const styles = createStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Urgency Indicator */}
      {job.urgency === 'high' && (
        <LinearGradient
          colors={getUrgencyGradient()}
          style={styles.urgencyStripe}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {job.title}
          </Text>
          <View style={styles.badges}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{i18n.t(job.status)}</Text>
            </View>
            {job.urgency === 'high' && (
              <View style={styles.urgencyIcon}>
                <AlertCircle size={isTablet ? 20 : 16} color={Colors.error} />
              </View>
            )}
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
            <View style={styles.moreSkillsChip}>
              <Text style={styles.moreSkillsText}>+{job.requiredSkills.length - (isTablet ? 4 : 3)}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <MapPin size={isTablet ? 16 : 14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {job.location.city}
              {showDistance && distance && ` • ${distance.toFixed(1)}km`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={isTablet ? 16 : 14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{job.duration}h</Text>
          </View>

          <View style={styles.budgetContainer}>
            <DollarSign size={isTablet ? 16 : 14} color={Colors.success} />
            <Text style={styles.budgetText}>
              ${job.budget.min}-${job.budget.max}
            </Text>
          </View>
        </View>

        {job.urgency !== 'low' && (
          <View style={styles.urgencyFooter}>
            <LinearGradient
              colors={getUrgencyGradient()}
              style={styles.urgencyBadge}
            >
              <Text style={styles.urgencyText}>
                {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: isTablet ? 20 : 16,
    marginBottom: isTablet ? 20 : 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    padding: isTablet ? 24 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 16 : 12,
  },
  title: {
    fontSize: isTablet ? 22 : isLargeDevice ? 18 : isSmallDevice ? 16 : 17,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
    lineHeight: isTablet ? 28 : 24,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 14 : 12,
  },
  statusText: {
    fontSize: isTablet ? 12 : 11,
    color: Colors.white,
    fontWeight: '600',
  },
  urgencyIcon: {
    padding: 2,
  },
  description: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
    lineHeight: isTablet ? 24 : 20,
    marginBottom: isTablet ? 20 : 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: isTablet ? 20 : 16,
    alignItems: 'center',
    gap: isTablet ? 8 : 6,
  },
  skillChip: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 14 : 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.text,
    fontWeight: '500',
  },
  moreSkillsChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 14 : 12,
  },
  moreSkillsText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: isTablet ? 'row' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
    flexWrap: isSmallDevice ? 'wrap' : 'nowrap',
    gap: isSmallDevice ? 8 : 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: isTablet ? 1 : isSmallDevice ? 0 : 1,
    minWidth: isSmallDevice ? '45%' : 'auto',
  },
  infoText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 10 : 8,
  },
  budgetText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  urgencyFooter: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 14 : 12,
  },
  urgencyText: {
    fontSize: isTablet ? 12 : 11,
    color: Colors.white,
    fontWeight: 'bold',
  },
});