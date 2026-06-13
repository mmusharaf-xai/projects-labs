import { validateUsername, validateEmail, validatePassword, getPasswordStrength } from '../validation';

describe('validateUsername', () => {
  it('returns error for empty username', () => {
    expect(validateUsername('')).toEqual({ isValid: false, error: 'Please fill all required fields' });
  });

  it('returns error for whitespace-only username', () => {
    expect(validateUsername('   ')).toEqual({ isValid: false, error: 'Please fill all required fields' });
  });

  it('returns error for username shorter than 3 characters', () => {
    const result = validateUsername('ab');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('between');
  });

  it('returns error for username longer than 50 characters', () => {
    const result = validateUsername('a'.repeat(51));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('between');
  });

  it('accepts valid username', () => {
    expect(validateUsername('TestPlayer')).toEqual({ isValid: true });
  });

  it('accepts username at minimum length (3)', () => {
    expect(validateUsername('abc').isValid).toBe(true);
  });

  it('accepts username at maximum length (50)', () => {
    expect(validateUsername('a'.repeat(50)).isValid).toBe(true);
  });
});

describe('validateEmail', () => {
  it('returns error for empty email', () => {
    expect(validateEmail('')).toEqual({ isValid: false, error: 'Please fill all fields' });
  });

  it('returns error for whitespace-only email', () => {
    expect(validateEmail('   ')).toEqual({ isValid: false, error: 'Please fill all fields' });
  });

  it('returns error for email without @', () => {
    const result = validateEmail('testplayer.com');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid email');
  });

  it('returns error for email without domain', () => {
    const result = validateEmail('test@');
    expect(result.isValid).toBe(false);
  });

  it('returns error for email without TLD', () => {
    const result = validateEmail('test@domain');
    expect(result.isValid).toBe(false);
  });

  it('accepts valid email', () => {
    expect(validateEmail('player@stadium.com')).toEqual({ isValid: true });
  });
});

describe('validatePassword', () => {
  it('returns error for empty password', () => {
    expect(validatePassword('')).toEqual({ isValid: false, error: 'Please fill all fields' });
  });

  it('returns error for password shorter than 8 characters', () => {
    const result = validatePassword('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('at least 8');
  });

  it('accepts valid password (8+ characters)', () => {
    expect(validatePassword('Test@1234')).toEqual({ isValid: true });
  });
});

describe('getPasswordStrength', () => {
  it('returns score 0 for empty password', () => {
    expect(getPasswordStrength('')).toEqual({ score: 0, isValid: false, error: '' });
  });

  it('returns score 4 and isValid true for strong password', () => {
    const result = getPasswordStrength('Test@1234');
    expect(result.score).toBe(4);
    expect(result.isValid).toBe(true);
    expect(result.error).toBe('');
  });

  it('returns isValid false when missing uppercase', () => {
    const result = getPasswordStrength('test@1234');
    expect(result.isValid).toBe(false);
    expect(result.score).toBeLessThan(4);
  });

  it('returns isValid false when missing number', () => {
    const result = getPasswordStrength('Test@abcd');
    expect(result.isValid).toBe(false);
  });

  it('returns isValid false when missing special character', () => {
    const result = getPasswordStrength('Test12345');
    expect(result.isValid).toBe(false);
  });

  it('returns isValid false when too short', () => {
    const result = getPasswordStrength('T@1a');
    expect(result.isValid).toBe(false);
  });
});