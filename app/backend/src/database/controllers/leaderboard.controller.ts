import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';

export default class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService = new LeaderboardService()) {}

  async getAllDataLeaderboard(req: Request, res: Response): Promise<void> {
    const leaderboard = await this.leaderboardService.getLeaderboardData();
    res.status(leaderboard.status).json(leaderboard.data);
  }
}
