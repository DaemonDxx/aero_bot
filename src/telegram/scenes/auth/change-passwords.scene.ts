import {
  Ctx,
  Message,
  On,
  SceneEnter,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { CHANGE_PASSWORDS_SCENE, MAIN_SCENE_ID } from '../scenes-id.const';
import { WizardContext } from 'telegraf/scenes';
import { State } from '../../common/decorators/state.param-decorator';
import { AuthState } from './types';
import { AuthService } from '../../../modules/user/auth.service';
import { UserService } from '../../../modules/user/user.service';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';
import { LoggerService, UseInterceptors } from '@nestjs/common';
import { TextTemplate } from '../../templates/text.template';
import { ReplyService } from '../../reply.service';
import { ChangePasswordStartTemplate } from '../../templates/scenes/auth/change-password-start.template';
import { AuthError } from '../../../modules/user/errors/auth.error';
import { TemplateInterceptor } from '../../templates/interceptors/template.interceptor';

@Wizard(CHANGE_PASSWORDS_SCENE)
@UseInterceptors(TemplateInterceptor)
export class ChangePasswordsScene {
  private availableCommands = [
    ChangePasswordStartTemplate.CHANGE_PASSWORDS_BTN,
    ChangePasswordStartTemplate.BACK_BTN,
  ];

  constructor(
    @Logger()
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
  ) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: WizardContext, @State() state: AuthState) {
    try {
      await this.replyService.reply(
        ctx,
        new TextTemplate(`Получаем ваши учетные данные...`),
      );

      const { lksLogin, accordLogin } = await this.userService.getUserInfo(
        BigInt(ctx.chat.id),
      );

      state.auth.accordLogin = accordLogin;
      state.auth.lksLogin = lksLogin;

      await this.replyService.reply(
        ctx,
        new ChangePasswordStartTemplate(accordLogin, lksLogin),
      );
    } catch (e) {
      this.logger.error(`get user info error: %${e.message}`);
      await this.replyService.reply(
        ctx,
        new TextTemplate(
          `Не удалось загрузить учетные данные. Попробуйте позже`,
        ),
      );
      await ctx.scene.enter(MAIN_SCENE_ID);
    }
  }

  @WizardStep(1)
  @On('text')
  async hearsBtn(@Ctx() ctx: WizardContext, @Message('text') msg: string) {
    if (!this.isCommand(msg)) return;

    switch (msg) {
      case ChangePasswordStartTemplate.CHANGE_PASSWORDS_BTN:
        ctx.wizard.next();
        return new TextTemplate(`Введите пароль для системы Аккорд`, {
          clearKeyboard: true,
        });
      case ChangePasswordStartTemplate.BACK_BTN:
        await ctx.scene.enter(MAIN_SCENE_ID);
        return;
    }
  }

  @WizardStep(2)
  @On('text')
  async onAccordPasswordInput(
    @Ctx() ctx: WizardContext,
    @State() state: AuthState,
    @Message('text') password: string,
  ) {
    state.auth.accordPassword = password;
    ctx.wizard.next();
    return new TextTemplate(`Введите пароль для системы LKS`);
  }

  @WizardStep(3)
  @On('text')
  async onLKSPasswordInput(
    @Ctx() ctx: WizardContext,
    @State() state: AuthState,
    @Message('text') password: string,
  ) {
    state.auth.lksPassword = password;
    await this.replyService.reply(
      ctx,
      new TextTemplate(`Пробуем зайти в личный кабинет...`),
    );
    try {
      const payload = {
        accordLogin: state.auth.accordLogin,
        accordPassword: state.auth.accordPassword,
        lksLogin: state.auth.lksLogin,
        lksPassword: state.auth.lksPassword,
      };
      await this.authService.check(payload);
      await this.userService.updatePasswords(BigInt(ctx.chat.id), payload);
      await this.replyService.reply(
        ctx,
        new TextTemplate(`Пароли успешно изменены!`),
      );
      await ctx.scene.enter(MAIN_SCENE_ID);
    } catch (e) {
      if (e instanceof AuthError) {
        switch (e.system) {
          case 'ACCORD':
            ctx.wizard.selectStep(1);
            return new TextTemplate(
              `Некорректный пароль для системы Аккорд. Введите пароль для системы Аккорд.`,
            );
          case 'LKS':
            ctx.wizard.selectStep(2);
            return new TextTemplate(
              `Некорректный пароль для системы LKS. Введите пароль для системы LKS.`,
            );
        }
      } else {
        await this.replyService.reply(
          ctx,
          new TextTemplate(
            `Неизвестная ошибка. Попробуйте изменить пароль позже`,
          ),
        );
        await ctx.scene.enter(CHANGE_PASSWORDS_SCENE);
      }
    }
  }

  private isCommand(cmd: string): boolean {
    return this.availableCommands.includes(cmd);
  }
}
