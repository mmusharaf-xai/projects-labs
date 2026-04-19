import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatsGrid, QuickActions, Banner, QuickAccessSkeleton } from './components';
import { SchoolSidebar } from '../../components/sidebar';
import { colors } from '../../utils/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUIConfig,
  UIComponent,
} from '../../services/uiConfigService';
import { getUserSchoolRole } from '../../services/sidebarService';

type QuickAccessScreenProps = NativeStackScreenProps<RootStackParamList, 'QuickAccess'>;

const QuickAccessScreen: React.FC<QuickAccessScreenProps> = memo(({ route, navigation }) => {
  const { schoolId, schoolName } = route.params || {};
  const { currentUser, currentUserId } = useAuth();
  const [components, setComponents] = useState<UIComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userRole, setUserRole] = useState<string>('owner');
  const [hasAccess, setHasAccess] = useState<boolean>(true);

  const fetchConfig = useCallback(async () => {
    if (!schoolId) {
      setError('School ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    const result = await fetchUIConfig('quick_access', schoolId);

    if (result.success && result.components) {
      const sorted = result.components.sort((a, b) => a.order - b.order);
      setComponents(sorted);
    } else {
      setError(result.error || 'Failed to load page');
    }

    setLoading(false);
  }, [schoolId]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!schoolId || !currentUserId) {
        setHasAccess(false);
        return;
      }
      
      const role = await getUserSchoolRole(schoolId, currentUserId);
      if (role) {
        setUserRole(role);
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    };
    
    checkAccess();
  }, [schoolId, currentUserId]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleMenuPress = useCallback(() => {
    setSidebarVisible(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const handleNavigate = useCallback((routeName: string, params?: any) => {
    if (routeName === 'QuickAccess') {
      return;
    }
    if (routeName === 'SchoolSettings') {
      navigation.navigate('SchoolSettings', params);
      return;
    }
    if (routeName === 'Staffs') {
      navigation.navigate('Staffs', params);
      return;
    }
  }, [navigation]);

  const handleBackToSchools = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('AccountSettings');
  }, [navigation]);

  const handleActionPress = useCallback((routeName?: string) => {
    if (routeName) {
      handleNavigate(routeName);
    }
  }, [handleNavigate]);

  const renderComponent = useCallback((component: UIComponent) => {
    switch (component.type) {
      case 'stats_grid':
        return <StatsGrid config={component.config as any} />;
      case 'quick_actions':
        return <QuickActions config={component.config as any} onActionPress={handleActionPress} />;
      case 'banner':
        return <Banner config={component.config as any} onButtonPress={handleActionPress} />;
      default:
        return null;
    }
  }, [handleActionPress]);

  if (!hasAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noAccessContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.textMuted} />
          <Text style={styles.noAccessTitle}>Access Denied</Text>
          <Text style={styles.noAccessText}>
            You don't have permission to access this school. Please contact the school administrator.
          </Text>
          <TouchableOpacity
            style={styles.backToSchoolsButton}
            onPress={handleBackToSchools}
          >
            <Text style={styles.backToSchoolsButtonText}>Back to My Schools</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <>
        <QuickAccessSkeleton />
        <SchoolSidebar
          isVisible={sidebarVisible}
          onClose={handleCloseSidebar}
          schoolId={schoolId || 0}
          userRole={userRole}
          currentRoute="QuickAccess"
          onNavigate={handleNavigate}
          onBackToSchools={handleBackToSchools}
        />
      </>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConfig}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <SchoolSidebar
          isVisible={sidebarVisible}
          onClose={handleCloseSidebar}
          schoolId={schoolId || 0}
          userRole={userRole}
          currentRoute="QuickAccess"
          onNavigate={handleNavigate}
          onBackToSchools={handleBackToSchools}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleMenuPress} style={styles.headerButton}>
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {schoolName || 'School'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleProfilePress}>
            {currentUser?.avatar ? (
              <Image
                source={{ uri: currentUser.avatar }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitials}>
                  {currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {components.map((component) => (
          <View key={component.id}>{renderComponent(component)}</View>
        ))}
      </ScrollView>

      <SchoolSidebar
        isVisible={sidebarVisible}
        onClose={handleCloseSidebar}
        schoolId={schoolId || 0}
        userRole={userRole}
        currentRoute="QuickAccess"
        onNavigate={handleNavigate}
        onBackToSchools={handleBackToSchools}
      />
    </SafeAreaView>
  );
});

QuickAccessScreen.displayName = 'QuickAccessScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.schoolNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.schoolAccent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  noAccessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  noAccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
  },
  noAccessText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  backToSchoolsButton: {
    backgroundColor: colors.schoolNavy,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  backToSchoolsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});

export default QuickAccessScreen;
