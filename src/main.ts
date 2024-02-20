import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationFilter } from './filters/validation.filter';
import config from './config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http.exceptions.filter';

const start = async () => {
  const logger = new Logger('Main APP');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: config.hostClient,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());
  await app.listen(config.port);
  logger.log(`Server started on port: ${config.port}`);
};

start();
