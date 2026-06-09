import React, { memo, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '../../../utils/colors';

interface ProfileFormProps {
  username: string;
  email: string;
  onUsernameChange: (text: string) => void;
  onChangePassword: () => void;
  colors: AppColors;
}

const boldWeight = Platform.OS === 'ios' ? '600' : 'bold';

const ProfileForm: React.FC<ProfileFormProps> = memo(({ username, email, onUsernameChange, onChangePassword, colors }) => {
  const usernameInputRef = useRef<TextInput>(null);

  return (
    <View>
      {/* Username */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textMuted, fontWeight: boldWeight as any }]}>Username</Text>
        <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <TextInput
            ref={usernameInputRef}
            value={username}
            onChangeText={onUsernameChange}
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Username"
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity onPress={() => usernameInputRef.current?.focus()}>
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Change Password */}
      <TouchableOpacity onPress={onChangePassword} style={[styles.passwordRow, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <View style={styles.passwordLeft}>
          <View style={[styles.passwordIcon, { backgroundColor: colors.primary + '20' }]}>
            <MaterialIcons name="key" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.passwordLabel, { color: colors.textPrimary, fontWeight: boldWeight as any }]}>Change Password</Text>
            <Text style={[styles.passwordSub, { color: colors.textMuted }]}>Last updated recently</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
});

ProfileForm.displayName = 'ProfileForm';
export default ProfileForm;

const styles = StyleSheet.create({
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16,
  },
  input: { flex: 1, fontSize: 16 },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 20,
  },
  passwordLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  passwordIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  passwordLabel: { fontSize: 16 },
  passwordSub: { fontSize: 10 },
});