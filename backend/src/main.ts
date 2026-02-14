import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ...

  // Enable compression
  app.use(compression());

  // Parse cookies for refresh tokens
  app.use(cookieParser());

  const configService = app.get(ConfigService);

  // Increase body limit for large images
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });

  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for images
  }));

  // Specific Rate Limiting for Auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/auth/login', authLimiter);
  app.use('/auth/forgot-password', authLimiter);

  // Global Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs (Increased for gallery proxy)
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS', 'http://localhost:5173,https://www.aesciontech.com,https://aesciontech.com')
    .split(',')
    .map(origin => origin.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'x-session-id'], // Expose headers if needed
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
