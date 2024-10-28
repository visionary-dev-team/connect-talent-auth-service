import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class ErrorResponseNormalizerFilter implements ExceptionFilter {
  async catch(rawException: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // Verificar si la excepción es de tipo HttpException
    const exception =
      rawException instanceof HttpException
        ? rawException
        : new InternalServerErrorException();

    const status = exception.getStatus();
    const generalMessage = this.getGeneralMessage(exception);

    // Enviar la respuesta de error personalizada
    await response.status(status).send({
      status: status,
      message: generalMessage,
      errors: this.mapToErrors(exception),
    });
  }

  private mapToErrors(error: HttpException) {
    const response = error.getResponse();

    // Si tiene un array de errores, devolvemos los errores tal como están
    if (typeof response === 'object' && Array.isArray(response['errors'])) {
      return response['errors'];
    }

    // Si tiene un campo específico y un mensaje único
    if (typeof response === 'object' && response['field']) {
      return [{ field: response['field'], reason: response['message'] }];
    }

    // Si no se encuentra ninguna estructura específica, devolver un mensaje genérico
    return [{ field: null, reason: error.message }];
  }

  private getGeneralMessage(error: HttpException): string {
    const response = error.getResponse();
    return typeof response === 'object' && response['message'] ? response['message'] : error.message;
  }
}
