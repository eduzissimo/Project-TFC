import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import { teamsMock } from './mocks/teams.mocks';
import SequelizeTeams from '../database/models/SequelizeTeams';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teste da requisição Teams', () => {
  let chaiHttpResponse: Response;

  it('Deve retornar status 200 quando a rota for "/" ', async () => {
    chaiHttpResponse = await chai.request(app).get('/');
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Deve retornar um array de times quando a rota for "/teams" ', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams');
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock);
  });

  it('Deve retornar um time específico quando a rota for "/teams/:id"', async () => {
    const idReal = 1;
    sinon
      .stub(SequelizeTeams, "findByPk")
      .resolves(
        teamsMock.find((team) => team.id === idReal) as any);
    const findTeamMock = teamsMock.find((team) => team.id === idReal);

    chaiHttpResponse = await chai.request(app).get(`/teams/1`);
    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).to.be.deep.equal(findTeamMock);
  });
});
