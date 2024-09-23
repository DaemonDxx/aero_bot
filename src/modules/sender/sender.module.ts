import { DynamicModule, Module } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  SENDER_OPTION_TOKEN,
} from './configuration-module';
import { SenderService } from './sender.service';
import { SenderModuleConfig } from './types';
import { Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN } from './constants';

@Module({
  imports: [],
  providers: [SenderService],
  exports: [SenderService],
})
export class SenderModule {
  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const botProvider = {
      provide: TELEGRAM_TOKEN,
      useFactory: async ({ botToken }: SenderModuleConfig) => {
        const bot = new Telegraf(botToken);
        return bot.telegram;
      },
      inject: [SENDER_OPTION_TOKEN],
    };
    return {
      module: SenderModule,
      providers: [
        botProvider,
        {
          provide: SENDER_OPTION_TOKEN,
          inject: options.inject,
          useFactory: options.useFactory,
          useClass: options.useClass,
          useExisting: options.useExisting,
        },
      ],
    };
  }
}
