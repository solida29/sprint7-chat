import { IUser } from '../entities/IUser';

// interface de los servicios (application/userService.ts)
export interface IUserRepository {
  register(user: IUser): Promise<IUser | null>;
  login(user: IUser): Promise<IUser | null>;
}
