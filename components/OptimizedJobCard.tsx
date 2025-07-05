import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onPress: (jobId: string) => void;
  showDistance?: boolean;
  distance?: number;
}

// MEMOIZED JobCard to prevent unnecessary re-renders
const OptimizedJobCard = memo<JobCardProps>(({ job, onPress, showDistance, distance }) => {
  const handlePress = useCallback(() => {
    onPress(job.id);
  }, [job.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* Your existing JobCard content */}
    </TouchableOpacity>
  );
});

OptimizedJobCard.displayName = 'OptimizedJobCard';

export default OptimizedJobCard;