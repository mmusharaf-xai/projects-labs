import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../../../components/shared/Skeleton';

const StaffCardSkeleton: React.FC = memo(() => (
  <View style={styles.staffCard}>
    <View style={styles.avatarContainer}>
      <Skeleton width={52} height={52} borderRadius={26} />
      <View style={styles.statusDot} />
    </View>
    <View style={styles.staffInfo}>
      <Skeleton width={140} height={18} borderRadius={4} />
      <View style={{ marginTop: 6 }}>
        <Skeleton width={180} height={14} borderRadius={4} />
      </View>
      <View style={{ marginTop: 6 }}>
        <Skeleton width={100} height={12} borderRadius={4} />
      </View>
    </View>
    <Skeleton width={28} height={28} borderRadius={14} />
  </View>
));

StaffCardSkeleton.displayName = 'StaffCardSkeleton';

const styles = StyleSheet.create({
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: require('../../../utils/colors').colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: require('../../../utils/colors').colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: require('../../../utils/colors').colors.white,
  },
  staffInfo: {
    flex: 1,
    minWidth: 0,
  },
});

export default StaffCardSkeleton;
