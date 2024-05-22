import { ILeaderboard } from '../../Interfaces/ILeaderboard';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import ITeamsModel from '../../Interfaces/ITeamsModel';
import { ILeaderboardModel } from '../../Interfaces/ILeaderboardModel';
import LeaderboardModel from '../models/LeaderboardModel';
import TeamModel from '../models/TeamModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import {
  calculateTotalPoints,
  calculateTotalGames,
  calculateTotalVictories,
  calculateTotalDraws,
  calculateTotalLosses,
  calculateGoalsFavor,
  calculateGoalsOwn,
} from '../utils/calculate';
import sortTeams from '../utils/sortTeams';

export default class LeaderboardService {
  constructor(
    private leaderboardModel: ILeaderboardModel = new LeaderboardModel(),
    private teamsModel: ITeamsModel = new TeamModel(),
  ) {}

  async getLeaderboardData(): Promise<ServiceResponse<ILeaderboard[]>> {
    const teams = await this.teamsModel.getAllTeams();
    const matches = await this.leaderboardModel.getLeaderboardMatches();

    const leaderboard = teams.map((team) => ({
      name: team.teamName,
      totalPoints: calculateTotalPoints(team.id, matches),
      totalGames: calculateTotalGames(team.id, matches),
      totalVictories: calculateTotalVictories(team.id, matches),
      totalDraws: calculateTotalDraws(team.id, matches),
      totalLosses: calculateTotalLosses(team.id, matches),
      goalsFavor: calculateGoalsFavor(team.id, matches),
      goalsOwn: calculateGoalsOwn(team.id, matches),
      goalsBalance: calculateGoalsFavor(team.id, matches) - calculateGoalsOwn(team.id, matches),
      efficiency: Number(((calculateTotalPoints(team.id, matches)
      / (calculateTotalGames(team.id, matches) * 3)) * 100).toFixed(2)),
    }));

    return { status: mapStatusHTTP.OK, data: sortTeams(leaderboard) };
  }
}
