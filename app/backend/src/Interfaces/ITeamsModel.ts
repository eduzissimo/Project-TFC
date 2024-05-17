import { ITeam } from './ITeam';

export default interface ITeamsModel {
  getAllTeams(): Promise<ITeam[]>;
  getTeamsById(id: ITeam['id']): Promise<ITeam | null>;
}
