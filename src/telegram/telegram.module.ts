import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';
import { scenesProviders } from './scenes/scenes.providers';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          token: config.get<string>("TG_BOT_TOKEN"),
          middlewares: [session()],
        }
      },
      inject: [ConfigService],
    })
  ],
  providers: [...scenesProviders]
})
export class TelegramModule {}
