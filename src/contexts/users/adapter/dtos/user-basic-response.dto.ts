import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ValidRoles } from 'src/contexts/shared/auth/models/valid-roles.enum';

export class UserBasicResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  role: ValidRoles;
}
