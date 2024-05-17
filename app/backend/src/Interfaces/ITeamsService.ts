import { ITeam } from './ITeam';

export default interface ITeamsService {
  getAllTeams(): Promise<ITeam[]>;
  getTeamsById(id: number): Promise<ITeam>;
}
