// Game service - placeholder for future game history storage
// Stats updates are currently handled via UserContext.updateUser

export interface GameResult {
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