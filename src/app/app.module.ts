import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'src/contexts/shared/logger/infrastructure/logger.module';
import { HttpApiModule } from './http-api/http-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync(databaseConfig), // Usar la configuración centralizada para la conexión a la DB

    HttpApiModule,
    LoggerModule,
  ],
})
export class AppModule {}
