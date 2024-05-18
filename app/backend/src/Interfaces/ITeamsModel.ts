import { ITeam } from './ITeam';

export default interface ITeamsModel {
  getAllTeams(): Promise<ITeam[]>;
  getTeamsById(id: number): Promise<ITeam | null>;
}
