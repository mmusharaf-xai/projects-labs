import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '../../../utils/colors';
import { AVATARS } from '../../../utils/constants';

interface AvatarSectionProps {
  selectedAvatar: number;
  onSelect: (index: number) => void;
  colors: AppColors;
}

const boldWeight = Platform.OS === 'ios' ? '600' : 'bold';

const AvatarSection: React.FC<AvatarSectionProps> = memo(({ selectedAvatar, onSelect, colors }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted, fontWeight: boldWeight as any }]}>Your Avatar</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {AVATARS.map((avatar, index) => (
          <TouchableOpacity key={index} onPress={() => onSelect(index)} style={styles.avatarBtn}>
            <View style={[styles.avatarOuter, {
              borderWidth: selectedAvatar === index ? 3 : 1,
              borderColor: selectedAvatar === index ? colors.primary : colors.surfaceBorder,
              backgroundColor: colors.surface,
            }]}>
              <View style={[styles.avatarInner, {
                backgroundColor: selectedAvatar === index ? colors.primary + '20' : colors.surface,
              }]}>
                <MaterialIcons name={avatar.icon as any} size={36} color={selectedAvatar === index ? colors.primary : colors.textMuted} />
              </View>
            </View>
            {selectedAvatar === index ? (
              <Text style={[styles.activeLabel, { color: colors.primary, fontWeight: boldWeight as any }]}>Active</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

AvatarSection.displayName = 'AvatarSection';
export default AvatarSection;

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  scroll: { marginHorizontal: -24, paddingHorizontal: 24 },
  avatarBtn: { marginRight: 16, alignItems: 'center' },
  avatarOuter: { width: 80, height: 80, borderRadius: 40, padding: 2, alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: '100%', height: '100%', borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  activeLabel: { fontSize: 9, textTransform: 'uppercase', marginTop: 4 },
});