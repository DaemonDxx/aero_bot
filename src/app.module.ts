import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchema } from '../config/config.schema';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as process from 'node:process';
import { TelegramModule } from './telegram/telegram.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TOPIC_DEFAULT } from './modules/notification/core/constants';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./config/.evn', './config/.development.env'],
      validationSchema: configSchema,
    }),
    WinstonModule.forRoot({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('LKS', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
    TelegramModule,
    PrismaModule,
    NotificationModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        brokers: [config.get('KAFKA_BROKER')],
        topic: config.get('KAFKA_TOPIC') ?? TOPIC_DEFAULT,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
