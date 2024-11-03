import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../../domain/services/auth.service.domain';
// import { UserService } from 'src/contexts/users/infrastructure/services/typeorm-user.service';
import { User } from 'src/contexts/users/infrastructure/entities/user.orm-entity';
import { FindByIdUserUseCase } from 'src/contexts/users/application/find-by-id-user.use-case';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly finByIdUserRepository: FindByIdUserUseCase
  ) {}

  async generateToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
  async generateRefreshToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async validateUser(payload: any): Promise<User | null> {
    const { id } = payload;
    const user = await this.finByIdUserRepository.execute(id);

    return user;
  }
}
