import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '../../../utils/colors';

interface FriendMatchCardProps {
  colors: AppColors;
  isDark: boolean;
}

const FriendMatchCard: React.FC<FriendMatchCardProps> = memo(({ colors, isDark }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, opacity: isDark ? 0.6 : 1 }]}>
      <Image
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2yu5Qsf0vr3zdYDVK-ASmbtTE6OIUkTm5iWOFwvl1XmgzcQxp6mjPdHBlOS6Zhxi8AeSzOX7XIUX4TFbtVY-MgfMAB3kWTwgpjoOAlU86YU3PN9TkasEivi-ltZX3croXOsvwg5WF4H-o8VhyHbtXZKRQDn6Ee-PO0HK-ZqgrTErc6_2Beg3N8ANuf7SIteep_ApGw3WF4M3T8alEDfMUy1YsbP9o0NOq6DO1vjsW3Cv4LxKYx1U55k2UuPmTVZBIuCOK1LPCLlM' }}
        style={styles.bgImage}
      />
      <View style={styles.iconsContainer}>
        <MaterialIcons name="sports-cricket" size={144} color="rgba(0,0,0,0.1)" style={styles.mirroredIcon} />
        <MaterialIcons name="sports-cricket" size={144} color="rgba(0,0,0,0.1)" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, { color: colors.textMuted }]}>Friend Match</Text>
        <Text style={[styles.cardDesc, { color: colors.textMuted }]}>Play with friends locally or online.</Text>
      </View>
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(10,26,17,0.85)' : 'rgba(255,255,255,0.8)' }]}>
        <View style={styles.overlayContent}>
          <View style={[styles.lockCircle, { backgroundColor: colors.primary + '10' }]}>
            <MaterialIcons name="lock-clock" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.comingSoon, { color: isDark ? colors.primary : colors.textPrimary }]}>Coming Soon</Text>
          <Text style={[styles.devText, { color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary, fontWeight: isDark ? '500' : 'bold' }]}>
            Multiplayer mode is in development
          </Text>
        </View>
      </View>
    </View>
  );
});

FriendMatchCard.displayName = 'FriendMatchCard';
export default FriendMatchCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1, borderRadius: 32, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    height: 382, position: 'relative',
  },
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, resizeMode: 'cover' },
  iconsContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingTop: 16, paddingBottom: 16,
  },
  mirroredIcon: { transform: [{ scaleX: -1 }] },
  textContainer: { padding: 20, zIndex: 1 },
  cardTitle: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: 1 },
  cardDesc: { fontSize: 12, marginTop: 4 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  overlayContent: { alignItems: 'center', gap: 12 },
  lockCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  comingSoon: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: 1 },
  devText: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
});