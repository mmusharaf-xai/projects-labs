import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';
import { RootStackParamList } from './types';
import {
  AuthScreen,
  HomeScreen,
  RankingScreen,
  HistoryScreen,
  ProfileScreen,
  TossArenaScreen,
  GameArenaScreen,
  GameCompletionScreen,
  UpdatePasswordScreen,
  GameRulesScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: route.name === 'Profile' ? { display: 'none' } : {
          backgroundColor: isDark ? 'rgba(10,26,17,0.95)' : colors.surface,
          borderTopColor: colors.surfaceBorder,
          height: 80,
          paddingHorizontal: 24,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#5a8b6d' : colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Ranking') {
            iconName = 'leaderboard';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return (
            <MaterialIcons
              name={iconName}
              size={24}
              color={color}
              style={focused && route.name === 'Home' ? { fontVariationSettings: "'FILL' 1" } as any : undefined}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const AppNavigatorContent: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<'Auth' | 'Main'>('Auth');

  useEffect(() => {
    const checkLogin = async () => {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        setInitialRoute('Main');
      }
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="TossArena" component={TossArenaScreen} />
        <Stack.Screen name="GameArena" component={GameArenaScreen} />
        <Stack.Screen name="GameCompletion" component={GameCompletionScreen} />
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
        <Stack.Screen name="GameRules" component={GameRulesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigatorContent />
        </GestureHandlerRootView>
      </UserProvider>
    </ThemeProvider>
  );
};

export default AppNavigator;