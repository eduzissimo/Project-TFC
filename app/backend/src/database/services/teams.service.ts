import { ModelStatic } from 'sequelize';
import ITeamsService from '../../Interfaces/ITeamsService';
import SequelizeTeams from '../models/SequelizeTeams';

export default class TeamsService implements ITeamsService {
  protected teamsModel: ModelStatic<SequelizeTeams> = SequelizeTeams;

  async getAllTeams(): Promise<SequelizeTeams[]> {
    return this.teamsModel.findAll();
  }

  async getTeamsById(id: number): Promise<SequelizeTeams> {
    const team = await this.teamsModel.findByPk(id);
    return team as SequelizeTeams;
  }
}
