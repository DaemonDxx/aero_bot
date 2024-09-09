import { Markup as m } from 'telegraf';
import { Template } from '../../template';
import { Markup } from 'telegraf/typings/markup';

export class EntryTemplate extends Template {
  static ENTRY_BTN = '✈️ Войти';

  getMessageText(): string {
    return `Добро пожаловать в LKS! Для дальнейшей работы необходимо ввести свои учетные данные. Нажмите "Войти", чтобы продолжить`;
  }

  getMarkup(): Markup<any> | undefined {
    return m
      .keyboard([[EntryTemplate.ENTRY_BTN]])
      .oneTime()
      .resize();
  }
}
