import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation';
import { User } from '../context/UserContext';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) return { success: false, error: emailCheck.error };

  const passCheck = validatePassword(password);
  if (!passCheck.isValid) return { success: false, error: passCheck.error };

  const users: User[] = JSON.parse(await AsyncStorage.getItem('users') || '[]');
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  return { success: true, user };
};

export const signupUser = async (
  username: string,
  email: string,
  password: string,
  avatar: number,
): Promise<AuthResult> => {
  const nameCheck = validateUsername(username);
  if (!nameCheck.isValid) return { success: false, error: nameCheck.error };

  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) return { success: false, error: emailCheck.error };

  const passCheck = validatePassword(password);
  if (!passCheck.isValid) return { success: false, error: passCheck.error };

  const users: User[] = JSON.parse(await AsyncStorage.getItem('users') || '[]');

  if (users.some((u) => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }

  let userId: number;
  do {
    userId = Math.floor(Math.random() * 90000) + 10000;
  } while (users.some((u) => u.userId === userId));

  const newUser: User = { username, email, password, avatar, userId, played: 0, wins: 0 };
  users.push(newUser);
  await AsyncStorage.setItem('users', JSON.stringify(users));
  await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

  return { success: true, user: newUser };
};