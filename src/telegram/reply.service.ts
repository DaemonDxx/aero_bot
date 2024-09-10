import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Message } from 'telegraf/types';
import { Context, Telegraf } from 'telegraf';
import { Template } from './templates/template';
import { ServiceError } from '../utils/errors/service.error';

@Injectable()
export class ReplyService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
  ) {}

  async reply(ctx: Context, template: Template): Promise<Message.TextMessage> {
    try {
      return await ctx.reply(template.getMessageText(), template.getMarkup());
    } catch (e) {
      throw new ServiceError(
        ReplyService.name,
        `send message error: ${e.message}`,
        e,
      );
    }
  }

  async editMessage(
    msg: Message.TextMessage,
    template: Template,
  ): Promise<void> {
    try {
      await this.bot.telegram.editMessageText(
        msg.chat.id,
        msg.message_id,
        '',
        template.getMessageText(),
        {
          ...template.getMarkup(),
          parse_mode: 'HTML',
        },
      );
    } catch (e) {
      throw new ServiceError(
        ReplyService.name,
        `edit message error: ${e.message}`,
        e,
      );
    }
  }
}
