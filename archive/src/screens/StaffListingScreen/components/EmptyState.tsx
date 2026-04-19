import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';

interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState: React.FC<EmptyStateProps> = memo(({ searchQuery }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="people-outline" size={48} color={colors.textMuted} />
    <Text style={styles.emptyTitle}>No staff found</Text>
    <Text style={styles.emptyText}>
      {searchQuery ? 'Try a different search term' : 'Add your first staff member'}
    </Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default EmptyState;
