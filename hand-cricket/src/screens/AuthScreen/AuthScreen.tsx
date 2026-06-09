import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { AuthForm } from './components';

export default function AuthScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <MaterialIcons name="sports-cricket" size={36} color="white" />
        </View>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>HandCricket</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Enter the digital arena</Text>
      </View>

      <AuthForm />

      {/* Bottom indicator */}
      <View style={styles.bottomIndicator}>
        <View style={styles.bottomBar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginTop: 24, paddingHorizontal: 24 },
  logoCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.4, shadowRadius: 20,
  },
  appName: { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  tagline: { fontSize: 10, marginTop: 2 },
  bottomIndicator: { alignItems: 'center', paddingBottom: 8 },
  bottomBar: { width: 128, height: 4, backgroundColor: '#ffffff20', borderRadius: 2 },
});