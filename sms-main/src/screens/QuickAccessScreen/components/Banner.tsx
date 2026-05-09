import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../utils/colors';
import { BannerConfig } from '../../../services/uiConfigService';

interface BannerProps {
  config: BannerConfig;
  onButtonPress: (route?: string) => void;
}

const Banner: React.FC<BannerProps> = memo(({ config, onButtonPress }) => {
  const handlePress = useCallback(() => {
    onButtonPress(config.buttonRoute);
  }, [config.buttonRoute, onButtonPress]);

  return (
    <View style={styles.bannerContainer}>
      <LinearGradient
        colors={['#3b82f6', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.bannerTitle}>{config.title}</Text>
        <Text style={styles.bannerSubtitle}>{config.subtitle}</Text>
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <Text style={styles.bannerButtonText}>{config.buttonText}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
});

Banner.displayName = 'Banner';

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 8,
  },
  bannerButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
});

export default Banner;
