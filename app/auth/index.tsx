import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Briefcase, ArrowRight, Star, Shield, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AuthLanding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: 'Connect with Skilled Workers',
      description: 'Find verified professionals for any job in Lebanon',
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'All workers are verified with secure payment protection',
    },
    {
      icon: Clock,
      title: 'Quick & Reliable',
      description: 'Get your jobs done fast with real-time tracking',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight, Colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            style={styles.heroSection}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>WorkConnect</Text>
              <Text style={styles.logoSubtitle}>Lebanon</Text>
            </View>

            <Text style={styles.heroTitle}>
              Connecting Lebanese Workers with Local Opportunities
            </Text>

            <Text style={styles.heroDescription}>
              Join thousands of workers and clients building Lebanon's future together
            </Text>
          </Animated.View>

          {/* Feature Showcase */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.featureShowcase}
          >
            <View style={styles.featureCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.featureCardGradient}
              >
                {React.createElement(features[currentFeature].icon, {
                  size: 48,
                  color: Colors.white,
                })}
                <Text style={styles.featureTitle}>
                  {features[currentFeature].title}
                </Text>
                <Text style={styles.featureDescription}>
                  {features[currentFeature].description}
                </Text>
              </LinearGradient>
            </View>

            {/* Feature Indicators */}
            <View style={styles.indicators}>
              {features.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentFeature && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View 
            entering={SlideInRight.delay(600).duration(800)}
            style={styles.statsSection}
          >
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5K+</Text>
                <Text style={styles.statLabel}>Active Workers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Jobs Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
                  <Text style={styles.statNumber}>4.8</Text>
                </View>
                <Text style={styles.statLabel}>Average Rating</Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            entering={FadeInUp.delay(800).duration(800)}
            style={styles.actionSection}
          >
            <AnimatedTouchableOpacity
              entering={FadeInUp.delay(900).duration(600)}
              style={styles.primaryButton}
              onPress={() => router.push('/auth/signup')}
            >
              <LinearGradient
                colors={[Colors.white, 'rgba(255,255,255,0.9)']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <ArrowRight size={20} color={Colors.primary} />
              </LinearGradient>
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity
              entering={FadeInUp.delay(1000).duration(600)}
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
            </AnimatedTouchableOpacity>
          </Animated.View>

          {/* User Type Preview */}
          <Animated.View 
            entering={FadeInDown.delay(1100).duration(800)}
            style={styles.userTypeSection}
          >
            <Text style={styles.userTypeTitle}>Join as</Text>
            <View style={styles.userTypeCards}>
              <View style={styles.userTypeCard}>
                <Users size={32} color={Colors.white} />
                <Text style={styles.userTypeCardTitle}>Worker</Text>
                <Text style={styles.userTypeCardDescription}>
                  Find jobs and build your career
                </Text>
              </View>
              <View style={styles.userTypeCard}>
                <Briefcase size={32} color={Colors.white} />
                <Text style={styles.userTypeCardTitle}>Client</Text>
                <Text style={styles.userTypeCardDescription}>
                  Hire skilled professionals
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroDescription: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featureShowcase: {
    alignItems: 'center',
    marginBottom: 40,
  },
  featureCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  featureCardGradient: {
    padding: 32,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeIndicator: {
    backgroundColor: Colors.white,
    width: 24,
  },
  statsSection: {
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  actionSection: {
    marginBottom: 40,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  userTypeSection: {
    alignItems: 'center',
  },
  userTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 20,
  },
  userTypeCards: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  userTypeCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  userTypeCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginTop: 12,
    marginBottom: 8,
  },
  userTypeCardDescription: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
});