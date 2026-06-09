import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useAppNavigation } from '../../navigation/types';
import { AlertModal } from '../../components/shared';
import { getPasswordStrength } from '../../utils/validation';

export default function UpdatePasswordScreen() {
  const { colors, isDark } = useTheme();
  const { user: currentUser, updateUser } = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState<any[]>([]);
  const [passwordError, setPasswordError] = useState('');
  const [strengthScore, setStrengthScore] = useState(0);
  const navigation = useAppNavigation();

  const showModal = useCallback((title: string, message: string, buttons: any[]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  }, []);

  const handleNewPasswordChange = useCallback((text: string) => {
    setNewPassword(text);
    const { score, error } = getPasswordStrength(text);
    setStrengthScore(score);
    setPasswordError(error);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showModal('Error', 'Please fill all fields', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
    if (newPassword !== confirmPassword) {
      showModal('Error', 'New passwords do not match', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
    const { isValid } = getPasswordStrength(newPassword);
    if (!isValid) {
      showModal('Error', 'New password does not meet the requirements', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
    if (!currentUser || currentUser.password !== oldPassword) {
      showModal('Error', 'Old password is incorrect', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
    await updateUser({ password: newPassword });
    showModal('Success', 'Password updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  }, [oldPassword, newPassword, confirmPassword, currentUser, updateUser, showModal, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Change Password</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView style={[styles.flex, styles.scrollPadding]} contentContainerStyle={styles.scrollContent}>
          <View style={styles.subtitleSection}>
            <Text style={[styles.subtitleMain, { color: colors.primary }]}>Update Credentials</Text>
            <Text style={[styles.subtitleDesc, { color: colors.textSecondary }]}>Ensure your account is using a strong, unique password to stay secure.</Text>
          </View>

          {/* Current Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="Enter current password"
                placeholderTextColor={colors.textMuted}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
              />
              <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.visibilityBtn}>
                <MaterialIcons name={showOldPassword ? 'visibility-off' : 'visibility'} size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>New Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: passwordError ? (isDark ? '#7f1d1d' : '#fee2e2') : colors.surface,
                    borderColor: passwordError ? '#ef4444' : colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Min. 8 characters"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.visibilityBtn}>
                <MaterialIcons name={showNewPassword ? 'visibility-off' : 'visibility'} size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            {newPassword.length > 0 ? (
              <View style={styles.strengthRow}>
                {[1, 2, 3, 4].map((level) => {
                  const isFilled = level <= strengthScore;
                  const barColor = strengthScore >= 3 ? colors.primary : (strengthScore >= 2 ? '#f59e0b' : '#ef4444');
                  return (
                    <View key={level} style={[styles.strengthBar, { backgroundColor: isFilled ? barColor : colors.surfaceBorder }]} />
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroupLarge}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="Repeat new password"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.visibilityBtn}>
                <MaterialIcons name={showConfirmPassword ? 'visibility-off' : 'visibility'} size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <MaterialIcons name="info" size={24} color={colors.primary} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Changing your password will sign you out of all other active sessions on different devices.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed footer buttons */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.surfaceBorder }]}>
        <TouchableOpacity onPress={handleUpdate} style={[styles.updateBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <Text style={[styles.updateBtnText, { color: colors.textPrimary }]}>Update Password</Text>
          <MaterialIcons name="task-alt" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <AlertModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: { paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSpacer: { width: 40 },
  scrollPadding: { paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 200 },
  subtitleSection: { marginBottom: 32 },
  subtitleMain: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitleDesc: { fontSize: 14, lineHeight: 20 },
  fieldGroup: { marginBottom: 24 },
  fieldGroupLarge: { marginBottom: 40 },
  fieldLabel: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4, marginBottom: 8 },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 16, zIndex: 1 },
  input: { width: '100%', borderWidth: 1, borderRadius: 24, height: 56, paddingLeft: 48, paddingRight: 56, fontSize: 15 },
  visibilityBtn: { position: 'absolute', right: 16, top: 16 },
  errorText: { fontSize: 11, color: '#ef4444', marginTop: 8, marginLeft: 4, lineHeight: 16 },
  strengthRow: { flexDirection: 'row', gap: 6, marginTop: 12, paddingHorizontal: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 999 },
  infoBox: { marginBottom: 40, padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 12 },
  infoIcon: { marginTop: 2 },
  infoText: { fontSize: 13, lineHeight: 18, flex: 1 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, borderTopWidth: 1, zIndex: 10,
  },
  updateBtn: {
    width: '100%', height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 16,
  },
  updateBtnText: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  cancelBtn: { width: '100%', height: 48, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
});