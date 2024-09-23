import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoverHandlersService } from './discover-handlers.service';
import {
  ASYNC_OPTIONS_TYPE,
  NOTIFICATION_OPTION_TOKEN,
} from './configuration-module';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { NotificationListenerService } from './notification-listener.service';
import {
  CONSUMER_TOKEN,
  GROUP_ID_DEFAULT,
  KAFKA_CLIENT_ID_DEFAULT,
} from './constants';
import { NotificationModuleConfig } from './types';
import { Kafka } from 'kafkajs';
import { DefaultListener } from './default.listener';
import { KafkaLoggerService } from './kafka-logger.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    DiscoverHandlersService,
    NotificationListenerService,
    DefaultListener,
  ],
})
export class NotificationCoreModule {
  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const kafkaProvider: Provider = {
      provide: CONSUMER_TOKEN,
      useFactory: (
        { brokers }: NotificationModuleConfig,
        logger: KafkaLoggerService,
      ) => {
        const kafka = new Kafka({
          clientId: KAFKA_CLIENT_ID_DEFAULT,
          brokers: brokers,
          logCreator: logger.getKafkaLoggerFunc(),
        });
        return kafka.consumer({
          groupId: GROUP_ID_DEFAULT,
          allowAutoTopicCreation: false,
        });
      },
      inject: [NOTIFICATION_OPTION_TOKEN, KafkaLoggerService],
    };

    return {
      module: NotificationCoreModule,
      providers: [
        kafkaProvider,
        {
          provide: NOTIFICATION_OPTION_TOKEN,
          useFactory: options.useFactory,
          useClass: options.useClass,
          useExisting: options.useExisting,
          inject: options.inject,
        },
        KafkaLoggerService,
      ],
    };
  }
}
