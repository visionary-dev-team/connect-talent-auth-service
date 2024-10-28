// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { User } from './infrastructure/repositories/user.orm-entity';
import { UserController } from './adapter/controllers/user.controller';
import { IUserRepositoryToken } from './domain/repositories/user.repository';
import { CreateUserUseCase } from './application/create-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
