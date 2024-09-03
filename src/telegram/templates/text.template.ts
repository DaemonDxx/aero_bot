import { Markup } from 'telegraf/typings/markup';
import { Template } from './template';

export class TextTemplate extends Template {
  constructor(private readonly message: string) {
    super();
  }

  getMessageText(): string {
    return this.message;
  }

  getMarkup(): Markup<any> {
    return;
  }
}
