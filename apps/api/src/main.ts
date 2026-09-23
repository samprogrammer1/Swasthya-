import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('SwasthyaBootstrap');
  const app = await NestFactory.create(AppModule);

  // Global Prefix & CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Pipes, Filters & Interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Swasthya+ Healthcare Platform API')
    .setDescription(
      'Production-ready Healthcare Platform for OPD Token Booking, Live Queue Management, Doctor Workflows, and Administration in Jodhpur, Rajasthan.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 Swasthya+ API is running on http://localhost:${port}`);
  logger.log(`📖 Swagger Documentation available at http://localhost:${port}/docs`);
}

bootstrap();
