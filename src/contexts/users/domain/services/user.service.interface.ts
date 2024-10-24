import { User } from '../model/user.entity';

export interface UserServiceInterface {
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
