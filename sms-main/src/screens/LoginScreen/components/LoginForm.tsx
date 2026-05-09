import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FormInput, PrimaryButton, FormError } from '../../../components/shared';
import { validateLoginForm } from '../../../utils/validation';
import { loginUser } from '../../../services/authService';
import { User } from '../../../../db/schema';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = memo(({ onLoginSuccess, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    setErrors({});
    setGeneralError(undefined);

    const formErrors = validateLoginForm(email, password);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      } else {
        setGeneralError(result.error);
      }
    } catch {
      setGeneralError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, onLoginSuccess]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handleSignupPress = useCallback(() => {
    onNavigateToSignup();
  }, [onNavigateToSignup]);

  return (
    <View style={styles.container}>
      <FormInput
        label="Email Address"
        placeholder="john@example.com"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
      />

      <FormInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        autoComplete="password"
        error={errors.password}
        containerStyle={styles.inputSpacing}
      />

      <View style={styles.submitContainer}>
        <PrimaryButton
          title="Log In"
          onPress={handleLogin}
          loading={loading}
        />
      </View>

      <FormError message={generalError} />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignupPress}>
          <Text style={styles.signupLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

LoginForm.displayName = 'LoginForm';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputSpacing: {
    marginTop: 16,
  },
  submitContainer: {
    paddingTop: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: '#64748b',
  },
  signupLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default LoginForm;
