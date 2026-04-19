import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';
import { School, UserSchool } from '../../../../db/schema';

interface UserSchoolWithSchool extends UserSchool {
  school: School;
}

interface SchoolItemProps {
  item: UserSchoolWithSchool;
  onPress: (school: School) => void;
}

const SchoolItem: React.FC<SchoolItemProps> = memo(({ item, onPress }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSchoolYear = (createdAt: string | undefined) => {
    if (!createdAt) return new Date().getFullYear();
    return new Date(createdAt).getFullYear();
  };

  const handlePress = useCallback(() => {
    onPress(item.school);
  }, [item.school, onPress]);

  return (
    <TouchableOpacity
      style={styles.schoolItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.schoolAvatar}>
        <Text style={styles.schoolInitials}>{getInitials(item.school.name)}</Text>
      </View>
      <View style={styles.schoolInfo}>
        <Text style={styles.schoolName} numberOfLines={1}>
          {item.school.name}
        </Text>
        <Text style={styles.schoolMeta} numberOfLines={1}>
          {item.role.charAt(0).toUpperCase() + item.role.slice(1)} • Since {getSchoolYear(item.school.createdAt)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
});

SchoolItem.displayName = 'SchoolItem';

const styles = StyleSheet.create({
  schoolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  schoolAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  schoolInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.schoolAccent,
  },
  schoolInfo: {
    flex: 1,
    marginRight: 8,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  schoolMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export type { UserSchoolWithSchool };
export default SchoolItem;
