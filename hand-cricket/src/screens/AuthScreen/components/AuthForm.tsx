import React, { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useUser } from '../../../context/UserContext';
import { useAppNavigation } from '../../../navigation/types';
import { AlertModal } from '../../../components/shared';
import { loginUser, signupUser } from '../../../services/authService';
import AvatarPicker from './AvatarPicker';

const AuthForm: React.FC = memo(() => {
  const { colors } = useTheme();
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState<any[]>([]);
  const navigation = useAppNavigation();

  const showModal = useCallback((title: string, message: string, buttons: any[]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  }, []);

  const resetForm = useCallback(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setSelectedAvatar(0);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isLogin) {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        resetForm();
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        showModal('Error', result.error || 'Login failed', [{ text: 'OK', onPress: () => {} }]);
      }
    } else {
      const result = await signupUser(username, email, password, selectedAvatar);
      if (result.success && result.user) {
        setUser(result.user);
        resetForm();
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        showModal('Error', result.error || 'Signup failed', [{ text: 'OK', onPress: () => {} }]);
      }
    }
  }, [isLogin, email, password, username, selectedAvatar, setUser, resetForm, navigation, showModal]);

  const handleAvatarSelect = useCallback((index: number) => {
    setSelectedAvatar(index);
  }, []);

  return (
    <>
      {/* Toggle */}
      <View style={styles.toggleContainer}>
        <View style={[styles.toggleTrack, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, { backgroundColor: isLogin ? colors.primary : 'transparent' }]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, { color: isLogin ? 'white' : colors.textSecondary }]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, { backgroundColor: !isLogin ? colors.primary : 'transparent' }]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, { color: !isLogin ? 'white' : colors.textSecondary }]}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView style={[styles.flex, styles.formScroll]} keyboardShouldPersistTaps="handled">
          {isLogin ? (
            <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>Welcome back</Text>
          ) : null}

          {!isLogin ? (
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Username</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="account-circle" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                  placeholder="PitchKing"
                  placeholderTextColor={colors.textMuted}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="alternate-email" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="player@stadium.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder="Your secret code"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {!isLogin ? (
            <AvatarPicker selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} colors={colors} />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>
            {isLogin ? 'Login' : 'Start Playing'}
          </Text>
          <MaterialIcons name="sports-cricket" size={20} color="white" />
        </TouchableOpacity>
        <Text style={[styles.switchText, { color: colors.textSecondary }]}>
          {isLogin ? 'New to the game? ' : 'Already on the squad? '}
          <Text style={[styles.switchLink, { color: colors.primary }]} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Signup' : 'Login'}
          </Text>
        </Text>
      </View>

      <AlertModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
});

AuthForm.displayName = 'AuthForm';
export default AuthForm;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  toggleContainer: { paddingHorizontal: 24, marginTop: 32 },
  toggleTrack: { height: 44, width: '100%', borderRadius: 22, padding: 2, borderWidth: 1, flexDirection: 'row' },
  toggleBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  toggleText: { fontSize: 11, fontWeight: 'bold' },
  formScroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  fieldGroup: { marginBottom: 24 },
  fieldLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginLeft: 4, marginBottom: 8 },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 14, zIndex: 1 },
  input: { width: '100%', borderWidth: 1, borderRadius: 24, height: 48, paddingLeft: 48, paddingRight: 24, fontSize: 14 },
  buttonSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },
  submitBtn: {
    width: '100%', height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  submitBtnText: { color: 'white', fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  switchText: { fontSize: 9, textAlign: 'center', marginTop: 24 },
  switchLink: { fontWeight: 'bold', textDecorationLine: 'underline' },
});