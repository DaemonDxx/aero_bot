import { Markup } from 'telegraf';

export abstract class Template {
  abstract getMessageText(): string;
  abstract getMarkup(): Markup.Markup<any> | undefined;
}