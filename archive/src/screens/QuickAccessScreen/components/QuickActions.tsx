import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuickActionCard from './QuickActionCard';
import { QuickActionItem } from '../../../services/uiConfigService';

interface QuickActionsProps {
  config: { title: string; items: QuickActionItem[] };
  onActionPress: (route?: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = memo(({ config, onActionPress }) => {
  return (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>{config.title}</Text>
      <View style={styles.actionList}>
        {config.items.map((item) => (
          <QuickActionCard key={item.id} item={item} onPress={onActionPress} />
        ))}
      </View>
    </View>
  );
});

QuickActions.displayName = 'QuickActions';

const styles = StyleSheet.create({
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: require('../../../utils/colors').colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  actionList: {
    gap: 12,
  },
});

export default QuickActions;
