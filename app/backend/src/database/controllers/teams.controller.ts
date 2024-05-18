import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  constructor(private teamsService: TeamsService = new TeamsService()) { }

  async getAllTeams(_req: Request, res: Response) {
    const teams = await this.teamsService.getAllTeams();
    res.status(teams.status).json(teams.data);
  }

  async getTeamsById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.teamsService.getTeamsById(Number(id));
    res.status(team.status).json(team.data);
  }
}
