import { Markup } from 'telegraf';
import { Template } from '../../template';

export class ChangePasswordStartTemplate extends Template {
  static CHANGE_PASSWORDS_BTN = 'Изменить пароли';
  static BACK_BTN = 'Назад';

  private readonly message: string;

  constructor(accordLogin: string, lksLogin: string) {
    super();
    this.message = `
      Ваши учетные данные 
      Логин Аккорд: ${accordLogin}
      Логин LKS: ${lksLogin}
      
    `;
  }

  getMessageText(): string {
    return this.message;
  }

  getMarkup(): Markup.Markup<any> | undefined {
    return Markup.keyboard([
      [ChangePasswordStartTemplate.CHANGE_PASSWORDS_BTN],
      [ChangePasswordStartTemplate.BACK_BTN],
    ])
      .resize()
      .oneTime();
  }
}
