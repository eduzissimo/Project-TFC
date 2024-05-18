import { IUsers } from './IUsers';

export interface IUsersModel {
  getAllUsers(email:string): Promise<IUsers | null>;
}
