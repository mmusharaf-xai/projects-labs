import React, { memo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '../../../utils/colors';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  colors: AppColors;
}

const boldWeight = Platform.OS === 'ios' ? '600' : 'bold';

const ThemeToggle: React.FC<ThemeToggleProps> = memo(({ isDark, onToggle, colors }) => {
  const switchAnim = useRef(new Animated.Value(isDark ? 26 : 2)).current;

  useEffect(() => {
    Animated.timing(switchAnim, {
      toValue: isDark ? 26 : 2,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isDark, switchAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceBorder }]}>
          <MaterialIcons name="dark-mode" size={24} color={colors.textMuted} />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textPrimary, fontWeight: boldWeight as any }]}>Dark Mode</Text>
          <Text style={[styles.sublabel, { color: colors.textMuted }]}>Currently {isDark ? 'enabled' : 'disabled'}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onToggle}>
        <View style={[styles.track, { backgroundColor: isDark ? colors.primary : colors.surfaceBorder }]}>
          <Animated.View style={[styles.thumb, { left: switchAnim }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
export default ThemeToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 40,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 16 },
  sublabel: { fontSize: 10 },
  track: { width: 48, height: 24, borderRadius: 12, position: 'relative' },
  thumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'white', position: 'absolute', top: 2 },
});