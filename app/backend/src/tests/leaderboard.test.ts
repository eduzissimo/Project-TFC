import * as sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import LeaderboardService from '../database/services/leaderboard.service';
import TeamModel from '../database/models/TeamModel';
import LeaderboardModel from '../database/models/LeaderboardModel';
import ITeamsModel from '../Interfaces/ITeamsModel';
import { ILeaderboardModel } from '../Interfaces/ILeaderboardModel';
import { IMatches } from '../Interfaces/IMatches';
import { ITeam } from '../Interfaces/ITeam';

chai.use(chaiHttp);
const { expect } = chai;

describe('LeaderboardService', () => {
  let leaderboardService: LeaderboardService;
  let teamModelStub: sinon.SinonStubbedInstance<ITeamsModel>;
  let leaderboardModelStub: sinon.SinonStubbedInstance<ILeaderboardModel>;

  beforeEach(() => {
    teamModelStub = sinon.createStubInstance(TeamModel);
    leaderboardModelStub = sinon.createStubInstance(LeaderboardModel);
    leaderboardService = new LeaderboardService(leaderboardModelStub, teamModelStub);
  });

  it('Deve retornar os dados da leadeboard corretamente', async () => {
    const teams: ITeam[] = [
      { id: 1, teamName: 'Team A' },
      { id: 2, teamName: 'Team B' },
    ];
    const matches: IMatches[] = [
      { id: 1, homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 2, awayTeamGoals: 1, inProgress: false },
      { id: 2, homeTeamId: 2, awayTeamId: 1, homeTeamGoals: 0, awayTeamGoals: 3, inProgress: false },
    ];

    teamModelStub.getAllTeams.resolves(teams);
    leaderboardModelStub.getLeaderboardMatches.resolves(matches);

    const result = await leaderboardService.getLeaderboardData();
    expect(result.status).to.equal(200);
    expect(result.data).to.be.an('array');
    expect(result.data).to.have.lengthOf(2);
    expect(result.data[0]).to.include({ name: 'Team A', totalPoints: 6 });
    expect(result.data[1]).to.include({ name: 'Team B', totalPoints: 0 });
  });
});
