import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

void bootstrap();
