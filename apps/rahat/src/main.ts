/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as bodyParser from 'body-parser';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalCustomExceptionFilter, ResponseTransformInterceptor } from '@rahataid/extensions';
import { APP } from '@rahataid/sdk';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app/app.module';
import { loggerInstance } from './logger/winston.logger';

// import { GlobalExceptionFilter } from './utils/exceptions/rpcException.filter';

async function bootstrap() {
  const _logger = new Logger(NestApplication.name)
  const configService = new ConfigService();


  const app = await NestFactory.create<NestFastifyApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  });
  const globalPrefix = 'v1';
  app.enableCors();

  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.REDIS,
      options: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      },
    })

  // app.use(bodyParser.raw({ type: 'application/octet-stream' }));
  app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }));

  // increase limit of payload size
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  //must have this if you want to implicit conversion of string to number in dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.useGlobalFilters(new GlobalCustomExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3333;

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Rahat Core')
      .setDescription('API service for Rahat Core')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: APP.JWT_BEARER },
        APP.JWT_BEARER
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.startAllMicroservices();
  await app.listen(port);
  _logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  _logger.log(`Swagger UI: http://localhost:${port}/swagger`);
}

bootstrap();
