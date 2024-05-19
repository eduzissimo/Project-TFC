import { compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../models/UsersModel';
import { IUsersModel } from '../../Interfaces/IUsersModel';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import mapStatusHTTP from '../utils/mapStatusHTTP';

const { OK, UNAUTHORIZED } = mapStatusHTTP;

type LoginResponse = { token: string };
type ErrorResponse = { message: string };
type RoleResponse = { role: string };

export default class UsersService {
  private static readonly invalidCredentialsRes = {
    status: UNAUTHORIZED,
    data: { message: 'Invalid email or password' },
  };

  constructor(private usersModel: IUsersModel = new UserModel()) {}

  async login(
    email: string,
    password: string,
  ): Promise<ServiceResponse<LoginResponse | ErrorResponse>> {
    const userEmail = await this.usersModel.getAllUsers(email);
    if (!userEmail) return UsersService.invalidCredentialsRes;

    const checkPassword = await compare(password, userEmail.password);
    if (!checkPassword) return UsersService.invalidCredentialsRes;

    const payload = { email: userEmail.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return { status: OK, data: { token } };
  }

  async getRole(email: string): Promise<ServiceResponse<RoleResponse | ErrorResponse>> {
    const user = await this.usersModel.getAllUsers(email);
    if (!user) return UsersService.invalidCredentialsRes;

    return { status: OK, data: { role: user.role } };
  }
}
