import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '../../../utils/colors';
import { OVERS_OPTIONS } from '../../../utils/constants';

interface BotMatchCardProps {
  selectedOvers: number;
  onSelectOvers: (overs: number) => void;
  onPlayNow: () => void;
  colors: AppColors;
  isDark: boolean;
}

const BotMatchCard: React.FC<BotMatchCardProps> = memo(({ selectedOvers, onSelectOvers, onPlayNow, colors, isDark }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc5MWFyJCFXbdfU9goPJ_WWFFGwuHOn3LY3MnX-CCj5BDcfxwqJ2eVmthpa-MtBtVQ2JKIcPGg3kVZtGexdzTvSznKhUJ064lIuKDGKUfFxHDTzrY0Kd-oNXieskKBiQZ-wThDCWEBpb-VyjNfsw2TIC1RexgjoFJ6D4U9lU0WiNB-mOnDPz9KArNrbM_sEaS9QShRmMCf3XxJKX_8JnCUd35JIcCcaEwFy0CzGRMSqkZFdGjO4nJhwPGyIaBax3ZI2Lp4Btn7DYE' }}
        style={styles.imageBg}
      >
        <LinearGradient
          colors={['transparent', isDark ? 'rgba(10,26,17,0.9)' : 'rgba(255,255,255,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.textPrimary }]}>Solo Play</Text>
          </View>
        </View>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Bot Match</Text>
      </ImageBackground>
      <View style={styles.content}>
        <View style={styles.oversSection}>
          <Text style={[styles.oversLabel, { color: colors.textMuted }]}>Select Match Duration</Text>
          <View style={styles.oversRow}>
            {OVERS_OPTIONS.map((overs) => (
              <TouchableOpacity
                key={overs}
                onPress={() => onSelectOvers(overs)}
                style={[
                  styles.oversBtn,
                  {
                    backgroundColor: selectedOvers === overs ? colors.primary : colors.surfaceBorder,
                    borderColor: selectedOvers === overs ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text style={[styles.oversBtnText, { color: selectedOvers === overs ? colors.textPrimary : colors.textSecondary }]}>
                  {overs} OVER{overs > 1 ? 'S' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={[styles.playBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={onPlayNow}>
          <Text style={[styles.playBtnText, { color: colors.textPrimary }]}>Play Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

BotMatchCard.displayName = 'BotMatchCard';
export default BotMatchCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1, borderRadius: 32, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  imageBg: { height: 176, justifyContent: 'flex-end', padding: 16 },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 100 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  cardTitle: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: 1 },
  content: { padding: 20, gap: 20 },
  oversSection: { gap: 12 },
  oversLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  oversRow: { flexDirection: 'row', gap: 8 },
  oversBtn: { flex: 1, height: 48, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  oversBtnText: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  playBtn: {
    width: '100%', height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  playBtnText: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
});