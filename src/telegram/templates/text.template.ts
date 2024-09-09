import { Template } from './template';

export class TextTemplate extends Template {
  constructor(
    private readonly message: string,
    private readonly options?: {
      clearKeyboard: boolean;
    },
  ) {
    super();
  }

  getMessageText(): string {
    return this.message;
  }

  getMarkup(): any {
    if (this.options?.clearKeyboard) {
      return { reply_markup: { remove_keyboard: true } };
    } else {
      return;
    }
  }
}
