import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';
import { scenesProviders } from './scenes/scenes.providers';
import { ReplyService } from './reply.service';
import { UserModule } from '../modules/user/user.module';
import { Postgres } from '@telegraf/session/pg';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          token: config.get<string>('TG_BOT_TOKEN'),
          middlewares: [
            session({
              store: Postgres({
                host: config.get('BOT_PG_SESSION_HOST'),
                port: config.get('BOT_PG_SESSION_PORT'),
                user: config.get('BOT_PG_SESSION_USER'),
                password: String(config.get('BOT_PG_SESSION_PASSWORD')),
                database: config.get('BOT_PG_SESSION_DB'),
              }),
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [...scenesProviders, ReplyService],
})
export class TelegramModule {}
