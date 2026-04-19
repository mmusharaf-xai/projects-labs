import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

export interface DropdownOption {
  label: string;
  value: string;
}

interface FormDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  containerStyle?: any;
  error?: string;
}

// Option Item Component
interface OptionItemProps {
  option: DropdownOption;
  isSelected: boolean;
  onSelect: (option: DropdownOption) => void;
}

const OptionItem: React.FC<OptionItemProps> = memo(({ option, isSelected, onSelect }) => {
  const handlePress = useCallback(() => {
    onSelect(option);
  }, [option, onSelect]);

  return (
    <TouchableOpacity
      style={[styles.option, isSelected && styles.optionSelected]}
      onPress={handlePress}
    >
      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
        {option.label}
      </Text>
      {isSelected ? (
        <Ionicons name="checkmark" size={20} color={colors.schoolAccent} />
      ) : null}
    </TouchableOpacity>
  );
});

OptionItem.displayName = 'OptionItem';

const FormDropdown: React.FC<FormDropdownProps> = memo(({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  containerStyle,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedOption = useMemo(() => 
    options.find((opt) => opt.value === value),
    [options, value]
  );

  const handleOpen = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSelect = useCallback((option: DropdownOption) => {
    onChange(option.value);
    setModalVisible(false);
  }, [onChange]);

  const renderOption = useCallback(({ item }: { item: DropdownOption }) => (
    <OptionItem
      option={item}
      isSelected={item.value === value}
      onSelect={handleSelect}
    />
  ), [value, handleSelect]);

  const keyExtractor = useCallback((item: DropdownOption) => item.value, []);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.value,
            !selectedOption && styles.placeholder,
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={keyExtractor}
              renderItem={renderOption}
              style={styles.list}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

FormDropdown.displayName = 'FormDropdown';

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    marginLeft: 4,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '85%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  list: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.schoolAccent,
    fontWeight: '600',
  },
  dropdownError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default FormDropdown;
