import MatchModel from '../models/MatchModel';
import { IMatches } from '../../Interfaces/IMatches';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IMatchModel } from '../../Interfaces/IMatchModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { invalidTeamRes, invalidMatchRes } from '../utils/constant';
import { StatusProgress, ErrorMessage } from '../types/matches.type';

const { OK, CREATED, NOT_FOUND } = mapStatusHTTP;

export default class MatchesService {
  constructor(private matchesModel: IMatchModel = new MatchModel()) {}

  async getAllMatches(statusProgress: StatusProgress): Promise<ServiceResponse<IMatches[]>> {
    const matchesData = await this.matchesModel.getAllMatches();
    const filteredMatches = statusProgress
      ? matchesData.filter((match) => match.inProgress.toString() === statusProgress)
      : matchesData;
    return { status: OK, data: filteredMatches };
  }

  async finishedMatches(matchId: number): Promise<ServiceResponse<number[]>> {
    const match = await this.matchesModel.finishedMatches(matchId);
    const status = match[0] === 0 ? NOT_FOUND : OK;
    return { status, data: match };
  }

  async updateGoals(
    matchId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<number[]>> {
    const match = await this.matchesModel.updateGoals(matchId, homeTeamGoals, awayTeamGoals);
    const status = match[0] === 0 ? NOT_FOUND : OK;
    return { status, data: match };
  }

  async createMatches(
    homeTeamId: number,
    homeTeamGoals: number,
    awayTeamId: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<IMatches | ErrorMessage>> {
    if (homeTeamId === awayTeamId) return invalidMatchRes;

    const teams = await this.matchesModel.getAllMatches();
    const homeTeam = teams.find((team) => team.id === homeTeamId);
    const awayTeam = teams.find((team) => team.id === awayTeamId);

    if (!homeTeam || !awayTeam) return invalidTeamRes;

    const match = await this.matchesModel.createMatches(
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
    );
    return { status: CREATED, data: match };
  }
}
