import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { useContainer } from 'class-validator';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    dotenv.config();

    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        transform: true,
        validateCustomDecorators: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const port = process.env.PORT || 3310;
    await app.listen(port, () => {
      console.log(`App is running on port ${port}`);
      console.log('DB_HOST:', process.env.DB_HOST);
      console.log('DB_PORT:', process.env.DB_PORT);
      console.log('DB_USERNAME:', process.env.DB_USERNAME);
      console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
      console.log('DB_DATABASE:', process.env.DB_DATABASE);
    });
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();

