import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import type {
  Request,
  Response,
} from 'express';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    let status =
      HttpStatus.INTERNAL_SERVER_ERROR;

    let message:
      | string
      | string[] =
      'Internal server error';

    if (
      exception instanceof HttpException
    ) {
      status =
        exception.getStatus();

      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse ===
        'string'
      ) {
        message =
          exceptionResponse;
      } else if (
        typeof exceptionResponse ===
          'object' &&
        exceptionResponse !== null
      ) {
        const body =
          exceptionResponse as {
            message?: string | string[];
          };

        message =
          body.message ??
          exception.message;
      }
    } else {
      console.error(exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp:
        new Date().toISOString(),
    });
  }
}