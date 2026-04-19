import React, { useMemo, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';
import { StatsItem } from '../../../services/uiConfigService';

interface StatsCardProps {
  item: StatsItem;
}

const CARD_WIDTH = (require('react-native').Dimensions.get('window').width - 48 - 12) / 2;

const StatsCard: React.FC<StatsCardProps> = memo(({ item }) => {
  const iconContainerStyle = useMemo(() => ({
    ...styles.iconContainer,
    backgroundColor: `${item.color}15`,
  }), [item.color]);

  return (
    <View style={styles.statsCard}>
      <View style={iconContainerStyle}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.statsValue}>{item.value}</Text>
      <Text style={styles.statsLabel}>{item.label}</Text>
    </View>
  );
});

StatsCard.displayName = 'StatsCard';

const styles = StyleSheet.create({
  statsCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});

export default StatsCard;
