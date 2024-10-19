import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../content/users/domain/user.entity';
import { Profile } from '../content/profiles/domain/profile.entity';
import { Education } from '../content/education/domain/education.entity';
import { WorkExperience } from '../content/work-experience/domain/work-experience.entity';
import { Skill } from '../content/skills/domain/skills.entity';
import { UserSkill } from '../content/skills/domain/user-skills.entity';

export const typeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User, Profile, Education, WorkExperience, Skill, UserSkill], // Agrega aquí tus entidades
  synchronize: true, // Solo para desarrollo, asegúrate de desactivarlo en producción
});
