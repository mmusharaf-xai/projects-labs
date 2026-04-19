import React, { useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';
import { StaffMember } from '../../../services/staffService';

interface StaffCardProps {
  staff: StaffMember;
  onPress: (staff: StaffMember) => void;
  onEditPress: (staff: StaffMember) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return '#22c55e';
    case 'inactive':
      return '#9ca3af';
    case 'pending':
      return '#f59e0b';
    default:
      return '#22c55e';
  }
};

const StaffCard: React.FC<StaffCardProps> = memo(({ staff, onPress, onEditPress }) => {
  const handlePress = useCallback(() => {
    onPress(staff);
  }, [staff, onPress]);

  const handleEditPress = useCallback(() => {
    onEditPress(staff);
  }, [staff, onEditPress]);

  const statusDotStyle = useMemo(() => [
    styles.statusDot,
    { backgroundColor: getStatusColor(staff.status) }
  ], [staff.status]);

  const initials = useMemo(() => {
    return staff.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [staff.fullName]);

  return (
    <TouchableOpacity
      style={styles.staffCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {staff.avatar ? (
          <Image source={{ uri: staff.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        )}
        <View style={statusDotStyle} />
      </View>

      <View style={styles.staffInfo}>
        <Text style={styles.staffName} numberOfLines={1}>
          {staff.fullName}
        </Text>
        <Text style={styles.staffRole} numberOfLines={1}>
          {staff.role}
        </Text>
        <Text style={styles.staffId}>{staff.staffId}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="pencil" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

StaffCard.displayName = 'StaffCard';

const styles = StyleSheet.create({
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    backgroundColor: colors.schoolNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  staffInfo: {
    flex: 1,
    minWidth: 0,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  staffRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  staffId: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  editButton: {
    padding: 6,
  },
});

export default StaffCard;
