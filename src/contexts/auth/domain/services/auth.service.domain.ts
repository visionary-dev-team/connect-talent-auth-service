import { User } from '../../../users/infrastructure/entities/user.orm-entity';

export interface IAuthService {
  generateToken(user: User): Promise<string>;
  validateUser(payload: any): Promise<User | null>;
}
