import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/user.module';
import { JwtStrategy } from './infrastructure/strategy/auth.strategy';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthController } from './adapters/controllers/auth.controller';
import { ValidateUserCredentialsUseCase } from '../users/application/validate-user-credential.use-case';
import { IUserRepositoryToken } from '../users/domain/repositories/user.repository.interface';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    // ConfigModule, 
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: ValidateUserCredentialsUseCase,
      useFactory: (userRepository) => {
        return new ValidateUserCredentialsUseCase(userRepository);
      },
      inject: [IUserRepositoryToken], // Inyecta el token del repositorio que necesitas
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
