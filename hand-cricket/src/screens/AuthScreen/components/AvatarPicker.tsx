import React, { memo } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { AppColors } from '../../../utils/colors';
import { AVATARS } from '../../../utils/constants';

interface AvatarPickerProps {
  selectedAvatar: number;
  onSelect: (index: number) => void;
  colors: AppColors;
}

const AvatarPicker: React.FC<AvatarPickerProps> = memo(({ selectedAvatar, onSelect, colors }) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Choose Avatar</Text>
        <Text style={[styles.swipeHint, { color: colors.primary }]}>Swipe</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {AVATARS.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            style={styles.avatarBtn}
            onPress={() => onSelect(index)}
          >
            <View style={[styles.avatarOuter, {
              borderColor: selectedAvatar === index ? colors.primary : 'transparent',
              backgroundColor: colors.surface,
            }]}>
              <View style={[styles.avatarInner, {
                backgroundColor: selectedAvatar === index ? colors.primary + '20' : '#ffffff08',
              }]}>
                <MaterialIcons name={avatar.icon as any} size={36} color={selectedAvatar === index ? colors.primary : colors.textMuted} />
              </View>
            </View>
            {selectedAvatar === index ? (
              <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="check" size={12} color="white" />
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

AvatarPicker.displayName = 'AvatarPicker';
export default AvatarPicker;

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  swipeHint: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  scroll: { marginHorizontal: -8, paddingHorizontal: 8 },
  avatarBtn: { marginHorizontal: 8, marginVertical: 4 },
  avatarOuter: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, padding: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarInner: { width: '100%', height: '100%', borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  checkBadge: { position: 'absolute', top: -4, right: -4, borderRadius: 8, padding: 2 },
});