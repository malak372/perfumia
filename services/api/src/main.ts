import {
  ValidationPipe,
} from '@nestjs/common';

import {
  ConfigService,
} from '@nestjs/config';

import { NestFactory } from '@nestjs/core';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import helmet from 'helmet';

import { AppModule } from './app.module.js';

import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableShutdownHooks();

  const config =
    app.get(ConfigService);

  const port =
    config.get<number>(
      'PORT',
      3000,
    );

  app.use(
    helmet(),
  );

  const allowedOrigins =
    (
      config.get<string>(
        'CORS_ORIGINS',
        'http://localhost:5173',
      ) ?? ''
    )
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

  app.enableCors({
    origin: (
      origin,
      callback,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        allowedOrigins.includes(
          origin,
        )
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          'Origin not allowed by CORS',
        ),
        false,
      );
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  const swaggerConfig =
    new DocumentBuilder()
      .setTitle(
        'PERFUMIA API',
      )
      .setDescription(
        'PERFUMIA backend API',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

  SwaggerModule.setup(
    'docs',
    app,
    document,
  );

  await app.listen(port);

  console.log(
    `PERFUMIA API: http://localhost:${port}`,
  );

  console.log(
    `Swagger: http://localhost:${port}/docs`,
  );
}

bootstrap();