import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { ValidateUserCredentialsUseCase } from 'src/contexts/users/application/validate-user-credential.use-case';
import { ResponseLoginAuthDto } from '../dtos/response-login.auth.dto';
import { CreateProfileDTO } from 'src/contexts/profile/adapters/dtos/create-profile.dto';
// import { UserService } from 'src/contexts/users/infrastructure/services/typeorm-user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly userService: UserService
    private readonly validateUserCredentialUseCase: ValidateUserCredentialsUseCase
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseLoginAuthDto> {
    const user = await this.validateUserCredentialUseCase.execute(
      loginDto.email,
      loginDto.password
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = await this.authService.generateToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    return {
      user: {
        id: user.id,
        profile: user.profile as CreateProfileDTO,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
