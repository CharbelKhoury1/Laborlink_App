import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, MapPin, Plus, SlidersHorizontal } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import JobCard from '@/components/JobCard';
import FilterModal from '@/components/FilterModal';
import ErrorBoundary from '@/components/ErrorBoundary'; // Added ErrorBoundary
import { useAuthState } from '@/hooks/useAuth';
import { Job } from '@/types';
import i18n from '@/utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

// Mock data - same as home screen for consistency
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
  },
  {
    id: '3',
    clientId: 'client3',
    title: 'Electrical Wiring Installation',
    description: 'Install new electrical outlets and rewire living room area. Must be licensed electrician.',
    location: {
      latitude: 33.8869,
      longitude: 35.5131,
      address: 'Verdun',
      city: 'Beirut',
      region: 'Beirut'
    },
    requiredSkills: ['Electrical', 'Wiring', 'Installation'],
    duration: 6,
    budget: { min: 200, max: 350, currency: 'USD' },
    urgency: 'low',
    status: 'open',
    createdAt: new Date(),
  }
];

export default function JobsScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    skills: [] as string[],
    urgency: [] as string[],
    budgetRange: { min: 0, max: 1000 },
    location: '',
  });
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, activeFilters);
  };

  const applyFilters = (query: string, filters: typeof activeFilters) => {
    let filtered = jobs;

    // Search filter
    if (query.trim() !== '') {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.requiredSkills.some(skill => 
          skill.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(skill =>
          job.requiredSkills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Urgency filter
    if (filters.urgency.length > 0) {
      filtered = filtered.filter(job =>
        filters.urgency.includes(job.urgency)
      );
    }

    // Budget filter
    filtered = filtered.filter(job =>
      job.budget.min >= filters.budgetRange.min &&
      job.budget.max <= filters.budgetRange.max
    );

    // Location filter
    if (filters.location.trim() !== '') {
      filtered = filtered.filter(job =>
        job.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        job.location.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilterApply = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
    applyFilters(searchQuery, filters);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      skills: [],
      urgency: [],
      budgetRange: { min: 0, max: 1000 },
      location: '',
    };
    setActiveFilters(emptyFilters);
    applyFilters(searchQuery, emptyFilters);
  };

  const hasActiveFilters = () => {
    return activeFilters.skills.length > 0 ||
           activeFilters.urgency.length > 0 ||
           activeFilters.budgetRange.min > 0 ||
           activeFilters.budgetRange.max < 1000 ||
           activeFilters.location.trim() !== '';
  };

  const handleJobPress = (jobId: string) => {
    router.push({
      pathname: '/(tabs)/jobs/[id]',
      params: { id: jobId }
    });
  };

  const styles = createStyles(dimensions);

  const renderWorkerJobs = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('findJobs')}</Text>
          <TouchableOpacity style={styles.locationButton}>
            <MapPin size={isTablet ? 20 : 16} color={Colors.primary} />
            <Text style={styles.locationText}>Beirut</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={isTablet ? 24 : 20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, skills..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters() && styles.filterButtonActive]}
            onPress={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal size={isTablet ? 24 : 20} color={hasActiveFilters() ? Colors.white : Colors.primary} />
          </TouchableOpacity>
        </View>

        {hasActiveFilters() && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>Filters applied</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.jobsList}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredJobs.length} jobs found
            </Text>
          </View>

          {filteredJobs.map((job) => (
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

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        initialFilters={activeFilters}
      />
    </ScrollView>
  );

  const renderClientJobs = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Your Jobs</Text>
          <TouchableOpacity 
            style={styles.postJobButton}
            onPress={() => router.push('/(tabs)/jobs/post') as any}
          >
            <Plus size={isTablet ? 24 : 20} color={Colors.white} />
            <Text style={styles.postJobButtonText}>Post Job</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Draft</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.jobsList}>
          {jobs.map((job) => (
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

  const content = user.userType === 'worker' ? renderWorkerJobs() : renderClientJobs();

  return <ErrorBoundary>{content}</ErrorBoundary>;
}

const createStyles = (dimensions: any) => StyleSheet.create({
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
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: isTablet ? 24 : 16,
    paddingBottom: isTablet ? 28 : 20,
  },
  title: {
    fontSize: isTablet ? 28 : isLargeDevice ? 24 : isSmallDevice ? 20 : 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 10 : 6,
    borderRadius: isTablet ? 20 : 16,
    gap: 4,
  },
  locationText: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: isTablet ? 12 : 8,
    gap: 6,
  },
  postJobButtonText: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.white,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 28 : 20,
    gap: isTablet ? 16 : 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: isTablet ? 16 : 12,
  },
  searchInput: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.white,
    borderRadius: isTablet ? 12 : 8,
    padding: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isTablet ? 56 : 48,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 20 : 16,
  },
  activeFiltersText: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
  },
  clearFiltersText: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: isTablet ? 32 : 20,
    marginBottom: isTablet ? 28 : 20,
    gap: isTablet ? 12 : 8,
  },
  tab: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: Colors.backgroundSecondary,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.white,
  },
  jobsList: {
    paddingHorizontal: isTablet ? 32 : 20,
  },
  resultsHeader: {
    marginBottom: isTablet ? 20 : 16,
  },
  resultsCount: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
  },
});