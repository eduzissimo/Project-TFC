import { IMatches } from './IMatches';

export interface IMatchModel {
  getAllMatches(): Promise<IMatches[]>;
  finishedMatches(matchId: number): Promise<number[]>;
  updateGoals(matchId: number, homeTeamGoals: number, awayTeamGoals: number): Promise<number[]>;
  createMatches(
    homeTeamId: number, homeTeamGoals:number, awayTeamId: number, awayTeamGoals:number
  ): Promise<IMatches>;
}
