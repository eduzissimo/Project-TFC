import { ILeaderboard } from '../../Interfaces/ILeaderboard';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IMatches } from '../../Interfaces/IMatches';
import ITeamsModel from '../../Interfaces/ITeamsModel';
import { ILeaderboardModel } from '../../Interfaces/ILeaderboardModel';
import LeaderboardModel from '../models/LeaderboardModel';
import TeamModel from '../models/TeamModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';

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
      totalPoints: LeaderboardService.calculateTotalPoints(team.id, matches),
      totalGames: LeaderboardService.calculateTotalGames(team.id, matches),
      totalVictories: LeaderboardService.calculateTotalVictories(team.id, matches),
      totalDraws: LeaderboardService.calculateTotalDraws(team.id, matches),
      totalLosses: LeaderboardService.calculateTotalLosses(team.id, matches),
      goalsFavor: LeaderboardService.calculateGoalsFavor(team.id, matches),
      goalsOwn: LeaderboardService.calculateGoalsOwn(team.id, matches),
      goalsBalance: LeaderboardService.calculateGoalsFavor(team.id, matches)
      - LeaderboardService.calculateGoalsOwn(team.id, matches),
      efficiency: Number(((LeaderboardService.calculateTotalPoints(team.id, matches)
      / (LeaderboardService.calculateTotalGames(team.id, matches) * 3)) * 100).toFixed(2)),
    }));
    return { status: mapStatusHTTP.OK, data: LeaderboardService.sortTeams(leaderboard) };
  }

  private static calculateTotalGames(teamId: number, matches: IMatches[]): number {
    return matches.filter(
      (match) => match.homeTeamId === teamId || match.awayTeamId === teamId,
    ).length;
  }

  private static calculateTotalPoints(teamId: number, matches: IMatches[]): number {
    return matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) {
        if (match.homeTeamGoals > match.awayTeamGoals) return acc + 3;
        if (match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
      }
      if (match.awayTeamId === teamId) {
        if (match.awayTeamGoals > match.homeTeamGoals) return acc + 3;
        if (match.awayTeamGoals === match.homeTeamGoals) return acc + 1;
      }
      return acc;
    }, 0);
  }

  private static calculateTotalVictories(teamId: number, matches: IMatches[]): number {
    return matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId && match.homeTeamGoals > match.awayTeamGoals) return acc + 1;
      if (match.awayTeamId === teamId && match.awayTeamGoals > match.homeTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  private static calculateTotalDraws(teamId: number, matches: IMatches[]): number {
    return matches.reduce((acc, match) => {
      if ((match.homeTeamId === teamId || match.awayTeamId === teamId)
      && match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  private static calculateTotalLosses(teamId: number, matches: IMatches[]): number {
    return matches.reduce((acc, match) => {
      if ((match.homeTeamId === teamId && match.homeTeamGoals < match.awayTeamGoals)
      || (match.awayTeamId === teamId && match.awayTeamGoals < match.homeTeamGoals)) return acc + 1;
      return acc;
    }, 0);
  }

  private static calculateGoalsFavor(teamId: number, matches: IMatches[]): number {
    return matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) return acc + match.homeTeamGoals;
      if (match.awayTeamId === teamId) return acc + match.awayTeamGoals;
      return acc;
    }, 0);
  }

  private static calculateGoalsOwn(teamId: number, matches: IMatches[]): number {
    return matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) return acc + match.awayTeamGoals;
      if (match.awayTeamId === teamId) return acc + match.homeTeamGoals;
      return acc;
    }, 0);
  }

  private static sortTeams(teams: ILeaderboard[]): ILeaderboard[] {
    return teams.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;

      if (a.totalVictories > b.totalVictories) return -1;
      if (a.totalVictories < b.totalVictories) return 1;

      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;

      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;

      return 0;
    });
  }
}
