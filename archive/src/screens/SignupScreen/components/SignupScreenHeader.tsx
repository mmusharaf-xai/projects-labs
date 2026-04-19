import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppLogo } from '../../../components/shared';
import { colors } from '../../../utils/colors';
import { SCREEN_TITLES } from '../../../utils/constants';

const SignupScreenHeader: React.FC = memo(() => {
  return (
    <View style={styles.container}>
      <AppLogo size={64} />
      <Text style={styles.title}>{SCREEN_TITLES.signup}</Text>
      <Text style={styles.subtitle}>{SCREEN_TITLES.signupSubtitle}</Text>
    </View>
  );
});

SignupScreenHeader.displayName = 'SignupScreenHeader';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SignupScreenHeader;
