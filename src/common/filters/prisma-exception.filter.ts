import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Validation error
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Invalid database query',
      });
    }

    // Default
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    // Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference
    switch (exception.code) {
      case 'P2002': {
        // Unique constraint failed
        status = HttpStatus.CONFLICT;
        const targetMeta = exception.meta?.['target'];

        const target = Array.isArray(targetMeta)
          ? targetMeta.join(', ')
          : typeof targetMeta === 'string'
            ? targetMeta
            : 'unique field';

        message = `Unique constraint failed on: ${target}`;
        break;
      }
      case 'P2025': {
        // Record not found (e.g., update/delete on missing where)
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      }
      case 'P2003': {
        // Foreign key constraint failed
        status = HttpStatus.CONFLICT;
        message = 'Foreign key constraint failed';
        break;
      }
    }

    // logging
    this.logger.warn({
      requestId: req.requestId ?? req.id,
      method: req.method,
      path: req.originalUrl ?? req.url,
      prismaCode: exception.code,
      message,
    });

    const isProd = process.env.NODE_ENV === 'production';

    res.status(status).json({
      statusCode: status,
      message,
      ...(isProd ? {} : { prisma: { code: exception.code } }),
    });
  }
}
