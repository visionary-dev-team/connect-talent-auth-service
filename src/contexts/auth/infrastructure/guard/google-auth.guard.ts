import { AuthGuard } from '@nestjs/passport';
import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {}
