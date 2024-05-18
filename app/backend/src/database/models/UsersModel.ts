import SequelizeUser from './SequelizeUsers';
import { IUsersModel } from '../../Interfaces/IUsersModel';
import { IUsers } from '../../Interfaces/IUsers';

export default class UserModel implements IUsersModel {
  private model = SequelizeUser;

  async getAllUsers(email: string): Promise<IUsers | null> {
    const users = await this.model.findOne({ where: { email } });
    return users;
  }
}
