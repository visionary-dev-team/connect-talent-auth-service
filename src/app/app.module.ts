import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/contexts/shared/logger/infrastructure/logger.module';
import { HttpApiModule } from './http-api/http-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/config/database.config';
import { UsersModule } from 'src/contexts/users/user.module';
import path from 'path';
import { AuthModule } from 'src/contexts/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(databaseConfig), // Usar la configuración centralizada para la conexión a la DB
    HttpApiModule,
    LoggerModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
