import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');
import { join } from 'path';
import * as fs from 'fs';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 4000;
  const rawCors =
    configService.get<string[]>('cors.origins') ||
    configService.get<string[]>('corsOrigins') ||
    [];

  const envCors = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
    : [];

  const corsOrigins = [
    ...new Set([
      ...rawCors,
      ...envCors,
      'https://ustozakademiyasi-front.duckdns.org',
      'http://ustozakademiyasi-front.duckdns.org',
      'https://ustozakademiyasi-back.duckdns.org',
      'http://ustozakademiyasi-back.duckdns.org',
      'https://ustozakademiyasi.uz',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ]),
  ];

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Normalize redundant slashes in incoming request URL (e.g. //api/v1 -> /api/v1)
  app.use((req: any, _res: any, next: any) => {
    if (typeof req.url === 'string') {
      req.url = req.url.replace(/\/+/g, '/');
    }
    next();
  });

  // Security middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());

  // Static assets for uploaded media
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  // CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        corsOrigins.includes(origin) ||
        corsOrigins.includes('*') ||
        origin.endsWith('.duckdns.org') ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-request-id',
      'x-source',
      'x-bot-api-token',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  // Versioned global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes, filters & interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ustoz Akademiyasi API')
    .setDescription(
      "Ustoz Akademiyasi arab tili ta'lim markazi uchun to'liq ishlab chiqarish darajasidagi REST API spetsifikatsiyasi.",
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Kirish uchun JWT access tokenini kiriting',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Public - Kurslar')
    .addTag('Public - Filiallar')
    .addTag('Public - Ustozlar')
    .addTag('Public - Jadval')
    .addTag('Public - Arizalar')
    .addTag('Public - Maqolalar')
    .addTag('Public - FAQ')
    .addTag('Public - Natijalar')
    .addTag('Public - Yutuqlar')
    .addTag('Public - Sozlamalar')
    .addTag('Public - Health Checks')
    .addTag('Admin - Autentifikatsiya')
    .addTag('Admin - Foydalanuvchilar')
    .addTag('Admin - Kurslar')
    .addTag('Admin - Kategoriyalar')
    .addTag('Admin - Filiallar')
    .addTag('Admin - Ustozlar')
    .addTag('Admin - Jadval')
    .addTag('Admin - Arizalar')
    .addTag('Admin - Maqolalar')
    .addTag('Admin - FAQ')
    .addTag('Admin - Sharhlar')
    .addTag('Admin - Yutuqlar')
    .addTag('Admin - Media')
    .addTag('Admin - Sozlamalar')
    .addTag('Admin - Analitika')
    .addTag('Admin - Audit Jurnali')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Export OpenAPI spec file for frontend client generation
  try {
    const swaggerPath = join(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2), 'utf8');
  } catch (err) {
    logger.warn('OpenAPI spec faylini saqlashda xatolik:', err);
  }

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`Ustoz Akademiyasi API ishga tushdi: http://localhost:${port}/api/v1`);
  logger.log(`Swagger OpenAPI hujjatlari: http://localhost:${port}/api/docs`);
}

bootstrap();
