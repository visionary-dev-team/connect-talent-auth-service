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
import fastifyCookie from '@fastify/cookie';
import cookieParser from 'cookie-parser';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  console.log('LOGGER_LEVEL (dotenv):', process.env.LOGGER_LEVEL);
  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { bufferLogs: true }
  );
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.addHook(
    'onRequest',
    (request: any, reply: any, done: () => void) => {
      reply.setHeader = function (key, value) {
        return this.raw.setHeader(key, value);
      };
      reply.end = function () {
        this.raw.end();
      };
      request.res = reply;
      done();
    }
  );

  const logger = app.get(NestLoggerService);
  app.useLogger(logger);
  app.setGlobalPrefix(API);
  console.log(process.env.SECRET_COOKIE);

  app.use(cookieParser());

  await app.register(fastifyCookie as any, {
    secret: process.env.SECRET_COOKIE, // Clave opcional para firmar las cookies
  });

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

  // Inicializar el servidor HTTP
  await app.listen(port);
  logger.log(`HTTP Server is ready and listening on port ${port} 🚀`);

  // Inicializar el servidor TCP
  const tcpApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1', // Dirección del servidor TCP
        port: configService.get<number>('TCP_PORT', 3001), // Puerto TCP configurable
      },
    },
  );

  await tcpApp.listen();
  logger.log(`TCP Server is ready and listening on port ${configService.get<number>('TCP_PORT', 3001)} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on('uncaughtException', handleError);
