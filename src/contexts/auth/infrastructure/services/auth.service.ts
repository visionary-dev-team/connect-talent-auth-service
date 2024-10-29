import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../../domain/services/auth.service.domain';
// import { UserService } from 'src/contexts/users/infrastructure/services/typeorm-user.service';
import { User } from 'src/contexts/users/infrastructure/repositories/user.orm-entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService
    // private readonly userService: UserService
  ) {}

  async generateToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
  async generateRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async validateUser(payload: any): Promise<User | null> {
    // return this.userService.findOne(payload.sub);
    return null;
  }
}
