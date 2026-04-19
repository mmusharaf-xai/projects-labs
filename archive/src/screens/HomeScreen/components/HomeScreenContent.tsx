import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import JoinSchoolModal from './JoinSchoolModal';
import SchoolItem, { UserSchoolWithSchool } from './SchoolItem';
import EmptyState from './EmptyState';
import { colors } from '../../../utils/colors';
import { getUserSchools, joinSchool } from '../../../services/schoolService';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAuth } from '../../../context/AuthContext';

interface HomeScreenContentProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreenContent: React.FC<HomeScreenContentProps> = memo(({ navigation }) => {
  const { currentUserId } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<UserSchoolWithSchool[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredSchools = useMemo(() => {
    if (searchQuery.trim() === '') {
      return schools;
    }
    const query = searchQuery.toLowerCase();
    return schools.filter(
      (item) =>
        item.school.name.toLowerCase().includes(query) ||
        (item.school.description &&
          item.school.description.toLowerCase().includes(query))
    );
  }, [searchQuery, schools]);

  const fetchSchools = useCallback(async () => {
    if (!currentUserId) return;
    const result = await getUserSchools(currentUserId);
    if (result.success && result.userSchools) {
      setSchools(result.userSchools as UserSchoolWithSchool[]);
    } else {
      Alert.alert('Error', result.error || 'Failed to fetch schools');
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSchools();
    setRefreshing(false);
  }, [fetchSchools]);

  const handleSchoolPress = useCallback((school: { id: number; name: string }) => {
    navigation.navigate('QuickAccess', {
      schoolId: school.id,
      schoolName: school.name,
    });
  }, [navigation]);

  const handleJoinSchool = useCallback(async (code: string) => {
    if (!currentUserId) return;
    setActionLoading(true);
    const result = await joinSchool(code, currentUserId);
    setActionLoading(false);

    if (result.success) {
      await fetchSchools();
    } else {
      throw new Error(result.error || 'Failed to join school');
    }
  }, [currentUserId, fetchSchools]);

  const handleNavigateToAccountSettings = useCallback(() => {
    navigation.navigate('AccountSettings');
  }, [navigation]);

  const handleNavigateToRegisterSchool = useCallback(() => {
    navigation.navigate('RegisterSchool');
  }, [navigation]);

  const handleOpenJoinModal = useCallback(() => {
    setJoinModalVisible(true);
  }, []);

  const handleCloseJoinModal = useCallback(() => {
    setJoinModalVisible(false);
  }, []);

  const renderSchoolItem = useCallback(({ item }: { item: UserSchoolWithSchool }) => (
    <SchoolItem item={item} onPress={handleSchoolPress} />
  ), [handleSchoolPress]);

  const keyExtractor = useCallback((item: UserSchoolWithSchool) => item.id.toString(), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>My Schools</Text>
        <TouchableOpacity 
          style={styles.accountButton}
          onPress={handleNavigateToAccountSettings}
        >
          <Ionicons name="person-circle" size={28} color={colors.schoolNavy} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Find your school"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNavigateToRegisterSchool}
          activeOpacity={0.9}
        >
          <View style={styles.primaryButtonIcon}>
            <Ionicons name="add-circle" size={20} color={colors.white} />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.primaryButtonTitle}>Create School</Text>
            <Text style={styles.primaryButtonSubtitle}>Register as an administrator</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleOpenJoinModal}
          activeOpacity={0.9}
        >
          <View style={styles.secondaryButtonIcon}>
            <Ionicons name="people" size={20} color={colors.schoolNavy} />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.secondaryButtonTitle}>Join a School</Text>
            <Text style={styles.secondaryButtonSubtitle}>Request access with a code</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.schoolsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Schools</Text>
          {filteredSchools.length > 0 ? (
            <Text style={styles.viewAllText}>View All</Text>
          ) : null}
        </View>

        <FlatList
          data={filteredSchools}
          renderItem={renderSchoolItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.schoolAccent}
            />
          }
          ListEmptyComponent={EmptyState}
        />
      </View>

      <JoinSchoolModal
        visible={joinModalVisible}
        onClose={handleCloseJoinModal}
        onJoin={handleJoinSchool}
        loading={actionLoading}
      />
    </SafeAreaView>
  );
});

HomeScreenContent.displayName = 'HomeScreenContent';

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.schoolNavy,
  },
  accountButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.schoolNavy,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  buttonTextContainer: {
    flex: 1,
  },
  primaryButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  primaryButtonSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryButtonIcon: {
    backgroundColor: 'rgba(30, 41, 59, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  secondaryButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.schoolNavy,
  },
  secondaryButtonSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  schoolsSection: {
    flex: 1,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.schoolNavy,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.schoolAccent,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default HomeScreenContent;
