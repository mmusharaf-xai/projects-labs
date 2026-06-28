import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateLoginForm,
  validateSignupForm,
} from '../validation';

describe('validateEmail', () => {
  it('returns error when email is empty', () => {
    expect(validateEmail('')).toEqual({ isValid: false, error: 'Email is required' });
  });

  it('returns error when email is whitespace only', () => {
    expect(validateEmail('   ')).toEqual({ isValid: false, error: 'Email is required' });
  });

  it('returns error for invalid email format', () => {
    expect(validateEmail('notanemail')).toEqual({
      isValid: false,
      error: 'Please enter a valid email address',
    });
  });

  it('returns error for email missing domain', () => {
    expect(validateEmail('user@')).toEqual({
      isValid: false,
      error: 'Please enter a valid email address',
    });
  });

  it('returns valid for correct email', () => {
    expect(validateEmail('user@example.com')).toEqual({ isValid: true });
  });

  it('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toEqual({ isValid: true });
  });
});

describe('validatePassword', () => {
  it('returns error when password is empty', () => {
    expect(validatePassword('')).toEqual({ isValid: false, error: 'Password is required' });
  });

  it('returns error when password is too short', () => {
    expect(validatePassword('abc')).toEqual({
      isValid: false,
      error: 'Password must be at least 8 characters',
    });
  });

  it('returns valid for password with 8+ characters', () => {
    expect(validatePassword('Test@1234')).toEqual({ isValid: true });
  });
});

describe('validateFullName', () => {
  it('returns error when full name is empty', () => {
    expect(validateFullName('')).toEqual({ isValid: false, error: 'Full name is required' });
  });

  it('returns error when full name is whitespace only', () => {
    expect(validateFullName('  ')).toEqual({ isValid: false, error: 'Full name is required' });
  });

  it('returns error when full name is too short', () => {
    expect(validateFullName('Jo')).toEqual({
      isValid: false,
      error: 'Full name must be at least 3 characters',
    });
  });

  it('returns valid for name with 3+ characters', () => {
    expect(validateFullName('John Doe')).toEqual({ isValid: true });
  });
});

describe('validateLoginForm', () => {
  it('returns empty object for valid inputs', () => {
    const errors = validateLoginForm('user@example.com', 'Test@1234');
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns email error for empty email', () => {
    const errors = validateLoginForm('', 'Test@1234');
    expect(errors.email).toBe('Email is required');
    expect(errors.password).toBeUndefined();
  });

  it('returns password error for short password', () => {
    const errors = validateLoginForm('user@example.com', 'abc');
    expect(errors.password).toBe('Password must be at least 8 characters');
    expect(errors.email).toBeUndefined();
  });

  it('returns both errors when both fields are invalid', () => {
    const errors = validateLoginForm('', '');
    expect(errors.email).toBe('Email is required');
    expect(errors.password).toBe('Password is required');
  });
});

describe('validateSignupForm', () => {
  it('returns empty object for valid inputs', () => {
    const errors = validateSignupForm('John Doe', 'user@example.com', 'Test@1234');
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns fullName error for empty name', () => {
    const errors = validateSignupForm('', 'user@example.com', 'Test@1234');
    expect(errors.fullName).toBe('Full name is required');
  });

  it('returns email error for invalid email', () => {
    const errors = validateSignupForm('John Doe', 'invalid', 'Test@1234');
    expect(errors.email).toBe('Please enter a valid email address');
  });

  it('returns password error for short password', () => {
    const errors = validateSignupForm('John Doe', 'user@example.com', '123');
    expect(errors.password).toBe('Password must be at least 8 characters');
  });

  it('returns all errors when all fields are invalid', () => {
    const errors = validateSignupForm('', '', '');
    expect(errors.fullName).toBe('Full name is required');
    expect(errors.email).toBe('Email is required');
    expect(errors.password).toBe('Password is required');
  });
});