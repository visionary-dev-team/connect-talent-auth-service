import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AppConfig } from 'src/config/env.config';
import { ValidRoles } from 'src/contexts/shared/auth/models/valid-roles.enum';
import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';
import { CreateUserDto } from 'src/contexts/users/adapter/dtos/create-user.dto';
import { AuthProvider } from 'src/contexts/users/infrastructure/entities/user.orm-entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly appConfig: AppConfig) {
    super({
      clientID: appConfig.googleClientID,
      clientSecret: appConfig.googlesSecret,
      callbackURL: appConfig.googleCallback,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user: CreateUserDto = {
      email: emails,
      password: 'hashed-google',
      role: ValidRoles.COLLABORATOR, 
      provider: AuthProvider.GOOGLE,
      providerId: id,
      profile: {
        firstName: name.givenName,
        lastName: name.familyName,
        profilePictureUrl: photos[0].value,
      } as any,
    };
 ;

    done(null, user);
  }
}
