import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useAppNavigation } from '../../navigation/types';
import { AlertModal, UnsavedAlert } from '../../components/shared';
import { AvatarSection, ProfileForm, ThemeToggle } from './components';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user: currentUser, updateUser, logout } = useUser();
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState<any[]>([]);
  const [unsavedVisible, setUnsavedVisible] = useState(false);
  const [unsavedTitle, setUnsavedTitle] = useState('');
  const [unsavedMessage, setUnsavedMessage] = useState('');
  const [unsavedButtons, setUnsavedButtons] = useState<any[]>([]);
  const navigation = useNavigation();
  const typedNav = useAppNavigation();

  useEffect(() => {
    if (currentUser) {
      setEditedUsername(currentUser.username);
      setEditedEmail(currentUser.email);
      setSelectedAvatar(currentUser.avatar || 0);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setHasChanges(
        editedUsername !== currentUser.username ||
        editedEmail !== currentUser.email ||
        selectedAvatar !== (currentUser.avatar || 0)
      );
    }
  }, [editedUsername, editedEmail, selectedAvatar, currentUser]);

  const saveChanges = useCallback(async (suppressAlert = false) => {
    if (!currentUser) return;
    await updateUser({ username: editedUsername, email: editedEmail, avatar: selectedAvatar });
    setHasChanges(false);
    if (!suppressAlert) {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  }, [currentUser, updateUser, editedUsername, editedEmail, selectedAvatar]);

  const handleDiscard = useCallback(() => {
    if (currentUser) {
      setEditedUsername(currentUser.username);
      setEditedEmail(currentUser.email);
      setSelectedAvatar(currentUser.avatar || 0);
      setHasChanges(false);
    }
    navigation.goBack();
  }, [currentUser, navigation]);

  const showModal = useCallback((title: string, message: string, buttons: any[]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  }, []);

  const showUnsaved = useCallback((title: string, message: string, buttons: any[]) => {
    setUnsavedTitle(title);
    setUnsavedMessage(message);
    setUnsavedButtons(buttons);
    setUnsavedVisible(true);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasChanges) return;
      e.preventDefault();
      showUnsaved('Unsaved Changes', 'You have unsaved changes. What would you like to do?', [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Go Back', onPress: handleDiscard, style: 'cancel' },
        { text: 'Save and Go Back', onPress: async () => { await saveChanges(); navigation.goBack(); } },
      ]);
    });
    return unsubscribe;
  }, [hasChanges, navigation, showUnsaved, handleDiscard, saveChanges]);

  const handleBack = useCallback(() => {
    if (hasChanges) {
      showUnsaved('Unsaved Changes', 'You have unsaved changes. What would you like to do?', [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Go Back', onPress: handleDiscard, style: 'cancel' },
        { text: 'Save and Go Back', onPress: async () => { await saveChanges(); navigation.goBack(); } },
      ]);
      return;
    }
    navigation.goBack();
  }, [hasChanges, showUnsaved, handleDiscard, saveChanges, navigation]);

  const handleLogout = useCallback(() => {
    if (hasChanges) {
      showUnsaved('Unsaved Changes', 'You have unsaved changes. What would you like to do?', [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Save And Logout', onPress: async () => {
          await saveChanges(true);
          showModal('Success', 'Profile updated successfully!', [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                typedNav.reset({ index: 0, routes: [{ name: 'Auth' }] });
              },
            },
          ]);
        }, style: 'save' },
        { text: 'Logout', onPress: async () => { await logout(); typedNav.reset({ index: 0, routes: [{ name: 'Auth' }] }); }, style: 'destructive' },
      ]);
      return;
    }
    showModal('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          typedNav.reset({ index: 0, routes: [{ name: 'Auth' }] });
        },
        style: 'destructive',
      },
    ]);
  }, [hasChanges, showUnsaved, showModal, saveChanges, logout, typedNav]);

  const handleAvatarSelect = useCallback((index: number) => {
    setSelectedAvatar(index);
  }, []);

  const handleChangePassword = useCallback(() => {
    typedNav.navigate('UpdatePassword');
  }, [typedNav]);

  const boldWeight = Platform.OS === 'ios' ? '600' : 'bold';

  if (!currentUser) return <View />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontWeight: boldWeight as any }]}>Profile Settings</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Display */}
        <View style={styles.avatarDisplay}>
          <View style={[styles.mainAvatar, { borderColor: colors.primary, backgroundColor: colors.primary + '20' }]}>
            <MaterialIcons name={(currentUser.avatar !== undefined ? ['sports-cricket', 'front-hand', 'sports-baseball', 'military-tech', 'emoji-events'][selectedAvatar] : 'sports-cricket') as any} size={60} color={colors.primary} />
          </View>
          <View style={[styles.emailBadge, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <MaterialIcons name="lock" size={16} color={colors.primary} />
            <Text style={[styles.emailText, { color: colors.textSecondary }]}>{currentUser.email}</Text>
          </View>
        </View>

        <ProfileForm
          username={editedUsername}
          email={editedEmail}
          onUsernameChange={setEditedUsername}
          onChangePassword={handleChangePassword}
          colors={colors}
        />

        <ThemeToggle isDark={isDark} onToggle={toggleTheme} colors={colors} />

        <AvatarSection selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} colors={colors} />
      </ScrollView>

      {/* Footer */}
      <BlurView
        intensity={Platform.OS === 'android' ? 100 : 85}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.footer, { borderTopColor: colors.surfaceBorder }]}
      >
        {hasChanges ? (
          <TouchableOpacity onPress={() => saveChanges()} style={[styles.saveBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            <Text style={[styles.saveBtnText, { color: colors.textPrimary }]}>Save Changes</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <MaterialIcons name="logout" size={20} color="#dc2626" />
          <Text style={[styles.logoutText, { fontWeight: boldWeight as any }]}>Logout</Text>
        </TouchableOpacity>
      </BlurView>

      <AlertModal visible={modalVisible} title={modalTitle} message={modalMessage} buttons={modalButtons} onClose={() => setModalVisible(false)} />
      <UnsavedAlert visible={unsavedVisible} title={unsavedTitle} message={unsavedMessage} buttons={unsavedButtons} onClose={() => setUnsavedVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  headerSpacer: { width: 40 },
  scroll: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 150 },
  avatarDisplay: { alignItems: 'center', paddingVertical: 40 },
  mainAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  emailBadge: {
    marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  emailText: { fontSize: 14 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, borderTopWidth: 1,
  },
  saveBtn: {
    width: '100%', height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  logoutText: { fontSize: 14, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 1 },
});