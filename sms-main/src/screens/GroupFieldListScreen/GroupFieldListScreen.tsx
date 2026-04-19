import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Skeleton from '../../components/shared/Skeleton';
import {
  fetchGroupFields,
  deleteField,
  FieldConfigData,
} from '../../services/fieldGroupService';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupFieldList'>;

// Field type icon helper
const getFieldTypeIcon = (fieldType: string): string => {
  switch (fieldType.toLowerCase()) {
    case 'text':
      return 'document-text-outline';
    case 'number':
      return 'calculator-outline';
    case 'date':
      return 'calendar-outline';
    case 'select':
      return 'list-outline';
    default:
      return 'document-text-outline';
  }
};

// Field Card Skeleton
const FieldCardSkeleton: React.FC = memo(() => (
  <View style={styles.fieldCard}>
    <Skeleton width={44} height={44} borderRadius={12} />
    <View style={{ flex: 1, marginLeft: 14 }}>
      <Skeleton width={140} height={18} borderRadius={6} />
      <View style={{ marginTop: 6 }}>
        <Skeleton width={80} height={14} borderRadius={6} />
      </View>
    </View>
    <Skeleton width={22} height={22} borderRadius={11} />
  </View>
));

FieldCardSkeleton.displayName = 'FieldCardSkeleton';

// List Skeleton
const ListSkeleton: React.FC = memo(() => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton}>
        <Skeleton width={24} height={24} borderRadius={12} />
      </TouchableOpacity>
      <Skeleton width={180} height={24} borderRadius={12} />
      <View style={{ width: 40 }} />
    </View>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.searchContainer}>
        <Skeleton width="100%" height={48} borderRadius={12} />
      </View>
      <View style={styles.fieldsWrapper}>
        {[1, 2, 3, 4, 5].map((i) => (
          <FieldCardSkeleton key={i} />
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
));

ListSkeleton.displayName = 'ListSkeleton';

// Field Card Component
interface FieldCardProps {
  field: FieldConfigData;
  onEdit: (field: FieldConfigData) => void;
  onDelete: (field: FieldConfigData) => void;
  isLast?: boolean;
}

const FieldCard: React.FC<FieldCardProps> = memo(({ field, onEdit, onDelete, isLast }) => {
  const handleEdit = useCallback(() => {
    onEdit(field);
  }, [field, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(field);
  }, [field, onDelete]);

  const iconName = useMemo(() => getFieldTypeIcon(field.fieldType), [field.fieldType]);

  const subtitle = useMemo(() => {
    return field.isRequired ? `${field.fieldType} · Required` : field.fieldType;
  }, [field.fieldType, field.isRequired]);

  return (
    <View style={[styles.fieldCard, isLast && styles.fieldCardLast]}>
      <View style={styles.fieldIconContainer}>
        <Ionicons name={iconName as any} size={22} color={colors.schoolBlue} />
      </View>
      <View style={styles.fieldCardContent}>
        <Text style={styles.fieldCardName} numberOfLines={1}>
          {field.name}
        </Text>
        <Text style={styles.fieldCardSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.fieldActionButton}
      >
        <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleEdit}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.fieldActionButton}
      >
        <Ionicons name="create-outline" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
});

FieldCard.displayName = 'FieldCard';

// Empty State Component
interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState: React.FC<EmptyStateProps> = memo(({ searchQuery }) => {
  if (searchQuery.trim()) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyText}>No fields found</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="documents-outline" size={48} color={colors.textMuted} />
      <Text style={styles.emptyText}>No fields yet</Text>
      <Text style={styles.emptySubtext}>Add your first field to this group</Text>
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

// Main Screen
const GroupFieldListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { schoolId, schoolName, moduleKey, moduleName, groupId, groupName, isDefault } =
    route.params;
  const isFocused = useIsFocused();

  const [fields, setFields] = useState<FieldConfigData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  // Load fields
  const loadFields = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const result = await fetchGroupFields(groupId);

    if (result.success && result.fields) {
      setFields(result.fields);
    } else {
      setError(result.error || 'Failed to load fields');
    }

    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  // Re-fetch when screen regains focus
  const initialFocusRef = useRef(true);
  useEffect(() => {
    if (isFocused && !initialFocusRef.current) {
      loadFields();
    }
    initialFocusRef.current = false;
  }, [isFocused, loadFields]);

  // Handlers
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleAddField = useCallback(() => {
    navigation.navigate('AddCustomField', {
      schoolId,
      schoolName,
      moduleKey,
      moduleName,
      groupId,
      groupName,
    });
  }, [navigation, schoolId, schoolName, moduleKey, moduleName, groupId, groupName]);

  const handleEditField = useCallback((field: FieldConfigData) => {
    navigation.navigate('AddCustomField', {
      schoolId,
      schoolName,
      moduleKey,
      moduleName,
      groupId,
      groupName,
      fieldId: field.id,
    });
  }, [navigation, schoolId, schoolName, moduleKey, moduleName, groupId, groupName]);

  const handleDeleteField = useCallback((field: FieldConfigData) => {
    Alert.alert(
      'Delete Field',
      `Are you sure you want to delete "${field.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteField(field.id);
            if (result.success) {
              setFields((prev) => prev.filter((f) => f.id !== field.id));
            } else {
              Alert.alert('Error', result.error || 'Failed to delete field');
            }
          },
        },
      ]
    );
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Filtering with useMemo
  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return fields;
    const query = searchQuery.toLowerCase();
    return fields.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.fieldType.toLowerCase().includes(query)
    );
  }, [fields, searchQuery]);

  // Loading
  if (loading) return <ListSkeleton />;

  // Error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.centeredText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFields}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main UI
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {groupName}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search fields..."
              placeholderTextColor={colors.textMuted}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Fields List */}
        {filteredFields.length > 0 ? (
          <View style={styles.fieldsWrapper}>
            <Text style={styles.sectionTitle}>
              {isDefault ? 'DEFAULT FIELDS' : 'FIELDS'}
            </Text>
            {filteredFields.map((field, idx) => (
              <FieldCard
                key={field.id}
                field={field}
                onEdit={handleEditField}
                onDelete={handleDeleteField}
                isLast={idx === filteredFields.length - 1}
              />
            ))}
          </View>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}

        {/* Group info */}
        {isDefault ? (
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>
              This is a system protected group. Default fields ensure core data is always captured.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Add Field Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.addFieldButton}
          onPress={handleAddField}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={22} color={colors.white} />
          <Text style={styles.addFieldButtonText}>Add Field</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
    paddingVertical: 0,
  },
  fieldsWrapper: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
  fieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  fieldIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldCardContent: {
    flex: 1,
    marginLeft: 14,
  },
  fieldCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fieldCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  fieldCardLast: {
    borderBottomWidth: 0,
  },
  fieldActionButton: {
    padding: 8,
  },
  footerInfo: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: colors.background,
  },
  addFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.schoolNavy,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addFieldButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  centeredText: {
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

export default GroupFieldListScreen;
