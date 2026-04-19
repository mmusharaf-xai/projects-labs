import React, { useCallback, memo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoginScreenHeader, LoginForm } from './components';
import { colors } from '../../utils/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../../db/schema';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = memo(({ navigation }) => {
  const { setCurrentUser } = useAuth();

  const onNavigateToSignup = useCallback(() => navigation.navigate('Signup'), [navigation]);

  const onLoginSuccess = useCallback(async (user: User) => {
    await setCurrentUser(user);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [setCurrentUser, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <LoginScreenHeader />
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              onNavigateToSignup={onNavigateToSignup}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

LoginScreen.displayName = 'LoginScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
});

export default LoginScreen;
