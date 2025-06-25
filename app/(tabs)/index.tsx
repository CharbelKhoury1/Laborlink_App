import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, Plus, TrendingUp, Clock, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import JobCard from '@/components/JobCard';
import { useAuthState } from '@/hooks/useAuth';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    clientId: 'client1',
    title: 'Kitchen Plumbing Repair',
    description: 'Need urgent plumbing repair for kitchen sink and pipes. Water is leaking under the sink.',
    location: {
      latitude: 33.8938,
      longitude: 35.5018,
      address: 'Hamra Street',
      city: 'Beirut',
      region: 'Beirut'
    },
    requiredSkills: ['Plumbing', 'Pipe Repair'],
    duration: 3,
    budget: { min: 100, max: 200, currency: 'USD' },
    urgency: 'high',
    status: 'open',
    createdAt: new Date(),
  },
  {
    id: '2',
    clientId: 'client2',
    title: 'Garden Maintenance',
    description: 'Weekly garden maintenance including trimming, watering, and general upkeep.',
    location: {
      latitude: 33.8547,
      longitude: 35.5622,
      address: 'Achrafieh',
      city: 'Beirut',
      region: 'Beirut'
    },
    requiredSkills: ['Gardening', 'Landscaping'],
    duration: 4,
    budget: { min: 80, max: 120, currency: 'USD' },
    urgency: 'medium',
    status: 'open',
    createdAt: new Date(),
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Mock loading nearby jobs
    setNearbyJobs(mockJobs);
  }, []);

  const handleJobPress = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const renderWorkerHome = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {i18n.t('goodMorning')}, {user?.name?.split(' ')[0]}!
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.location}>Beirut, Lebanon</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationIcon}>
            <Bell size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={Colors.success} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color={Colors.secondary} />
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color={Colors.info} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/jobs')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {nearbyJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => handleJobPress(job.id)}
              showDistance={true}
              distance={Math.random() * 10 + 1}
            />
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );

  const renderClientHome = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </Text>
            <Text style={styles.subGreeting}>Find the right worker for your needs</Text>
          </View>
          <TouchableOpacity style={styles.notificationIcon}>
            <Bell size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.postJobButton}
          onPress={() => router.push('/jobs/post')}
        >
          <Plus size={24} color={Colors.white} />
          <Text style={styles.postJobText}>Post a New Job</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Recent Jobs</Text>
          {nearbyJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => handleJobPress(job.id)}
            />
          ))}
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

  return user.userType === 'worker' ? renderWorkerHome() : renderClientHome();
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  notificationIcon: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  postJobText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
  },
});