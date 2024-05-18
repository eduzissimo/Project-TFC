import SequelizeTeams from './SequelizeTeams';
import { ITeam } from '../../Interfaces/ITeam';
import ITeamsModel from '../../Interfaces/ITeamsModel';

export default class TeamModel implements ITeamsModel {
  private model = SequelizeTeams;

  async getAllTeams(): Promise<ITeam[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  async getTeamsById(id: number): Promise<ITeam | null> {
    const team = await this.model.findByPk(id);
    return team;
  }
}
