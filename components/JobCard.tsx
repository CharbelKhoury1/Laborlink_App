import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react-native';
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {job.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{i18n.t(job.status)}</Text>
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
          <Text style={styles.moreSkills}>+{job.requiredSkills.length - 3}</Text>
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

        <View style={styles.infoRow}>
          <DollarSign size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            {job.budget.min}-{job.budget.max} {job.budget.currency}
          </Text>
        </View>
      </View>

      <View style={styles.urgencyContainer}>
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor() }]}>
          <Text style={styles.urgencyText}>
            {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  skillChip: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 11,
    color: Colors.text,
  },
  moreSkills: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  urgencyContainer: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '500',
  },
});