import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Button {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: Button[];
  onClose: () => void;
}

const getButtonStyle = (style: string | undefined, primaryColor: string, surfaceColor: string) => {
  switch (style) {
    case 'destructive':
      return { backgroundColor: '#dc3545' };
    case 'cancel':
      return { backgroundColor: surfaceColor };
    default:
      return { backgroundColor: primaryColor };
  }
};

const getButtonTextColor = (style: string | undefined, textPrimary: string) => {
  switch (style) {
    case 'cancel':
      return textPrimary;
    default:
      return 'white';
  }
};

export default function AlertModal({ visible, title, message, buttons, onClose }: AlertModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.inputBorder }]}>
          <View style={styles.header}>
            <MaterialIcons name="warning" size={24} color={colors.primary} />
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          </View>

          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, getButtonStyle(button.style, colors.primary, colors.surface)]}
                onPress={() => {
                  button.onPress();
                  onClose();
                }}
              >
                <Text style={[styles.buttonText, { color: getButtonTextColor(button.style, colors.textPrimary) }]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});