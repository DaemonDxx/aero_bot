import { Inject, Injectable } from '@nestjs/common';
import { Template } from '../../telegram/templates/template';
import { Telegram } from 'telegraf';
import { TELEGRAM_TOKEN } from './constants';
import { ChatNotFoundError } from './errors/chat-not-found.error';

@Injectable()
export class SenderService {
  constructor(
    @Inject(TELEGRAM_TOKEN)
    private readonly telegram: Telegram,
  ) {}

  async send(chatID: number, msg: Template): Promise<void> {
    try {
      await this.telegram.sendMessage(chatID, msg.getMessageText());
    } catch (e) {
      if (e.response?.error_code === 400) throw new ChatNotFoundError(chatID);
      throw e;
    }
  }
}
