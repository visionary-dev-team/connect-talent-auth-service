import { User } from '../../../users/infrastructure/repositories/user.orm-entity';

export interface IAuthService {
  generateToken(user: User): Promise<string>;
  validateUser(payload: any): Promise<User | null>;
}
