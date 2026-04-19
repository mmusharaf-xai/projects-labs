import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatsCard from './StatsCard';
import { StatsItem } from '../../../services/uiConfigService';

interface StatsGridProps {
  config: { title: string; subtitle: string; items: StatsItem[] };
}

const StatsGrid: React.FC<StatsGridProps> = memo(({ config }) => {
  return (
    <View>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
      </View>

      <View style={styles.statsGrid}>
        {config.items.map((item) => (
          <StatsCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
});

StatsGrid.displayName = 'StatsGrid';

const styles = StyleSheet.create({
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: require('../../../utils/colors').colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: require('../../../utils/colors').colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
});

export default StatsGrid;
