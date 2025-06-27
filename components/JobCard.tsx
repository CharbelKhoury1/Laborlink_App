import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, DollarSign, Star, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

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
                <AlertCircle size={16} color={Colors.error} />
              </View>
            )}
          </View>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {job.description}
        </Text>

        <View style={styles.skillsContainer}>
          {job.requiredSkills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {job.requiredSkills.length > 3 && (
            <View style={styles.moreSkillsChip}>
              <Text style={styles.moreSkillsText}>+{job.requiredSkills.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <MapPin size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {job.location.city}
              {showDistance && distance && ` • ${distance.toFixed(1)}km`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{job.duration}h</Text>
          </View>

          <View style={styles.budgetContainer}>
            <DollarSign size={14} color={Colors.success} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
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
    height: 4,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  urgencyIcon: {
    padding: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
    gap: 6,
  },
  skillChip: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  moreSkillsChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moreSkillsText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  budgetText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  urgencyFooter: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: 'bold',
  },
});