import * as sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import * as bcrypt from 'bcryptjs';
import { Response } from 'superagent';
import * as jwt from 'jsonwebtoken';
import UserModel from '../database/models/UsersModel';
import UsersService from '../database/services/users.service';
import { IUsers } from '../Interfaces/IUsers';
import mapStatusHTTP from '../database/utils/mapStatusHTTP';

chai.use(chaiHttp);

const { expect } = chai;

const { OK, UNAUTHORIZED } = mapStatusHTTP;

describe('UsersService', () => {
  let usersService: UsersService;
  let userModelStub: sinon.SinonStubbedInstance<UserModel>;
  let jwtSignStub: sinon.SinonStub;
  let bcryptCompareStub: sinon.SinonStub;

  beforeEach(() => {
    userModelStub = sinon.createStubInstance(UserModel);
    usersService = new UsersService(userModelStub);
    jwtSignStub = sinon.stub(jwt, 'sign');
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
  });

  afterEach(() => {
    sinon.restore();
  });

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

  describe('login', () => {
    it('Deve retornar UNAUTHORIZED caso email não seja encontrado', async () => {
      userModelStub.getAllUsers.resolves(null);

      const response = await usersService.login('test@example.com', 'password');

      expect(response.status).to.equal(UNAUTHORIZED);
      expect(response.data).to.deep.equal({ message: 'Invalid email or password' });
    });

    it('Deve retornar UNAUTHORIZED caso a senha não for validada', async () => {
      const user: IUsers = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedPassword', role: 'user' };
      userModelStub.getAllUsers.resolves(user);
      bcryptCompareStub.resolves(false);

      const response = await usersService.login('test@example.com', 'wrongpassword');

      expect(response.status).to.equal(UNAUTHORIZED);
      expect(response.data).to.deep.equal({ message: 'Invalid email or password' });
    });

    it('Deve retornar OK se o token for validado', async () => {
      const user: IUsers = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedPassword', role: 'user' };
      const token = 'jwtToken';
      userModelStub.getAllUsers.resolves(user);
      bcryptCompareStub.resolves(true);
      jwtSignStub.returns(token);

      const response = await usersService.login('test@example.com', 'correctpassword');

      expect(response.status).to.equal(OK);
      expect(response.data).to.deep.equal({ token });
      expect(jwtSignStub.calledOnce).to.be.true;
    });
  });

  describe('getRole', () => {
    it('Deve retornar UNAUTHORIZED caso email não for validado', async () => {
      userModelStub.getAllUsers.resolves(null);

      const response = await usersService.getRole('test@example.com');

      expect(response.status).to.equal(UNAUTHORIZED);
      expect(response.data).to.deep.equal({ message: 'Invalid email or password' });
    });

    it('Deve retornar OK se o email for encontrado', async () => {
      const user: IUsers = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedPassword', role: 'user' };
      userModelStub.getAllUsers.resolves(user);

      const response = await usersService.getRole('test@example.com');

      expect(response.status).to.equal(OK);
      expect(response.data).to.deep.equal({ role: 'user' });
      });
    });
  });
});