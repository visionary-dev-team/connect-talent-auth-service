import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/contexts/users/domain/model/user.entity';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { User } from '../content/users/domain/user.entity';
// import { Profile } from '../content/profiles/domain/profile.entity';
// import { Education } from '../content/education/domain/education.entity';
// import { WorkExperience } from '../content/work-experience/domain/work-experience.entity';
// import { Skill } from '../content/skills/domain/skills.entity';
// import { UserSkill } from '../content/skills/domain/user-skills.entity';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule], // Asegúrate de importar ConfigModule para proporcionar ConfigService
  inject: [ConfigService], // ConfigService se inyecta para usar las variables de entorno
  useFactory: async (
    configService: ConfigService
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres', // Ajusta según el tipo de base de datos
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 5432),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [User], // Importa explícitamente tus entidades
      synchronize: configService.get<boolean>('DB_SYNC', true),
    };
  },
};
