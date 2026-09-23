import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '@swasthya/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error' };

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse.message
        ? Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse.message
        : exceptionResponse || 'An unexpected error occurred';

    const code =
      typeof exceptionResponse === 'object' && exceptionResponse.error
        ? String(exceptionResponse.error).toUpperCase().replace(/\s+/g, '_')
        : 'INTERNAL_ERROR';

    const requestId =
      (request.headers['x-request-id'] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${message}`,
    );

    const errorBody: ApiResponse = {
      success: false,
      code,
      message,
      requestId,
    };

    response.status(status).json(errorBody);
  }
}
