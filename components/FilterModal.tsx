import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { X, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

interface FilterState {
  skills: string[];
  urgency: string[];
  budgetRange: { min: number; max: number };
  location: string;
}

const SKILL_OPTIONS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
  'Gardening', 'Moving', 'Delivery', 'Repair', 'Installation'
];

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
];

export default function FilterModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleUrgency = (urgency: string) => {
    setFilters(prev => ({
      ...prev,
      urgency: prev.urgency.includes(urgency)
        ? prev.urgency.filter(u => u !== urgency)
        : [...prev.urgency, urgency]
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const clearAll = () => {
    setFilters({
      skills: [],
      urgency: [],
      budgetRange: { min: 0, max: 1000 },
      location: '',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Skills Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.optionsContainer}>
              {SKILL_OPTIONS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.option,
                    filters.skills.includes(skill) && styles.selectedOption
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.skills.includes(skill) && styles.selectedOptionText
                    ]}
                  >
                    {skill}
                  </Text>
                  {filters.skills.includes(skill) && (
                    <Check size={16} color={Colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Urgency Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority Level</Text>
            <View style={styles.optionsContainer}>
              {URGENCY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    filters.urgency.includes(option.value) && styles.selectedOption
                  ]}
                  onPress={() => toggleUrgency(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.urgency.includes(option.value) && styles.selectedOptionText
                    ]}
                  >
                    {option.label}
                  </Text>
                  {filters.urgency.includes(option.value) && (
                    <Check size={16} color={Colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Range (USD)</Text>
            <View style={styles.budgetContainer}>
              <View style={styles.budgetInputContainer}>
                <Text style={styles.budgetLabel}>Min</Text>
                <TextInput
                  style={styles.budgetInput}
                  value={filters.budgetRange.min.toString()}
                  onChangeText={(text) => setFilters(prev => ({
                    ...prev,
                    budgetRange: { ...prev.budgetRange, min: parseInt(text) || 0 }
                  }))}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.budgetInputContainer}>
                <Text style={styles.budgetLabel}>Max</Text>
                <TextInput
                  style={styles.budgetInput}
                  value={filters.budgetRange.max.toString()}
                  onChangeText={(text) => setFilters(prev => ({
                    ...prev,
                    budgetRange: { ...prev.budgetRange, max: parseInt(text) || 1000 }
                  }))}
                  keyboardType="numeric"
                  placeholder="1000"
                />
              </View>
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TextInput
              style={styles.locationInput}
              value={filters.location}
              onChangeText={(text) => setFilters(prev => ({ ...prev, location: text }))}
              placeholder="Enter city or area"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  clearText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: Colors.white,
  },
  budgetContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  budgetInputContainer: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});