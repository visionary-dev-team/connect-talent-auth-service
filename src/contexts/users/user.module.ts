// user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { User } from './infrastructure/repositories/user.orm-entity';
import { UserController } from './adapter/controllers/user.controller';
import { CreateUserUseCase } from './application/create-user.use-case';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from 'src/config/config.module';
import { ProfilesModule } from '../profile/profile.module';
import { IUserRepositoryToken } from './domain/repositories/user.repository.interface';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfilesModule),
  ],
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: TypeOrmUserRepository,
    },
    CreateUserUseCase,
  ],
  controllers: [UserController],
  exports: [IUserRepositoryToken],
})
export class UsersModule {}
