import * as sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando a requisição Users', () => {
  let chaiHttpResponse: Response;

  it('Deve retornar erro 400 quando a rota for "/login" e não tiver o body', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send({});
    expect(chaiHttpResponse).to.have.status(400);
  });

  it('Deve retornar erro 401 quando a rota for "/login" e o email não for válido', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send({ email: 'email', password: '123456' });
    expect(chaiHttpResponse).to.have.status(401);
  });

  it('Deve retornar erro 401 quando a rota for "/login" e a senha for menor que 6 caracteres', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send({ email: 'teste', password: '123' });
    expect(chaiHttpResponse).to.have.status(401);
  });
});