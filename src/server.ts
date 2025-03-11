import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const API_DOCS_PREFIX = 'api/docs';

const registerValidationPipe = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
};

const getApiDocument = (app: INestApplication): OpenAPIObject => {
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('API documentation for the Library app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  return SwaggerModule.createDocument(app, config);
};

const startApplication = async (app: INestApplication): Promise<void> => {
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Docs on http://localhost:${process.env.PORT ?? 3000}/api/docs`);
};

export const bootstrap = async (): Promise<void> => {
  try {
    const app = await NestFactory.create(AppModule);

    registerValidationPipe(app);
    const swaggerDocument = getApiDocument(app);
    SwaggerModule.setup(API_DOCS_PREFIX, app, swaggerDocument);

    await startApplication(app);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};
