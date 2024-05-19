import MatchModel from '../models/MatchModel';
import { IMatches } from '../../Interfaces/IMatches';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IMatchModel } from '../../Interfaces/IMatchModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';

const { OK, UNPROCESSABLE_ENTITY, CREATED, NOT_FOUND } = mapStatusHTTP;

type StatusProgress = 'true' | 'false' | undefined;
type ErrorMessage = { message: string };

export default class MatchesService {
  private static readonly invalidTeamRes = {
    status: NOT_FOUND,
    data: { message: 'There is no team with such id!' },
  };

  private static readonly invalidMatchRes = {
    status: UNPROCESSABLE_ENTITY,
    data: { message: 'It is not possible to create a match with two equal teams' },
  };

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
    if (homeTeamId === awayTeamId) return MatchesService.invalidMatchRes;

    const teams = await this.matchesModel.getAllMatches();
    const homeTeam = teams.find((team) => team.id === homeTeamId);
    const awayTeam = teams.find((team) => team.id === awayTeamId);

    if (!homeTeam || !awayTeam) return MatchesService.invalidTeamRes;

    const match = await this.matchesModel.createMatches(
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
    );
    return { status: CREATED, data: match };
  }
}
