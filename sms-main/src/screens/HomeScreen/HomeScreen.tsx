import React, { memo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeScreenContent } from './components';
import { RootStackParamList } from '../../navigation/AppNavigator';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = memo(({ navigation }) => {
  return <HomeScreenContent navigation={navigation} />;
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
