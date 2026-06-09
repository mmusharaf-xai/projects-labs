import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '../../../utils/colors';

interface StatsGridProps {
  userId?: number;
  played?: number;
  wins?: number;
  colors: AppColors;
  isDark: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = memo(({ userId, played, wins, colors, isDark }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>User ID</Text>
        <Text style={[styles.value, { color: isDark ? colors.primary : colors.textPrimary }]}>#{userId}</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Played</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{played}</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Wins</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{wins}</Text>
      </View>
    </View>
  );
});

StatsGrid.displayName = 'StatsGrid';
export default StatsGrid;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1, borderWidth: 1, borderRadius: 16, padding: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  label: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 14, fontWeight: '900' },
});