import { Request, Response } from 'express';
import MatchesService from '../services/matches.service';
import handleResponse from '../utils/responseHandler';

export default class MatchesController {
  constructor(private matchesService: MatchesService = new MatchesService()) {}

  async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    const matches = await this.matchesService.getAllMatches(
      inProgress as 'true' | 'false' | undefined,
    );
    handleResponse(res, matches);
  }

  async finishedMatches(req: Request, res: Response) {
    const { id } = req.params;
    const match = await this.matchesService.finishedMatches(Number(id));
    handleResponse(res, match);
  }

  async updateGoals(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const match = await this.matchesService.updateGoals(
      Number(id),
      homeTeamGoals,
      awayTeamGoals,
    );
    handleResponse(res, match);
  }

  async createMatches(req: Request, res: Response) {
    const { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals } = req.body;
    const match = await this.matchesService.createMatches(
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
    );
    handleResponse(res, match);
  }
}
