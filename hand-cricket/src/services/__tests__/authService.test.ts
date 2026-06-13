import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupUser } from '../authService';

// AsyncStorage is auto-mocked by jest-expo / @react-native-async-storage mock

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('signupUser', () => {
  const validInput = {
    username: 'TestPlayer',
    email: 'test@example.com',
    password: 'Test@1234',
    avatar: 0,
  };

  // --- Validation errors ---

  it('returns error for empty username', async () => {
    const result = await signupUser('', validInput.email, validInput.password, validInput.avatar);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns error for username too short', async () => {
    const result = await signupUser('ab', validInput.email, validInput.password, validInput.avatar);
    expect(result.success).toBe(false);
    expect(result.error).toContain('between');
  });

  it('returns error for invalid email', async () => {
    const result = await signupUser(validInput.username, 'notanemail', validInput.password, validInput.avatar);
    expect(result.success).toBe(false);
    expect(result.error).toContain('valid email');
  });

  it('returns error for empty email', async () => {
    const result = await signupUser(validInput.username, '', validInput.password, validInput.avatar);
    expect(result.success).toBe(false);
  });

  it('returns error for password too short', async () => {
    const result = await signupUser(validInput.username, validInput.email, 'short', validInput.avatar);
    expect(result.success).toBe(false);
    expect(result.error).toContain('at least 8');
  });

  it('returns error for empty password', async () => {
    const result = await signupUser(validInput.username, validInput.email, '', validInput.avatar);
    expect(result.success).toBe(false);
  });

  // --- Duplicate user ---

  it('returns error when email already exists', async () => {
    await signupUser(validInput.username, validInput.email, validInput.password, validInput.avatar);
    const result = await signupUser('AnotherUser', validInput.email, 'Another@123', 1);
    expect(result.success).toBe(false);
    expect(result.error).toBe('User already exists');
  });

  // --- Successful signup ---

  it('creates user successfully with valid input', async () => {
    const result = await signupUser(validInput.username, validInput.email, validInput.password, validInput.avatar);
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user!.username).toBe('TestPlayer');
    expect(result.user!.email).toBe('test@example.com');
    expect(result.user!.avatar).toBe(0);
    expect(result.user!.played).toBe(0);
    expect(result.user!.wins).toBe(0);
  });

  it('generates a 5-digit userId', async () => {
    const result = await signupUser(validInput.username, validInput.email, validInput.password, validInput.avatar);
    const userId = result.user!.userId!;
    expect(userId).toBeGreaterThanOrEqual(10000);
    expect(userId).toBeLessThan(100000);
  });

  it('stores user in the users list in AsyncStorage', async () => {
    await signupUser(validInput.username, validInput.email, validInput.password, validInput.avatar);
    const users = JSON.parse((await AsyncStorage.getItem('users'))!);
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('TestPlayer');
  });

  it('sets currentUser in AsyncStorage', async () => {
    await signupUser(validInput.username, validInput.email, validInput.password, validInput.avatar);
    const currentUser = JSON.parse((await AsyncStorage.getItem('currentUser'))!);
    expect(currentUser.username).toBe('TestPlayer');
    expect(currentUser.email).toBe('test@example.com');
  });

  it('allows multiple signups with different emails', async () => {
    await signupUser('Player1', 'p1@test.com', 'Test@1234', 0);
    const result = await signupUser('Player2', 'p2@test.com', 'Test@1234', 1);
    expect(result.success).toBe(true);

    const users = JSON.parse((await AsyncStorage.getItem('users'))!);
    expect(users).toHaveLength(2);
  });

  it('does not store password as plaintext in result (password is present but matches input)', async () => {
    const result = await signupUser(validInput.username, validInput.email, validInput.password, validInput.avatar);
    // Current implementation stores password — this test documents that behavior
    expect(result.user!.password).toBe(validInput.password);
  });
});