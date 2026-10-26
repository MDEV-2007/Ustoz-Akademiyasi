import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers['x-request-id'] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Serverda kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.';
    let validationErrors: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as Record<string, any>;
        errorCode = respObj.error || exception.name;
        
        if (Array.isArray(respObj.message)) {
          // class-validator array
          validationErrors = respObj.message;
          message = "Kiritilgan ma'lumotlarda xatolik mavjud.";
          errorCode = 'VALIDATION_ERROR';
        } else if (typeof respObj.message === 'string') {
          message = respObj.message;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors securely without leaking internals
      switch (exception.code) {
        case 'P2002': {
          status = HttpStatus.CONFLICT;
          errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';
          const target = (exception.meta?.target as string[])?.join(', ') || 'maydon';
          message = `Ushbu ${target} bo‘yicha yozuv allaqachon tizimda mavjud.`;
          break;
        }
        case 'P2025': {
          status = HttpStatus.NOT_FOUND;
          errorCode = 'RECORD_NOT_FOUND';
          message = "So‘ralgan yozuv topilmadi.";
          break;
        }
        default: {
          status = HttpStatus.BAD_REQUEST;
          errorCode = `DB_${exception.code}`;
          message = "Ma’lumotlar bazasida xatolik yuz berdi.";
          break;
        }
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`[${requestId}] ${request.method} ${request.url} - ${exception}`, (exception as any)?.stack);
    } else {
      this.logger.warn(`[${requestId}] ${request.method} ${request.url} [${status}] - ${message}`);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      validationErrors,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
