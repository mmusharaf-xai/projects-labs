import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../db/schema';

interface AuthContextType {
  currentUser: User | null;
  currentUserId: number | null;
  setCurrentUser: (user: User | null) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@current_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      // Error loading stored user - continue without user
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  const setCurrentUser = useCallback(async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      setCurrentUserState(user);
    } catch (error) {
      // Error storing user
    }
  }, []);

  const logout = useCallback(async () => {
    await setCurrentUser(null);
  }, [setCurrentUser]);

  const currentUserId = useMemo(() => currentUser?.id ?? null, [currentUser]);

  const value: AuthContextType = useMemo(() => ({
    currentUser,
    currentUserId,
    setCurrentUser,
    logout,
    isLoading,
  }), [currentUser, currentUserId, setCurrentUser, logout, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
