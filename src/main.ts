import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApplicationLoggerService } from './logger/logger.service';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        url: process.env.NATS_SERVER,
      },
    },
  );
  /**
   * import port from the configuration
   */

  app.useLogger(new ApplicationLoggerService())
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false, dismissDefaultMessages: false }));

  app.listen(() => Logger.log(`Microservice started`));
}
bootstrap();
