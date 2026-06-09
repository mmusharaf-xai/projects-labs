import { VALIDATION_RULES } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Please fill all fields' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || password === '') {
    return { isValid: false, error: 'Please fill all fields' };
  }
  if (password.length < VALIDATION_RULES.passwordMinLength) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION_RULES.passwordMinLength} characters`,
    };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Please fill all required fields' };
  }
  if (
    username.length < VALIDATION_RULES.usernameMinLength ||
    username.length > VALIDATION_RULES.usernameMaxLength
  ) {
    return {
      isValid: false,
      error: `Username must be between ${VALIDATION_RULES.usernameMinLength} and ${VALIDATION_RULES.usernameMaxLength} characters`,
    };
  }
  return { isValid: true };
};

export interface PasswordStrengthResult {
  score: number;
  isValid: boolean;
  error: string;
}

export const getPasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) return { score: 0, isValid: false, error: '' };
  const hasLength =
    password.length >= VALIDATION_RULES.passwordMinLength &&
    password.length <= VALIDATION_RULES.passwordMaxLength;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const score = (hasLength ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
  const error =
    score === 4
      ? ''
      : 'Password must be 8-16 characters with at least one number, uppercase letter, and special character.';
  return { score, isValid: score === 4, error };
};