import React, { useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';
import { QuickActionItem } from '../../../services/uiConfigService';

interface QuickActionCardProps {
  item: QuickActionItem;
  onPress: (route?: string) => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = memo(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item.route);
  }, [item.route, onPress]);

  const iconContainerStyle = useMemo(() => {
    const baseStyle = styles.actionIconContainer;
    const bgColorStyle = { backgroundColor: item.iconBgColor };
    const primaryStyle = item.variant === 'primary' ? styles.actionIconContainerPrimary : null;
    return [baseStyle, bgColorStyle, primaryStyle];
  }, [item.iconBgColor, item.variant]);

  const isPrimary = item.variant === 'primary';

  return (
    <TouchableOpacity
      style={[styles.actionCard, isPrimary && styles.actionCardPrimary]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={iconContainerStyle}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={isPrimary ? '#fff' : '#3b82f6'}
        />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={[styles.actionTitle, isPrimary && styles.actionTitlePrimary]}>
          {item.title}
        </Text>
        <Text style={[styles.actionSubtitle, isPrimary && styles.actionSubtitlePrimary]}>
          {item.subtitle}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isPrimary ? 'rgba(255,255,255,0.6)' : '#94a3b8'}
      />
    </TouchableOpacity>
  );
});

QuickActionCard.displayName = 'QuickActionCard';

const styles = StyleSheet.create({
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  actionCardPrimary: {
    backgroundColor: colors.schoolNavy,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconContainerPrimary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionTitlePrimary: {
    color: colors.white,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionSubtitlePrimary: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default QuickActionCard;
