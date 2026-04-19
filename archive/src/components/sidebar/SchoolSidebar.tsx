import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import Skeleton from '../shared/Skeleton';
import {
  fetchSidebarConfig,
  SidebarMenuItem,
  SidebarConfig,
} from '../../services/sidebarService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

// Menu Item Component
interface MenuItemProps {
  item: SidebarMenuItem;
  isActive: boolean;
  onPress: (item: SidebarMenuItem) => void;
}

const MenuItem: React.FC<MenuItemProps> = memo(({ item, isActive, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
        <Ionicons
          name={item.icon as any}
          size={22}
          color={isActive ? colors.white : colors.textSecondary}
        />
      </View>
      <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
});

MenuItem.displayName = 'MenuItem';

// Sidebar Skeleton Component
const SidebarSkeleton: React.FC = memo(() => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Skeleton */}
      <View style={styles.schoolHeader}>
        <Skeleton width={48} height={48} borderRadius={12} />
        <View style={styles.schoolInfo}>
          <Skeleton width={120} height={18} borderRadius={6} />
          <View style={{ marginTop: 6 }}>
            <Skeleton width={100} height={14} borderRadius={6} />
          </View>
        </View>
      </View>

      {/* Menu Items Skeleton */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <View key={i} style={styles.menuItem}>
            <Skeleton width={36} height={36} borderRadius={10} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Skeleton width={100} height={16} borderRadius={6} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Button Skeleton */}
      <View style={styles.bottomContainer}>
        <Skeleton width="100%" height={50} borderRadius={12} />
      </View>
    </SafeAreaView>
  );
});

SidebarSkeleton.displayName = 'SidebarSkeleton';

// Error Component
const ErrorState: React.FC<{ error: string }> = memo(({ error }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  </SafeAreaView>
));

ErrorState.displayName = 'ErrorState';

interface SchoolSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  schoolId: number;
  userRole: string;
  currentRoute: string;
  onNavigate: (route: string, params?: any) => void;
  onBackToSchools: () => void;
}

const SchoolSidebar: React.FC<SchoolSidebarProps> = ({
  isVisible,
  onClose,
  schoolId,
  userRole,
  currentRoute,
  onNavigate,
  onBackToSchools,
}) => {
  const [config, setConfig] = useState<SidebarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Fetch sidebar config
  const loadConfig = useCallback(async () => {
    if (!isVisible) return;
    
    setLoading(true);
    setError(null);
    
    const result = await fetchSidebarConfig(schoolId, userRole);
    
    if (result.success && result.config) {
      setConfig(result.config);
    } else {
      setError(result.error || 'Failed to load sidebar');
    }
    
    setLoading(false);
  }, [isVisible, schoolId, userRole]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Handle open/close animations
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Pan responder for swipe to close
  const panResponder = useMemo(() => 
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx < -10 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(-SIDEBAR_WIDTH, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SIDEBAR_WIDTH * 0.3 || gestureState.vx < -0.5) {
          onClose();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    }),
  [onClose]);

  const handleMenuItemPress = useCallback((item: SidebarMenuItem) => {
    onClose();
    setTimeout(() => {
      onNavigate(item.route, { schoolId, schoolName: config?.schoolName });
    }, 150);
  }, [onClose, onNavigate, schoolId, config?.schoolName]);

  const handleBackToSchoolsPress = useCallback(() => {
    onClose();
    setTimeout(() => {
      onBackToSchools();
    }, 150);
  }, [onClose, onBackToSchools]);

  const handleOverlayPress = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderMenuItem = useCallback((item: SidebarMenuItem) => (
    <MenuItem
      key={item.id}
      item={item}
      isActive={currentRoute === item.route}
      onPress={handleMenuItemPress}
    />
  ), [currentRoute, handleMenuItemPress]);

  const schoolName = config?.schoolName || 'Loading...';

  if (!isVisible && !config) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayOpacity },
          ]}
        >
          <Pressable style={styles.overlayPressable} onPress={handleOverlayPress} />
        </Animated.View>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX }] },
          ]}
          {...panResponder.panHandlers}
        >
          {loading ? (
            <SidebarSkeleton />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <SafeAreaView style={styles.safeArea}>
              {/* School Header */}
              <View style={styles.schoolHeader}>
                <View style={styles.logoContainer}>
                  <Ionicons name="school" size={24} color={colors.white} />
                </View>
                <View style={styles.schoolInfo}>
                  <Text style={styles.appName}>EduManager</Text>
                  <Text style={styles.schoolNameText}>{schoolName}</Text>
                </View>
              </View>

              <ScrollView
                style={styles.menuContainer}
                showsVerticalScrollIndicator={false}
              >
                {config?.items.map(renderMenuItem)}
              </ScrollView>

              {/* Bottom Button */}
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackToSchoolsPress}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
                  <Text style={styles.backButtonText}>Back to My Schools</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayPressable: {
    flex: 1,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: colors.white,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  safeArea: {
    flex: 1,
  },
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.schoolNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolInfo: {
    marginLeft: 12,
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  schoolNameText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: colors.schoolNavy,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  menuLabelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default SchoolSidebar;
