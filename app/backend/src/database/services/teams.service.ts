import ITeamsModel from '../../Interfaces/ITeamsModel';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { ITeam } from '../../Interfaces/ITeam';
import TeamModel from '../models/TeamModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';

const { OK } = mapStatusHTTP;

export default class TeamsService {
  constructor(private teamsModel: ITeamsModel = new TeamModel()) {}

  async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamsModel.getAllTeams();
    return { status: OK, data: teams };
  }

  async getTeamsById(id: number): Promise<ServiceResponse<ITeam | null>> {
    const team = await this.teamsModel.getTeamsById(id);
    return { status: OK, data: team };
  }
}
