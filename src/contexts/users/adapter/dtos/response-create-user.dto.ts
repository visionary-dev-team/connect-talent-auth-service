import { TokensDto } from 'src/contexts/shared/auth/adapter/dtos/responsej-jwt.auth.dto';
import { UserBasicResponseDto } from './user-basic-response.dto';

export class ResponseCreateUserDto {
  user: UserBasicResponseDto;
  tokens: TokensDto;
}
