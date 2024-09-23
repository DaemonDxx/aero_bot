import { DynamicModule, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SenderModule } from '../sender/sender.module';
import { ConfigService } from '@nestjs/config';
import { ASYNC_OPTIONS_TYPE } from './core/configuration-module';
import { NotificationCoreModule } from './core/notification-core.module';
import { OrderNotificationListener } from './listeners/order.notification-listener';

@Module({
  imports: [
    UserModule,
    SenderModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          botToken: config.get('TG_BOT_TOKEN'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [OrderNotificationListener],
})
export class NotificationModule {
  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      module: NotificationModule,
      imports: [NotificationCoreModule.forRootAsync(options)],
    };
  }
}
