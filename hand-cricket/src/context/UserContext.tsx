import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  userId?: number;
  username: string;
  email: string;
  password?: string;
  avatar?: number;
  played?: number;
  wins?: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const parsed = JSON.parse(currentUser);
        parsed.played = parsed.played || 0;
        parsed.wins = parsed.wins || 0;
        setUserState(parsed);
      }
    };
    loadUser();
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUserState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Async side-effect: persist to storage
      (async () => {
        await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
        const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
        const index = users.findIndex((u: User) => u.userId === updated.userId);
        if (index !== -1) {
          users[index] = updated;
          await AsyncStorage.setItem('users', JSON.stringify(users));
        }
      })();
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('currentUser');
    setUserState(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, updateUser, logout }),
    [user, setUser, updateUser, logout],
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};