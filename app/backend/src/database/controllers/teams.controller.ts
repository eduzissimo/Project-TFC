import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  private _teamsService: TeamsService;

  constructor(teamsService: TeamsService) {
    this._teamsService = teamsService;
  }

  async getAllTeams(_req: Request, res: Response) {
    const teams = await this._teamsService.getAllTeams();
    return res.status(200).json(teams);
  }

  async getTeamsById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this._teamsService.getTeamsById(Number(id));
    res.status(200).json(team);
  }
}
