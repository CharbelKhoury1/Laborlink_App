import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, Plus, TrendingUp, Clock, Star, Briefcase, Users, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import JobCard from '@/components/JobCard';
import { useAuthState } from '@/hooks/useAuth';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

// Responsive dimensions
const getResponsiveDimensions = () => {
  const padding = isTablet ? 32 : isLargeDevice ? 24 : 20;
  const cardPadding = isTablet ? 24 : 20;
  const fontSize = {
    title: isTablet ? 32 : isLargeDevice ? 28 : isSmallDevice ? 24 : 26,
    subtitle: isTablet ? 20 : isLargeDevice ? 18 : 16,
    body: isTablet ? 18 : 16,
    small: isTablet ? 16 : 14,
    tiny: isTablet ? 14 : 12,
  };
  
  return { padding, cardPadding, fontSize };
};

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
  const { user, loading } = useAuthState();
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Mock loading nearby jobs
    setTimeout(() => {
      setNearbyJobs(mockJobs);
    }, 1000);
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return i18n.t('goodMorning');
    if (hour < 18) return i18n.t('goodAfternoon');
    return i18n.t('goodEvening');
  };

  const handleJobPress = (jobId: string) => {
    router.push({
      pathname: '/(tabs)/jobs/[id]',
      params: { id: jobId }
    });
  };

  const responsiveDimensions = getResponsiveDimensions();
  const styles = createStyles(responsiveDimensions, dimensions);

  const renderWorkerHome = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </Text>
              <View style={styles.locationRow}>
                <MapPin size={isTablet ? 20 : 16} color={Colors.white} />
                <Text style={styles.location}>Beirut, Lebanon</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
              <Bell size={isTablet ? 28 : 24} color={Colors.white} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.success, '#32CD32']}
              style={styles.statGradient}
            >
              <Briefcase size={isTablet ? 32 : 24} color={Colors.white} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.secondary, Colors.secondaryLight]}
              style={styles.statGradient}
            >
              <Star size={isTablet ? 32 : 24} color={Colors.white} />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.info, '#20B2AA']}
              style={styles.statGradient}
            >
              <Clock size={isTablet ? 32 : 24} color={Colors.white} />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Active</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/jobs')}
            >
              <View style={styles.quickActionIcon}>
                <TrendingUp size={isTablet ? 32 : 24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Browse Jobs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.quickActionIcon}>
                <Users size={isTablet ? 32 : 24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearby Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/jobs') as any}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {nearbyJobs.length > 0 ? (
            nearbyJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => handleJobPress(job.id)}
                showDistance={true}
                distance={Math.random() * 10 + 1}
              />
            ))
          ) : (
            <View style={styles.loadingJobs}>
              <Text style={styles.loadingText}>Finding jobs near you...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );

  const renderClientHome = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>
                Welcome back, {user?.name?.split(' ')[0]}!
              </Text>
              <Text style={styles.subGreeting}>Find the right worker for your needs</Text>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
              <Bell size={isTablet ? 28 : 24} color={Colors.white} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Post Job CTA */}
        <View style={styles.ctaContainer}>
          <LinearGradient
            colors={[Colors.accent, Colors.accentLight]}
            style={styles.ctaGradient}
          >
            <TouchableOpacity 
              style={styles.postJobButton}
              onPress={() => router.push('/(tabs)/jobs/post')}
            >
              <Plus size={isTablet ? 32 : 28} color={Colors.white} />
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Post a New Job</Text>
                <Text style={styles.ctaSubtitle}>Get connected with skilled workers</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Client Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              style={styles.statGradient}
            >
              <Briefcase size={isTablet ? 32 : 24} color={Colors.white} />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Jobs Posted</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.secondary, Colors.secondaryLight]}
              style={styles.statGradient}
            >
              <Star size={isTablet ? 32 : 24} color={Colors.white} />
              <Text style={styles.statValue}>4.6</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.success, '#32CD32']}
              style={styles.statGradient}
            >
              <DollarSign size={isTablet ? 32 : 24} color={Colors.white} />
              <Text style={styles.statValue}>$2.4k</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Jobs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Recent Jobs</Text>
          {nearbyJobs.length > 0 ? (
            nearbyJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => handleJobPress(job.id)}
              />
            ))
          ) : (
            <View style={styles.loadingJobs}>
              <Text style={styles.loadingText}>Loading your jobs...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.loadingGradient}
        >
          <Text style={styles.loadingTitle}>WorkConnect</Text>
          <Text style={styles.loadingSubtitle}>Lebanon</Text>
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return user.userType === 'worker' ? renderWorkerHome() : renderClientHome();
}

const createStyles = (responsiveDimensions: any, dimensions: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: responsiveDimensions.fontSize.title + 8,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 40,
  },
  loadingIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 25,
  },
  loadingText: {
    color: Colors.white,
    fontSize: responsiveDimensions.fontSize.body,
    fontWeight: '500',
  },
  headerGradient: {
    paddingBottom: isTablet ? 40 : 30,
    borderBottomLeftRadius: isTablet ? 35 : 25,
    borderBottomRightRadius: isTablet ? 35 : 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveDimensions.padding,
    paddingTop: isTablet ? 24 : 16,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: responsiveDimensions.fontSize.title,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: responsiveDimensions.fontSize.body,
    color: Colors.white,
    opacity: 0.9,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: responsiveDimensions.fontSize.small,
    color: Colors.white,
    marginLeft: 6,
    opacity: 0.9,
  },
  notificationIcon: {
    position: 'relative',
    padding: isTablet ? 12 : 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: isTablet ? 8 : 4,
    right: isTablet ? 8 : 4,
    backgroundColor: Colors.accent,
    borderRadius: isTablet ? 12 : 10,
    width: isTablet ? 24 : 20,
    height: isTablet ? 24 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: responsiveDimensions.fontSize.tiny,
    color: Colors.white,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: isTablet ? 'row' : 'row',
    paddingHorizontal: responsiveDimensions.padding,
    marginTop: isTablet ? -20 : -15,
    marginBottom: isTablet ? 32 : 24,
    gap: isTablet ? 16 : 12,
  },
  statCard: {
    flex: 1,
    borderRadius: isTablet ? 20 : 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statGradient: {
    padding: responsiveDimensions.cardPadding,
    borderRadius: isTablet ? 20 : 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: isTablet ? 28 : isLargeDevice ? 24 : isSmallDevice ? 20 : 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: isTablet ? 12 : 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: responsiveDimensions.fontSize.tiny,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  quickActionsContainer: {
    paddingHorizontal: responsiveDimensions.padding,
    marginBottom: isTablet ? 32 : 24,
  },
  quickActions: {
    flexDirection: isTablet ? 'row' : 'row',
    gap: isTablet ? 16 : 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: isTablet ? 64 : 48,
    height: isTablet ? 64 : 48,
    borderRadius: isTablet ? 32 : 24,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 12 : 8,
  },
  quickActionText: {
    fontSize: responsiveDimensions.fontSize.small,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  ctaContainer: {
    paddingHorizontal: responsiveDimensions.padding,
    marginTop: isTablet ? -20 : -15,
    marginBottom: isTablet ? 32 : 24,
  },
  ctaGradient: {
    borderRadius: isTablet ? 20 : 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveDimensions.cardPadding,
  },
  ctaContent: {
    marginLeft: isTablet ? 20 : 16,
    flex: 1,
  },
  ctaTitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: responsiveDimensions.fontSize.small,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: responsiveDimensions.padding,
    marginBottom: isTablet ? 32 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 16,
  },
  sectionTitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAll: {
    fontSize: responsiveDimensions.fontSize.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  loadingJobs: {
    backgroundColor: Colors.white,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 32 : 24,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});