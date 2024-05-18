import { Request, Response } from 'express';
import UsersService from '../services/users.service';
import mapStatusHTTP from '../utils/mapStatusHTTP';

const { BAD_REQUEST, UNAUTHORIZED } = mapStatusHTTP;

export default class UsersController {
  constructor(private usersService: UsersService = new UsersService()) { }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(BAD_REQUEST).json({ message: 'All fields must be filled' });
      return;
    }
    const validateEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!validateEmail.test(email) || password.length < 6) {
      res.status(UNAUTHORIZED).json({ message: 'Invalid email or password' });
      return;
    }
    const userLogin = await this.usersService.login(email, password);
    res.status(userLogin.status).json(userLogin.data);
  }

  async getRole(req: Request, res: Response) {
    const { email } = res.locals.user;
    const userRole = await this.usersService.getRole(email);
    res.status(userRole.status).json(userRole.data);
  }
}
