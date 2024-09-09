import { Markup } from 'telegraf';
import { Template } from '../../template';

export class MainStartTemplate extends Template {
  static ACTUAL_DUTY_BTN = 'Актуальный наряд';
  static CHANGE_PASSWORDS_BTN = 'Обновить пароль ЛК';

  getMessageText(): string {
    return `Добро пожаловать!`;
  }

  getMarkup(): Markup.Markup<any> | undefined {
    return Markup.keyboard([
      [MainStartTemplate.ACTUAL_DUTY_BTN],
      [MainStartTemplate.CHANGE_PASSWORDS_BTN],
    ]).resize();
  }
}
