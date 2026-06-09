import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useAppNavigation } from '../../navigation/types';
import { AVATAR_ICONS } from '../../utils/constants';
import { StatsGrid, BotMatchCard, FriendMatchCard } from './components';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const [selectedOvers, setSelectedOvers] = useState(1);
  const navigation = useAppNavigation();

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  const handleSelectOvers = useCallback((overs: number) => {
    setSelectedOvers(overs);
  }, []);

  const handlePlayNow = useCallback(() => {
    navigation.navigate('TossArena', { overs: selectedOvers });
  }, [navigation, selectedOvers]);

  if (!user) return null;

  const userAvatarIcon = user.avatar !== undefined && user.avatar >= 0 && user.avatar < 5
    ? AVATAR_ICONS[user.avatar]
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
              {userAvatarIcon ? (
                <View style={[styles.avatarInner, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialIcons name={userAvatarIcon as any} size={24} color={colors.primary} />
                </View>
              ) : (
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJdcvYai3dXGZ1XFOog2z_7GQ8Of8eY25wGZf2osLzSoVkcgmAmAqAUi7QhWb_MXKihG20Vkt0Y_S4YdFz8Nijc4aF5tM3ZOPlrPS7lcaprvFfsKCvR9J_EXC4FBcMbxm39gD9Im--Ns7ndQOBZ0DWHslaoEqaOKYUtaJhDh28Y8nDDmyt2pSP0FvzKcMU6zYO_FDzB8e0P-D3ql4u_Z9ywcib49dhAKi1_NM_KfdXqr0L_38QLSVIhIyrjI_ZQklZN_mMNPnwlSk' }}
                  style={styles.avatarImg}
                />
              )}
            </View>
            <View>
              <Text style={[styles.username, { color: colors.textPrimary }]}>{user.username}</Text>
              <Text style={[styles.league, { color: colors.primary }]}>Pro League</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.rulesBtn, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate('GameRules')}>
            <MaterialIcons name="menu-book" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <StatsGrid userId={user.userId} played={user.played} wins={user.wins} colors={colors} isDark={isDark} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <BotMatchCard
          selectedOvers={selectedOvers}
          onSelectOvers={handleSelectOvers}
          onPlayNow={handlePlayNow}
          colors={colors}
          isDark={isDark}
        />
        <FriendMatchCard colors={colors} isDark={isDark} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, overflow: 'hidden', padding: 1 },
  avatarInner: { width: '100%', height: '100%', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 18 },
  username: { fontSize: 14, fontWeight: 'bold' },
  league: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  rulesBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  scroll: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  scrollContent: { paddingBottom: 100, gap: 24 },
});