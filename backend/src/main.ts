import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with secure configurations to allow Next.js communication
  app.enableCors({
    origin: '*', // For development, customize in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global input validation with strict validation checks
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips non-validated request parameters
      forbidNonWhitelisted: true,
      transform: true, // Automatically transforms payloads to DTO class instances
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`SmartSort AI Backend is running securely on: http://localhost:${port}`);
}
bootstrap();
