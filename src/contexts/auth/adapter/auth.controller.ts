import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../infrastructure/services/auth.service';
// import { UserService } from 'src/contexts/users/infrastructure/services/typeorm-user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
    // private readonly userService: UserService
  ) {}

  // @Post('login')
  // async login(
  //   @Body() loginDto: { email: string; password: string }
  // ): Promise<{ accessToken: string }> {
  //   const user = await this.userService.validateUserCredentials(
  //     loginDto.email,
  //     loginDto.password
  //   );
  //   if (!user) {
  //     throw new Error('Invalid credentials');
  //   }

  //   const accessToken = await this.authService.generateToken(user);
  //   return { accessToken };
  // }
}
