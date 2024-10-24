import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ErrorResponseNormalizerFilter } from './app/http-api/response-normalizer/error-response-normalizer.filter';
import { NestLoggerService } from './contexts/shared/logger/infrastructure/nestjs.logger-service';
import { AppModule } from './app/app.module';
import { SuccessResponseNormalizerInterceptor } from './app/http-api/response-normalizer/success-response-normalizer.interceptor';
import { LoggerInterceptor } from './contexts/shared/logger/infrastructure/logger.interceptor';
import { API } from './app/http-api/routes/route.constants';

async function bootstrap() {
  console.log('LOGGER_LEVEL (dotenv):', process.env.LOGGER_LEVEL);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  );
  const logger = app.get(NestLoggerService); // Cambiar para obtener NestLoggerService
  app.useLogger(logger);
  app.setGlobalPrefix(API);

  app.useGlobalFilters(app.get(ErrorResponseNormalizerFilter));
  app.useGlobalInterceptors(
    app.get(LoggerInterceptor),
    app.get(SuccessResponseNormalizerInterceptor)
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT', '3000');

  await app.listen({ port: +port, host: '0.0.0.0' });

  logger.log(`App is ready and listening on port ${port} 🚀`); // Usando NestLoggerService
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on('uncaughtException', handleError);
