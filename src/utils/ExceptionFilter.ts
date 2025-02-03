import { BaseApplicationError } from '@/abstractions/BaseApplicationError';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class BaseApplicationErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(BaseApplicationErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // Log the full error
    this.logger.error('An error occurred:', exception);

    if (exception instanceof BaseApplicationError) {
      // Handle BaseApplicationError
      const status = exception.code || 500;
      response.status(status).json({
        type: exception.type,
        message: exception.message,
        code: exception.code,
        metadata: exception.metadata,
      });
    } else if (exception instanceof BadRequestException) {
      // Handle validation errors
      const validationErrors = this.formatValidationErrors(exception);
      response.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: validationErrors,
      });
    } else if (exception instanceof HttpException) {
      // Handle other NestJS HttpExceptions
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      response.status(status).json(errorResponse);
    } else {
      // Handle unknown errors
      this.logger.error('Unhandled error:', exception);
      response.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    }
  }

  /**
   * Extracts validation errors from BadRequestException (thrown by ValidationPipe).
   */
  private formatValidationErrors(exception: BadRequestException): string[] {
    const response = exception.getResponse();

    if (typeof response === 'object' && response['message']) {
      return Array.isArray(response['message'])
        ? response['message']
        : [response['message']];
    }

    return ['Invalid request data'];
  }
}
