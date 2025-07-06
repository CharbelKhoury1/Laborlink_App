import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, Plus, TrendingUp, Clock, Star, Briefcase, Users, DollarSign, Zap, Award, Target, Type } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import JobCard from '@/components/JobCard';
import { useAuthState } from '@/hooks/useAuth';
import { Job } from '@/types';
import i18n from '@/utils/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typewriter } from '@/components/ui/Typewriter';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

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

// Enhanced responsive dimensions - MEMOIZED
const getResponsiveDimensions = (width: number) => {
  const padding = width >= 768 ? 32 : width >= 414 ? 24 : 20;
  const cardPadding = width >= 768 ? 28 : 24;
  const borderRadius = width >= 768 ? 20 : 16;
  const fontSize = {
    hero: width >= 768 ? 36 : width >= 414 ? 32 : width < 375 ? 26 : 28,
    title: width >= 768 ? 28 : width >= 414 ? 24 : width < 375 ? 20 : 22,
    subtitle: width >= 768 ? 20 : width >= 414 ? 18 : 16,
    body: width >= 768 ? 18 : 16,
    small: width >= 768 ? 16 : 14,
    tiny: width >= 768 ? 14 : 12,
  };
  
  return { padding, cardPadding, borderRadius, fontSize };
};

// Mock data with enhanced structure - MOVED OUTSIDE COMPONENT
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

// Animated components
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.View;

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading, initialized } = useAuthState();
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const insets = useSafeAreaInsets();

  // Animation values - STABLE REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const jobsAnim = useRef(new Animated.Value(0)).current;

  // MEMOIZED responsive dimensions
  const responsiveDimensions = useMemo(() => 
    getResponsiveDimensions(dimensions.width), 
    [dimensions.width]
  );

  // MEMOIZED styles
  const styles = useMemo(() => 
    createStyles(responsiveDimensions, dimensions, insets), 
    [responsiveDimensions, dimensions.width, dimensions.height, insets.top, insets.bottom]
  );

  // FIX: Stable dimensions listener
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(prevDimensions => {
        // Only update if dimensions actually changed
        if (prevDimensions.width !== window.width || prevDimensions.height !== window.height) {
          return window;
        }
        return prevDimensions;
      });
    });

    return () => subscription?.remove();
  }, []); // Empty dependency array is correct here

  // FIX: Stable animation effect with proper dependencies
  useEffect(() => {
    console.log('HomeScreen - User:', user?.email, 'Loading:', loading, 'Initialized:', initialized);
    
    if (initialized && user) {
      // Reset animations first
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.95);
      headerAnim.setValue(0);
      statsAnim.setValue(0);
      jobsAnim.setValue(0);

      // Entrance animations
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.stagger(200, [
          Animated.timing(headerAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(statsAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(jobsAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [initialized, user?.id]); // Only depend on user ID to prevent re-runs

  // FIX: Separate effect for loading jobs
  useEffect(() => {
    if (initialized && user && nearbyJobs.length === 0) {
      const timer = setTimeout(() => {
        setNearbyJobs(mockJobs);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [initialized, user?.id, nearbyJobs.length]);

  // FIX: Stable time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []); // Empty dependency array is correct

  // MEMOIZED greeting function
  const getGreeting = useCallback(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return i18n.t('goodMorning');
    if (hour < 18) return i18n.t('goodAfternoon');
    return i18n.t('goodEvening');
  }, [currentTime]);

  // MEMOIZED job press handler
  const handleJobPress = useCallback((jobId: string) => {
    router.push({
      pathname: '/(tabs)/jobs/[id]',
      params: { id: jobId }
    });
  }, [router]);

  // MEMOIZED animated button component
  const AnimatedButton = useCallback(({ onPress, children, style, gradientColors }: any) => {
    const buttonScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(buttonScale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedTouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          style,
          {
            transform: [{ scale: buttonScale }],
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors || [modernColors.primary, modernColors.primaryLight]}
          style={styles.buttonGradient}
        >
          {children}
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }, [styles.buttonGradient]);

  // Show loading state while authentication is being determined
  if (loading || !initialized || !user) {
    return (
      <View style={styles.fullScreenContainer}>
        <LinearGradient
          colors={[modernColors.primary, modernColors.primaryLight, modernColors.secondary]}
          style={styles.loadingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AnimatedView
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Text style={styles.loadingTitle}>WorkConnect</Text>
            <Text style={styles.loadingSubtitle}>Lebanon</Text>
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </AnimatedView>
        </LinearGradient>
      </View>
    );
  }

  const renderWorkerHome = () => (
    <View style={styles.fullScreenContainer}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header with Gradient and Typewriter */}
        <AnimatedView
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[modernColors.primary, modernColors.primaryLight, modernColors.secondary]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greetingStatic}>
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'Worker'}! 
                  </Text>
                  <Typewriter
                    text={['Ready to work? ✨', 'Find your next job! 🚀', 'Build your future! 💪']}
                    speed={80}
                    style={styles.greetingTypewriter}
                    waitTime={2000}
                    deleteSpeed={50}
                    cursorChar="_"
                    cursorStyle={styles.greetingCursor}
                  />
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={isTablet ? 20 : 16} color={modernColors.surface} />
                  <Text style={styles.location}>Beirut, Lebanon</Text>
                </View>
              </View>
              <AnimatedTouchableOpacity style={styles.notificationIcon}>
                <View style={styles.notificationIconBg}>
                  <Bell size={isTablet ? 28 : 24} color={modernColors.primary} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>3</Text>
                  </View>
                </View>
              </AnimatedTouchableOpacity>
            </View>
          </LinearGradient>
        </AnimatedView>

        {/* Enhanced Stats Cards */}
        <AnimatedView
          style={[
            styles.statsContainer,
            {
              opacity: statsAnim,
              transform: [
                { 
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={[modernColors.success, '#34D399']}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Briefcase size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Completed</Text>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color={modernColors.surface} />
                <Text style={styles.statTrendText}>+2 this week</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[modernColors.secondary, modernColors.secondaryLight]}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Star size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.statTrend}>
                <Award size={12} color={modernColors.surface} />
                <Text style={styles.statTrendText}>Top rated</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[modernColors.info, '#60A5FA']}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Clock size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Active</Text>
              <View style={styles.statTrend}>
                <Zap size={12} color={modernColors.surface} />
                <Text style={styles.statTrendText}>In progress</Text>
              </View>
            </LinearGradient>
          </View>
        </AnimatedView>

        {/* Enhanced Quick Actions */}
        <AnimatedView
          style={[
            styles.quickActionsContainer,
            {
              opacity: headerAnim,
              transform: [
                { 
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                },
              ],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <AnimatedButton
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/jobs')}
              gradientColors={[modernColors.primary, modernColors.primaryLight]}
            >
              <View style={styles.quickActionIcon}>
                <TrendingUp size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.quickActionText}>Browse Jobs</Text>
              <Text style={styles.quickActionSubtext}>Find new opportunities</Text>
            </AnimatedButton>
            
            <AnimatedButton
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/profile')}
              gradientColors={[modernColors.secondary, modernColors.secondaryLight]}
            >
              <View style={styles.quickActionIcon}>
                <Users size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.quickActionText}>Update Profile</Text>
              <Text style={styles.quickActionSubtext}>Enhance your visibility</Text>
            </AnimatedButton>

            <AnimatedButton
              style={styles.quickActionCard}
              onPress={() => router.push('/typewriter-demo')}
              gradientColors={[modernColors.accent, modernColors.accentLight]}
            >
              <View style={styles.quickActionIcon}>
                <Type size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.quickActionText}>Typewriter Demo</Text>
              <Text style={styles.quickActionSubtext}>See animation in action</Text>
            </AnimatedButton>
          </View>
        </AnimatedView>

        {/* Enhanced Nearby Jobs */}
        <AnimatedView
          style={[
            styles.section,
            {
              opacity: jobsAnim,
              transform: [
                { 
                  translateY: jobsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                },
              ],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Nearby Jobs</Text>
              <Text style={styles.sectionSubtitle}>Perfect matches for your skills</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/jobs') as any}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {nearbyJobs.length > 0 ? (
            nearbyJobs.map((job, index) => (
              <AnimatedView
                key={job.id}
                style={{
                  opacity: jobsAnim,
                  transform: [
                    { 
                      translateY: jobsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 * (index + 1), 0],
                      })
                    },
                  ],
                }}
              >
                <JobCard
                  job={job}
                  onPress={() => handleJobPress(job.id)}
                  showDistance={true}
                  distance={Math.random() * 10 + 1}
                />
              </AnimatedView>
            ))
          ) : (
            <View style={styles.loadingJobs}>
              <View style={styles.loadingIndicator}>
                <Text style={styles.loadingText}>Finding jobs near you...</Text>
              </View>
            </View>
          )}
        </AnimatedView>
      </ScrollView>
    </View>
  );

  const renderClientHome = () => (
    <View style={styles.fullScreenContainer}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header with Gradient and Typewriter */}
        <AnimatedView
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[modernColors.primary, modernColors.primaryLight, modernColors.secondary]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greetingStatic}>
                    Welcome back, {user?.name?.split(' ')[0] || 'Client'}! 
                  </Text>
                  <Typewriter
                    text={['Find skilled workers 👋', 'Post your next job 🚀', 'Build your team 💼']}
                    speed={80}
                    style={styles.greetingTypewriter}
                    waitTime={2000}
                    deleteSpeed={50}
                    cursorChar="_"
                    cursorStyle={styles.greetingCursor}
                  />
                </View>
                <Text style={styles.subGreeting}>Connect with the right professionals for your needs</Text>
              </View>
              <AnimatedTouchableOpacity style={styles.notificationIcon}>
                <View style={styles.notificationIconBg}>
                  <Bell size={isTablet ? 28 : 24} color={modernColors.primary} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>2</Text>
                  </View>
                </View>
              </AnimatedTouchableOpacity>
            </View>
          </LinearGradient>
        </AnimatedView>

        {/* Enhanced Post Job CTA */}
        <AnimatedView
          style={[
            styles.ctaContainer,
            {
              opacity: headerAnim,
              transform: [
                { 
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[modernColors.accent, modernColors.accentLight, '#F97316']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <AnimatedButton 
              style={styles.postJobButton}
              onPress={() => router.push('/(tabs)/jobs/post')}
              gradientColors={['transparent', 'transparent']}
            >
              <View style={styles.ctaIconContainer}>
                <Plus size={isTablet ? 32 : 28} color={modernColors.surface} />
              </View>
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Post a New Job</Text>
                <Text style={styles.ctaSubtitle}>Get connected with skilled workers</Text>
              </View>
              <Target size={isTablet ? 24 : 20} color={modernColors.surface} />
            </AnimatedButton>
          </LinearGradient>
        </AnimatedView>

        {/* Enhanced Client Stats */}
        <AnimatedView
          style={[
            styles.statsContainer,
            {
              opacity: statsAnim,
              transform: [
                { 
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={[modernColors.primary, modernColors.primaryLight]}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Briefcase size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Jobs Posted</Text>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color={modernColors.surface} />
                <Text style={styles.statTrendText}>+1 this month</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[modernColors.secondary, modernColors.secondaryLight]}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <Star size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.statValue}>4.6</Text>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.statTrend}>
                <Award size={12} color={modernColors.surface} />
                <Text style={styles.statTrendText}>Excellent</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[modernColors.success, '#34D399']}
              style={styles.statGradient}
            >
              <View style={styles.statIconContainer}>
                <DollarSign size={isTablet ? 32 : 24} color={modernColors.surface} />
              </View>
              <Text style={styles.statValue}>$2.4k</Text>
              <Text style={styles.statLabel}>Spent</Text>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color={modernColors.surface} />
                <Text style={styles.statTrendText}>This year</Text>
              </View>
            </LinearGradient>
          </View>
        </AnimatedView>

        {/* Enhanced Recent Jobs */}
        <AnimatedView
          style={[
            styles.section,
            {
              opacity: jobsAnim,
              transform: [
                { 
                  translateY: jobsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                },
              ],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your Recent Jobs</Text>
              <Text style={styles.sectionSubtitle}>Track your posted opportunities</Text>
            </View>
          </View>
          {nearbyJobs.length > 0 ? (
            nearbyJobs.map((job, index) => (
              <AnimatedView
                key={job.id}
                style={{
                  opacity: jobsAnim,
                  transform: [
                    { 
                      translateY: jobsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 * (index + 1), 0],
                      })
                    },
                  ],
                }}
              >
                <JobCard
                  job={job}
                  onPress={() => handleJobPress(job.id)}
                />
              </AnimatedView>
            ))
          ) : (
            <View style={styles.loadingJobs}>
              <View style={styles.loadingIndicator}>
                <Text style={styles.loadingText}>Loading your jobs...</Text>
              </View>
            </View>
          )}
        </AnimatedView>
      </ScrollView>
    </View>
  );

  console.log('Rendering home for user type:', user.userType);
  return user.userType === 'worker' ? renderWorkerHome() : renderClientHome();
}

const createStyles = (responsiveDimensions: any, dimensions: any, insets: any) => StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: modernColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Math.max(insets.bottom + 80, 100), // Account for tab bar
  },
  loadingGradient: {
    flex: 1,
    width: dimensions.width,
    height: dimensions.height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  },
  loadingTitle: {
    fontSize: responsiveDimensions.fontSize.hero,
    fontWeight: '800',
    color: modernColors.surface,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    color: modernColors.surface,
    opacity: 0.9,
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 25,
  },
  loadingText: {
    color: modernColors.surface,
    fontSize: responsiveDimensions.fontSize.body,
    fontWeight: '500',
  },
  headerContainer: {
    marginBottom: isTablet ? -25 : -20,
    zIndex: 1,
  },
  headerGradient: {
    paddingTop: insets.top + (isTablet ? 20 : 16),
    paddingBottom: isTablet ? 50 : 40,
    borderBottomLeftRadius: isTablet ? 35 : 25,
    borderBottomRightRadius: isTablet ? 35 : 25,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
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
  greetingContainer: {
    marginBottom: 8,
  },
  greetingStatic: {
    fontSize: responsiveDimensions.fontSize.hero,
    fontWeight: '800',
    color: modernColors.surface,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingTypewriter: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    fontWeight: '600',
    color: modernColors.surface,
    opacity: 0.9,
  },
  greetingCursor: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    color: modernColors.surface,
    opacity: 0.9,
  },
  subGreeting: {
    fontSize: responsiveDimensions.fontSize.body,
    color: modernColors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  location: {
    fontSize: responsiveDimensions.fontSize.small,
    color: modernColors.surface,
    marginLeft: 6,
    fontWeight: '600',
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationIconBg: {
    backgroundColor: modernColors.surface,
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 12 : 10,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: modernColors.accent,
    borderRadius: isTablet ? 12 : 10,
    width: isTablet ? 24 : 20,
    height: isTablet ? 24 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: modernColors.surface,
  },
  notificationCount: {
    fontSize: responsiveDimensions.fontSize.tiny,
    color: modernColors.surface,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveDimensions.padding,
    marginTop: isTablet ? 20 : 15,
    marginBottom: isTablet ? 32 : 24,
    gap: isTablet ? 16 : 12,
  },
  statCard: {
    flex: 1,
    borderRadius: responsiveDimensions.borderRadius,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statGradient: {
    padding: responsiveDimensions.cardPadding,
    borderRadius: responsiveDimensions.borderRadius,
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 12 : 8,
    marginBottom: isTablet ? 12 : 8,
  },
  statValue: {
    fontSize: isTablet ? 32 : isLargeDevice ? 28 : isSmallDevice ? 22 : 24,
    fontWeight: '800',
    color: modernColors.surface,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: responsiveDimensions.fontSize.tiny,
    color: modernColors.surface,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statTrendText: {
    fontSize: 10,
    color: modernColors.surface,
    fontWeight: '600',
  },
  quickActionsContainer: {
    paddingHorizontal: responsiveDimensions.padding,
    marginBottom: isTablet ? 32 : 24,
  },
  quickActions: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: isTablet ? 16 : 12,
  },
  quickActionCard: {
    flex: isTablet ? 1 : undefined,
    borderRadius: responsiveDimensions.borderRadius,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    padding: isTablet ? 24 : 20,
    borderRadius: responsiveDimensions.borderRadius,
    alignItems: 'center',
  },
  quickActionIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 16 : 12,
    marginBottom: isTablet ? 12 : 8,
  },
  quickActionText: {
    fontSize: responsiveDimensions.fontSize.small,
    fontWeight: '700',
    color: modernColors.surface,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtext: {
    fontSize: responsiveDimensions.fontSize.tiny,
    color: modernColors.surface,
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '500',
  },
  ctaContainer: {
    paddingHorizontal: responsiveDimensions.padding,
    marginTop: isTablet ? 20 : 15,
    marginBottom: isTablet ? 32 : 24,
  },
  ctaGradient: {
    borderRadius: responsiveDimensions.borderRadius,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  postJobButton: {
    borderRadius: responsiveDimensions.borderRadius,
  },
  ctaIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 16 : 12,
    marginRight: isTablet ? 20 : 16,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    fontWeight: '800',
    color: modernColors.surface,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: responsiveDimensions.fontSize.small,
    color: modernColors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: responsiveDimensions.padding,
    marginBottom: isTablet ? 32 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 20 : 16,
  },
  sectionTitle: {
    fontSize: responsiveDimensions.fontSize.subtitle,
    fontWeight: '800',
    color: modernColors.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: responsiveDimensions.fontSize.small,
    color: modernColors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  viewAll: {
    fontSize: responsiveDimensions.fontSize.small,
    color: modernColors.primary,
    fontWeight: '700',
    backgroundColor: modernColors.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  loadingJobs: {
    backgroundColor: modernColors.surface,
    borderRadius: responsiveDimensions.borderRadius,
    padding: isTablet ? 32 : 24,
    alignItems: 'center',
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});