import { BaseApplicationError } from '@/abstractions/BaseApplicationError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';


@Catch(BaseApplicationError)
export class BaseApplicationErrorFilter implements ExceptionFilter {
  catch(exception: BaseApplicationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.code || 500;
    response.status(status).json({
      type: exception.type,
      message: exception.message,
      code: exception.code,
      metadata: exception.metadata,
    });
  }
}