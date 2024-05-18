import SequelizeMatches from './SequelizeMatches';
import { IMatches } from '../../Interfaces/IMatches';
import { IMatchModel } from '../../Interfaces/IMatchModel';

export default class MatchModel implements IMatchModel {
  private matches = SequelizeMatches;

  async getAllMatches(): Promise<IMatches[]> {
    const data = await this.matches.findAll({
      include: [
        { association: 'homeTeam', attributes: { exclude: ['id'] } },
        { association: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return data;
  }

  async finishedMatches(matchId: number): Promise<number[]> {
    const data = await this.matches.update({ inProgress: false }, { where: { id: matchId } });
    return data;
  }

  async updateGoals(matchId: number, homeTeamGoals: number, awayTeamGoals: number):
  Promise<number[]> {
    const data = await this.matches.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id: matchId } },
    );
    return data;
  }

  async createMatches(
    homeTeamId: number,
    homeTeamGoals: number,
    awayTeamId: number,
    awayTeamGoals: number,
  ): Promise<IMatches> {
    const data = await this.matches.create({
      homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress: true,
    });
    return data;
  }
}
