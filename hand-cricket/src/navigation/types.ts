import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface GameCompletionParams {
  overs: number;
  userScore: number;
  userWickets: number;
  botScore: number;
  botWickets: number;
  userOvers: number;
  userBalls: number;
  botOvers: number;
  botBalls: number;
  winner: 'user' | 'bot' | null;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TossArena: { overs: number };
  GameArena: { overs: number };
  GameCompletion: GameCompletionParams;
  UpdatePassword: undefined;
  GameRules: undefined;
};

export const useAppNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();