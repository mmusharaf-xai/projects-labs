import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StaffCard, StaffCardSkeleton, EmptyState } from './components';
import { colors } from '../../utils/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import { SchoolSidebar } from '../../components/sidebar';
import Skeleton from '../../components/shared/Skeleton';
import SearchBar from '../../components/shared/SearchBar';
import {
  getSchoolStaffs,
  checkStaffAccess,
  StaffMember,
} from '../../services/staffService';
import { getUserSchoolRole } from '../../services/sidebarService';

type Props = NativeStackScreenProps<RootStackParamList, 'Staffs'>;

const StaffListingScreen: React.FC<Props> = memo(({ route, navigation }) => {
  const { schoolId, schoolName } = route.params;
  const { currentUserId } = useAuth();
  const isFocused = useIsFocused();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userRole, setUserRole] = useState<string>('owner');
  const [hasAccess, setHasAccess] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const pageSize = 10;
  const initialFocusRef = React.useRef(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUserId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const role = await getUserSchoolRole(schoolId, currentUserId);
      if (role) {
        setUserRole(role);
      }

      const access = await checkStaffAccess(schoolId, currentUserId);
      setHasAccess(access.hasAccess);
      if (!access.hasAccess) {
        setLoading(false);
      }
    };

    checkAccess();
  }, [schoolId, currentUserId]);

  const fetchStaff = useCallback(
    async (page: number, search: string, isRefresh = false) => {
      if (!hasAccess) return;

      if (isRefresh) {
        setRefreshing(true);
      } else if (page === 1) {
        setLoading(true);
      }
      setError(undefined);

      const result = await getSchoolStaffs(schoolId, {
        search,
        page,
        pageSize,
      });

      if (result.success && result.staff) {
        setStaff(result.staff);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
        setCurrentPage(page);
      } else {
        setError(result.error || 'Failed to load staff');
      }

      setLoading(false);
      setRefreshing(false);
    },
    [schoolId, hasAccess]
  );

  useEffect(() => {
    if (hasAccess) {
      fetchStaff(1, searchQuery);
    }
  }, [hasAccess, fetchStaff, searchQuery]);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  useEffect(() => {
    if (isFocused && !initialFocusRef.current && hasAccess) {
      fetchStaff(1, searchQuery);
    }
    initialFocusRef.current = false;
  }, [isFocused, hasAccess, searchQuery, fetchStaff]);

  const handleMenuPress = useCallback(() => setSidebarVisible(true), []);
  const handleCloseSidebar = useCallback(() => setSidebarVisible(false), []);

  const handleNavigate = useCallback((routeName: string, params?: any) => {
    if (routeName === 'Staffs') return;
    if (routeName === 'SchoolSettings') {
      navigation.navigate('SchoolSettings', params);
    }
  }, [navigation]);

  const handleBackToSchools = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }, [navigation]);

  const handleStaffPress = useCallback((staffMember: StaffMember) => {
    Alert.alert('Staff Details', `Viewing details for ${staffMember.fullName}`);
  }, []);

  const handleEditPress = useCallback((staffMember: StaffMember) => {
    Alert.alert('Edit Staff', `Editing ${staffMember.fullName}`);
  }, []);

  const handleAddStaff = useCallback(() => {
    navigation.navigate('AddStaff', { schoolId, schoolName });
  }, [navigation, schoolId, schoolName]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchStaff(page, searchQuery);
    }
  }, [totalPages, fetchStaff, searchQuery]);

  const handleRefresh = useCallback(() => {
    fetchStaff(currentPage, searchQuery, true);
  }, [fetchStaff, currentPage, searchQuery]);

  const handleFilterPress = useCallback(() => {
    Alert.alert('Filter', 'Filter coming soon');
  }, []);

  const renderStaffItem = useCallback(({ item }: { item: StaffMember }) => (
    <StaffCard staff={item} onPress={handleStaffPress} onEditPress={handleEditPress} />
  ), [handleStaffPress, handleEditPress]);

  const keyExtractor = useCallback((item: StaffMember) => item.id.toString(), []);

  const renderEmpty = useCallback(() => (
    <EmptyState searchQuery={searchQuery} />
  ), [searchQuery]);

  const paginationComponent = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Ionicons name="chevron-back" size={18} color={currentPage === 1 ? colors.textMuted : colors.textPrimary} />
        </TouchableOpacity>

        {pages.map((p, idx) =>
          typeof p === 'number' ? (
            <TouchableOpacity
              key={idx}
              style={[styles.pageNumber, p === currentPage && styles.pageNumberActive]}
              onPress={() => handlePageChange(p)}
            >
              <Text style={[styles.pageNumberText, p === currentPage && styles.pageNumberTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text key={idx} style={styles.pageEllipsis}>...</Text>
          )
        )}

        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? colors.textMuted : colors.textPrimary} />
        </TouchableOpacity>
      </View>
    );
  }, [totalPages, currentPage, handlePageChange]);

  if (!hasAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noAccessContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.textMuted} />
          <Text style={styles.noAccessTitle}>Access Denied</Text>
          <Text style={styles.noAccessText}>
            You don't have permission to view staff for this school.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToSchools}>
            <Text style={styles.backButtonText}>Back to My Schools</Text>
          </TouchableOpacity>
        </View>
        <SchoolSidebar
          isVisible={sidebarVisible}
          onClose={handleCloseSidebar}
          schoolId={schoolId}
          userRole={userRole}
          currentRoute="Staffs"
          onNavigate={handleNavigate}
          onBackToSchools={handleBackToSchools}
        />
      </SafeAreaView>
    );
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleMenuPress} style={styles.headerButton}>
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Skeleton width="100%" height={40} borderRadius={12} />
          </View>
          <Skeleton width={40} height={40} borderRadius={12} />
          <Skeleton width={40} height={40} borderRadius={12} />
        </View>

        <View style={styles.listContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <StaffCardSkeleton key={i} />
          ))}
        </View>

        <SchoolSidebar
          isVisible={sidebarVisible}
          onClose={handleCloseSidebar}
          schoolId={schoolId}
          userRole={userRole}
          currentRoute="Staffs"
          onNavigate={handleNavigate}
          onBackToSchools={handleBackToSchools}
        />
      </SafeAreaView>
    );
  }

  if (error && staff.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleMenuPress} style={styles.headerButton}>
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Skeleton width="100%" height={40} borderRadius={12} />
          </View>
          <Skeleton width={40} height={40} borderRadius={12} />
          <Skeleton width={40} height={40} borderRadius={12} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchStaff(1, searchQuery)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>

        <SchoolSidebar
          isVisible={sidebarVisible}
          onClose={handleCloseSidebar}
          schoolId={schoolId}
          userRole={userRole}
          currentRoute="Staffs"
          onNavigate={handleNavigate}
          onBackToSchools={handleBackToSchools}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.headerButton}>
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search staff..."
          />
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={handleFilterPress}>
          <Ionicons name="filter" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButtonPrimary} onPress={handleAddStaff}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={staff}
        keyExtractor={keyExtractor}
        renderItem={renderStaffItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {staff.length > 0 ? (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SHOWING {staff.length} OF {totalCount} STAFF MEMBERS
          </Text>
        </View>
      ) : null}

      {paginationComponent}

      <SchoolSidebar
        isVisible={sidebarVisible}
        onClose={handleCloseSidebar}
        schoolId={schoolId}
        userRole={userRole}
        currentRoute="Staffs"
        onNavigate={handleNavigate}
        onBackToSchools={handleBackToSchools}
      />
    </SafeAreaView>
  );
});

StaffListingScreen.displayName = 'StaffListingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  searchContainer: {
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPrimary: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.schoolNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    gap: 6,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageNumber: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pageNumberActive: {
    backgroundColor: colors.schoolNavy,
    borderColor: colors.schoolNavy,
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pageNumberTextActive: {
    color: colors.white,
  },
  pageEllipsis: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
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
  },
  backButton: {
    backgroundColor: colors.schoolNavy,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
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
});

export default StaffListingScreen;
