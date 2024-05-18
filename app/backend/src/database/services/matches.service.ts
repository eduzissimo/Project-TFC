import MatchModel from '../models/MatchModel';
import { IMatches } from '../../Interfaces/IMatches';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IMatchModel } from '../../Interfaces/IMatchModel';
import mapStatusHTTP from '../utils/mapStatusHTTP';

const { OK } = mapStatusHTTP;
const { UNPROCESSABLE_ENTITY } = mapStatusHTTP;
const { CREATED } = mapStatusHTTP;
const { NOT_FOUND } = mapStatusHTTP;

type StatusProgress = 'true' | 'false' | undefined;
type ErrorMessage = { message: string };

export default class MatchesService {
  private static readonly invalidTeam = {
    status: NOT_FOUND,
    data: { message: 'There is no team with such id!' },
  };

  private static readonly invalidMatch = {
    status: UNPROCESSABLE_ENTITY,
    data: { message: 'It is not possible to create a match with two equal teams' },
  };

  constructor(private matchesModel: IMatchModel = new MatchModel()) {}

  async getAllMatches(statusProgress: StatusProgress): Promise<ServiceResponse<IMatches[]>> {
    const matchesData = await this.matchesModel.getAllMatches();
    if (statusProgress) {
      const matchesFiltered = matchesData.filter(
        (match) => match.inProgress.toString() === statusProgress,
      );
      return { status: OK, data: matchesFiltered };
    }
    return { status: OK, data: matchesData };
  }

  async finishedMatches(matchId: number): Promise<ServiceResponse<number[]>> {
    const match = await this.matchesModel.finishedMatches(matchId);
    if (match[0] === 0) return { status: NOT_FOUND, data: match };
    return { status: OK, data: match };
  }

  async updateGoals(
    matchId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<number[]>> {
    const match = await this.matchesModel.updateGoals(matchId, homeTeamGoals, awayTeamGoals);
    if (match[0] === 0) return { status: NOT_FOUND, data: match };
    return { status: OK, data: match };
  }

  async createMatches(
    homeTeamId: number,
    homeTeamGoals: number,
    awayTeamId: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<IMatches | ErrorMessage>> {
    if (homeTeamId === awayTeamId) return MatchesService.invalidMatch;
    const teams = await this.matchesModel.getAllMatches();
    const homeTeam = teams.find((team) => team.id === homeTeamId);
    const awayTeam = teams.find((team) => team.id === awayTeamId);
    if (!homeTeam || !awayTeam) return MatchesService.invalidTeam;

    const match = await this.matchesModel.createMatches(
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
    );
    return { status: CREATED, data: match };
  }
}
