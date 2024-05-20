import { IMatches } from './IMatches';

export interface ILeaderboardModel {
  getLeaderboardMatches(): Promise<IMatches[]>;
}
