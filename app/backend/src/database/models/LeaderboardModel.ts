import { IMatches } from '../../Interfaces/IMatches';
import SequelizeMatches from './SequelizeMatches';
import { ILeaderboardModel } from '../../Interfaces/ILeaderboardModel';

export default class LeaderboardModel implements ILeaderboardModel {
  private matches = SequelizeMatches;

  async getLeaderboardMatches(): Promise<IMatches[]> {
    const data = await this.matches.findAll({
      where: { inProgress: false },
      include: [
        { association: 'homeTeam', attributes: { exclude: ['id'] } },
        { association: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return data;
  }
}
