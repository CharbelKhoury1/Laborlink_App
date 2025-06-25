import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Skill } from '@/types';

interface SkillChipProps {
  skill: Skill;
  onRemove?: () => void;
  readonly?: boolean;
}

export default function SkillChip({ skill, onRemove, readonly = false }: SkillChipProps) {
  const getExperienceColor = () => {
    switch (skill.experience) {
      case 'beginner':
        return Colors.info;
      case 'intermediate':
        return Colors.warning;
      case 'expert':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { borderColor: getExperienceColor() }]}>
      <Text style={[styles.skillName, { color: getExperienceColor() }]}>
        {skill.name}
      </Text>
      {skill.verified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>✓</Text>
        </View>
      )}
      {!readonly && onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <X size={14} color={Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    margin: 2,
  },
  skillName: {
    fontSize: 12,
    fontWeight: '500',
  },
  verifiedBadge: {
    marginLeft: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: 'bold',
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
});