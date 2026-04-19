import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from '../../../components/shared/Skeleton';

const QuickAccessSkeleton: React.FC = memo(() => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={180} height={24} borderRadius={12} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      <View style={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Skeleton width={140} height={32} borderRadius={8} />
          <View style={{ marginTop: 8 }}>
            <Skeleton width={280} height={16} borderRadius={8} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.statsCard}>
              <Skeleton width={48} height={48} borderRadius={12} />
              <View style={{ marginTop: 12 }}>
                <Skeleton width={60} height={28} borderRadius={6} />
              </View>
              <View style={{ marginTop: 4 }}>
                <Skeleton width={80} height={14} borderRadius={6} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quickActionsSection}>
          <Skeleton width={120} height={16} borderRadius={6} />
          <View style={styles.actionList}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.actionCard}>
                <Skeleton width={48} height={48} borderRadius={12} />
                <View style={styles.actionTextContainer}>
                  <Skeleton width={160} height={18} borderRadius={6} />
                  <View style={{ marginTop: 4 }}>
                    <Skeleton width={220} height={14} borderRadius={6} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bannerContainer}>
          <Skeleton width="100%" height={140} borderRadius={16} />
        </View>
      </View>
    </SafeAreaView>
  );
});

QuickAccessSkeleton.displayName = 'QuickAccessSkeleton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: require('../../../utils/colors').colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: require('../../../utils/colors').colors.white,
    borderBottomWidth: 1,
    borderBottomColor: require('../../../utils/colors').colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statsCard: {
    width: (require('react-native').Dimensions.get('window').width - 48 - 12) / 2,
    backgroundColor: require('../../../utils/colors').colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  actionList: {
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: require('../../../utils/colors').colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});

export default QuickAccessSkeleton;
