import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ValidationException } from './../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  private logger = new Logger('ValidationFilter');

  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    this.logger.warn(`${exception.validationErrors}`);
    return response.status(400).json({
      statusCode: 400,
      createdBy: 'ValidationFilter',
      validationErrors: exception.validationErrors,
    });
  }
}
