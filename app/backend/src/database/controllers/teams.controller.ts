import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';
import handleResponse from '../utils/responseHandler';

export default class TeamsController {
  constructor(private teamsService: TeamsService = new TeamsService()) {}

  async getAllTeams(_req: Request, res: Response) {
    const teams = await this.teamsService.getAllTeams();
    handleResponse(res, teams);
  }

  async getTeamsById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.teamsService.getTeamsById(Number(id));
    handleResponse(res, team);
  }
}
