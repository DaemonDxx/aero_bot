import { Markup as m } from 'telegraf';
import { Template } from '../../template';
import { Markup } from 'telegraf/typings/markup';

export class EntryTemplate extends Template {
  getMessageText(): string {
    return `Добро пожаловать в LKS! Для дальнейшей работы необходимо ввести свои учетные данные. Нажмите "Войти", чтобы продолжить`;
  }

  getMarkup(): Markup<any> | undefined {
    return m
      .keyboard([['✈️ Войти']])
      .oneTime()
      .resize();
  }
}
