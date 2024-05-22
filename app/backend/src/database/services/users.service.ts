import { compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../models/UsersModel';
import { IUsersModel } from '../../Interfaces/IUsersModel';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { invalidCredentialsRes } from '../utils/constant';
import { ErrorResponse, LoginResponse, RoleResponse } from '../types/users.type';

const { OK } = mapStatusHTTP;

export default class UsersService {
  constructor(private usersModel: IUsersModel = new UserModel()) {}

  async login(
    email: string,
    password: string,
  ): Promise<ServiceResponse<LoginResponse | ErrorResponse>> {
    const userEmail = await this.usersModel.getAllUsers(email);
    if (!userEmail) return invalidCredentialsRes;

    const checkPassword = await compare(password, userEmail.password);
    if (!checkPassword) return invalidCredentialsRes;

    const payload = { email: userEmail.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return { status: OK, data: { token } };
  }

  async getRole(email: string): Promise<ServiceResponse<RoleResponse | ErrorResponse>> {
    const user = await this.usersModel.getAllUsers(email);
    if (!user) return invalidCredentialsRes;

    return { status: OK, data: { role: user.role } };
  }
}
