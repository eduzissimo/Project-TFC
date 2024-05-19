import * as sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import MatchesService from '../database/services/matches.service';
import { IMatches } from '../Interfaces/IMatches';
import MatchModel from '../database/models/MatchModel';
import mapStatusHTTP from '../database/utils/mapStatusHTTP';

chai.use(chaiHttp);
const { expect } = chai;

const { OK, UNPROCESSABLE_ENTITY, CREATED, NOT_FOUND } = mapStatusHTTP;

describe('MatchesService', () => {
  let matchesService: MatchesService;
  let matchModelStub: sinon.SinonStubbedInstance<MatchModel>;

  beforeEach(() => {
    matchModelStub = sinon.createStubInstance(MatchModel);
    matchesService = new MatchesService(matchModelStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllMatches', () => {
    it('Deve retornar todas as partidas com o status OK', async () => {
      const matches: IMatches[] = [{ id: 1, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 1, awayTeamGoals: 2 }];
      matchModelStub.getAllMatches.resolves(matches);

      const response = await matchesService.getAllMatches(undefined);

      expect(response.status).to.equal(OK);
      expect(response.data).to.deep.equal(matches);
    });

    it('Deve retornar as partidas com base no statusProgress', async () => {
      const matches: IMatches[] = [
        { id: 1, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 1, awayTeamGoals: 2 },
        { id: 2, homeTeamId: 3, awayTeamId: 4, inProgress: false, homeTeamGoals: 3, awayTeamGoals: 4 }
      ];
      matchModelStub.getAllMatches.resolves(matches);

      const response = await matchesService.getAllMatches('true');

      expect(response.status).to.equal(OK);
      expect(response.data).to.deep.equal([matches[0]]);
    });
  });

  describe('finishedMatches', () => {
    it('Deve retornar OK quando uma partida for finalizada', async () => {
      matchModelStub.finishedMatches.resolves([1]);

      const response = await matchesService.finishedMatches(1);

      expect(response.status).to.equal(OK);
      expect(response.data).to.deep.equal([1]);
    });

    it('Deve retornar NOT_FOUND caso a partida não for encontrada', async () => {
      matchModelStub.finishedMatches.resolves([0]);

      const response = await matchesService.finishedMatches(1);

      expect(response.status).to.equal(NOT_FOUND);
      expect(response.data).to.deep.equal([0]);
    });
  });

  describe('updateGoals', () => {
    it('Retorna OK caso os gols sejam atualizados', async () => {
      matchModelStub.updateGoals.resolves([1]);

      const response = await matchesService.updateGoals(1, 2, 3);

      expect(response.status).to.equal(OK);
      expect(response.data).to.deep.equal([1]);
    });

    it('Deve retornar NOT_FOUND se uma partida não for achada', async () => {
      matchModelStub.updateGoals.resolves([0]);

      const response = await matchesService.updateGoals(1, 2, 3);

      expect(response.status).to.equal(NOT_FOUND);
      expect(response.data).to.deep.equal([0]);
    });
  });

  describe('createMatches', () => {
    it('Retorna UNPROCESSABLE_ENTITY se homeTeamId = awayTeamId ', async () => {
      const response = await matchesService.createMatches(1, 2, 1, 2);

      expect(response.status).to.equal(UNPROCESSABLE_ENTITY);
      expect(response.data).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
    });

    it('Deve retornar NOT_FOUND se caso um dos times não for encontrado', async () => {
      matchModelStub.getAllMatches.resolves([{ id: 1, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 1, awayTeamGoals: 2 }]);

      const response = await matchesService.createMatches(1, 2, 3, 4);

      expect(response.status).to.equal(NOT_FOUND);
      expect(response.data).to.deep.equal({ message: 'There is no team with such id!' });
    });

    it('Deve criar uma partida e retornar o status CREATED', async () => {
      const matches: IMatches[] = [
        { id: 1, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 1, awayTeamGoals: 2 },
        { id: 2, homeTeamId: 3, awayTeamId: 4, inProgress: false, homeTeamGoals: 3, awayTeamGoals: 4 }
      ];
      const newMatch: IMatches = { id: 3, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 2, awayTeamGoals: 3 };
      matchModelStub.getAllMatches.resolves(matches);
      matchModelStub.createMatches.resolves(newMatch);

      const response = await matchesService.createMatches(1, 2, 2, 3);

      expect(response.status).to.equal(CREATED);
      expect(response.data).to.deep.equal(newMatch);
    });
  });

  describe('Testando a endopoint Matches', () => {
    let chaiHttpResponse: Response;

    it('Deve retornar status 200 quando a rota for "/matches" juntamente das partidas ', async () => {
      chaiHttpResponse = await chai.request(app).get('/matches');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.be.have.property('homeTeamId', 16);
      expect(chaiHttpResponse.body).to.be.have.property('awayTeamId', 8);
      expect(chaiHttpResponse.body).to.be.have.property('homeTeamGoals', 1);
      expect(chaiHttpResponse.body).to.be.have.property('awayTeamGoals', 1);
      expect(chaiHttpResponse.body).to.be.have.property('inProgress', false);
    });

    it('Deve retornar status 200 quando a rota for "/matches/:id" juntamente da partida ', async () => {
      chaiHttpResponse = await chai.request(app).get('/matches/1');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.have.property('homeTeamId', 16);
      expect(chaiHttpResponse.body).to.be.have.property('awayTeamId', 8);
      expect(chaiHttpResponse.body).to.be.have.property('homeTeamGoals', 1);
      expect(chaiHttpResponse.body).to.be.have.property('awayTeamGoals', 1);
      expect(chaiHttpResponse.body).to.be.have.property('inProgress', false);
    });
  });
});
