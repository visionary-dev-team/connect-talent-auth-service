import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './adapter/user.controller';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { User } from './domain/model/user.entity';
import { UserService } from './infrastructure/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
    UserService,
  ],
  controllers: [UserController],
  exports: ['UserRepository'],
})
export class UsersModule {}
