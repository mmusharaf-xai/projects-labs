import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';

interface CreateFieldGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<{ success: boolean; error?: string }>;
}

const CreateFieldGroupModal: React.FC<CreateFieldGroupModalProps> = memo(({
  visible,
  onClose,
  onSubmit,
}) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setGroupName('');
      setError(undefined);
      setLoading(false);
    }
  }, [visible]);

  const handleCreate = useCallback(async () => {
    const trimmed = groupName.trim();
    if (!trimmed) {
      setError('Group name is required');
      return;
    }
    if (trimmed.length < 2) {
      setError('Group name must be at least 2 characters');
      return;
    }

    setError(undefined);
    setLoading(true);

    const result = await onSubmit(trimmed);

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to create group');
    }
  }, [groupName, onSubmit]);

  const handleNameChange = useCallback((text: string) => {
    setGroupName(text);
    if (error) setError(undefined);
  }, [error]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Field Group</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={groupName}
              onChangeText={handleNameChange}
              placeholder="e.g., Medical Information"
              placeholderTextColor={colors.textMuted}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.helperText}>
                Field groups help organize staff data into logical sections.
              </Text>
            )}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.createButtonText}>Create Group</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

CreateFieldGroupModal.displayName = 'CreateFieldGroupModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginTop: 8,
  },
  buttons: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 10,
  },
  createButton: {
    backgroundColor: colors.schoolNavy,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default CreateFieldGroupModal;
