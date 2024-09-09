import {
  Ctx,
  InjectBot,
  Message,
  On,
  SceneEnter,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { AUTH_SCENE_ID, MAIN_SCENE_ID } from '../scenes-id.const';
import { State } from '../../common/decorators/state.param-decorator';
import { AuthState } from './types';
import { WizardContext } from 'telegraf/scenes';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';
import { LoggerService, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../../../modules/user/auth.service';
import { TemplateInterceptor } from '../../templates/interceptors/template.interceptor';
import { TextTemplate } from '../../templates/text.template';
import { AuthError } from '../../../modules/user/errors/auth.error';
import { Telegraf } from 'telegraf';
import { AuthPayload } from '../../../modules/user/types';
import { Template } from '../../templates/template';
import { ReplyService } from '../../reply.service';

@Wizard(AUTH_SCENE_ID)
@UseInterceptors(TemplateInterceptor)
export class AuthScene {
  constructor(
    @Logger()
    private readonly logger: LoggerService,
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly authService: AuthService,
    private readonly replyService: ReplyService,
  ) {}

  @SceneEnter()
  async onEnterScene(@Ctx() ctx: WizardContext, @State() state: AuthState) {
    if (!state.auth) {
      state.auth = {
        accordLogin: '',
        lksLogin: '',
        lksPassword: '',
        accordPassword: '',
      };
    }
    return new TextTemplate(`Введите логин для системы Accord`, {
      clearKeyboard: true,
    });
  }

  @WizardStep(1)
  @On('text')
  async onAccordLoginInput(
    @Ctx() ctx: WizardContext,
    @State() state: AuthState,
    //todo add validation pipe
    @Message('text') login: string,
  ) {
    state.auth.accordLogin = login;
    ctx.wizard.next();
    return new TextTemplate(`Введите пароль для системы Accord`);
  }

  @WizardStep(2)
  @On('text')
  async onAccordPasswordInput(
    @Ctx() ctx: WizardContext,
    @State() state: AuthState,
    //todo add validation pipe
    @Message('text') password: string,
  ) {
    state.auth.accordPassword = password;
    ctx.wizard.next();
    return new TextTemplate(`Введите логин для системы LKS`);
  }

  @WizardStep(3)
  @On('text')
  async onLKSLoginInput(
    @Ctx() ctx: WizardContext,
    @State() state: AuthState,
    //todo add validation pipe
    @Message('text') login: string,
  ) {
    state.auth.lksLogin = login;
    ctx.wizard.next();
    return new TextTemplate(`Введите пароль для системы LKS`);
  }

  @WizardStep(4)
  @On('text')
  async onLKSPasswordInput(
    @Ctx() ctx: WizardContext,
    @State() state: AuthState,
    //todo add validation pipe
    @Message('text') password: string,
  ) {
    state.auth.lksPassword = password;

    await this.replyService.reply(
      ctx,
      new TextTemplate(`Пробум войти в личный кабинет...`),
    );

    try {
      const payload: AuthPayload = {
        accordLogin: state.auth.accordLogin,
        accordPassword: state.auth.accordPassword,
        lksLogin: state.auth.lksLogin,
        lksPassword: state.auth.lksPassword,
      };
      const template = await this.authCheck(ctx, payload);
      if (template) return template;
      await this.authService.auth(BigInt(ctx.chat.id), payload);

      state.isAuth = true;
      this.clearAuthState(state);
      await this.replyService.reply(
        ctx,
        new TextTemplate(`Вход выполнен успешно!`),
      );

      await ctx.scene.enter(MAIN_SCENE_ID);
    } catch (e) {
      this.logger.error(`auth error ${ctx.chat.id}: ${e.message}`);
      await this.replyService.reply(
        ctx,
        new TextTemplate(`Произошла ошибка при входе. Попробуйте войти позже.`),
      );
      await ctx.scene.enter(AUTH_SCENE_ID);
    }
  }

  private clearAuthState(state: AuthState) {
    state.auth.accordLogin = '';
    state.auth.accordPassword = '';
    state.auth.lksLogin = '';
    state.auth.lksPassword = '';
  }

  private async authCheck(
    ctx: WizardContext,
    payload: AuthPayload,
  ): Promise<Template | undefined> {
    try {
      await this.authService.check(payload);
    } catch (e) {
      if (e instanceof AuthError) {
        switch (e.system) {
          case 'ACCORD':
            ctx.wizard.selectStep(0);
            return new TextTemplate(
              `Некорректный логин или пароль от системы Accord. Введите заново логин для системы Accord`,
            );
          case 'LKS':
            ctx.wizard.selectStep(2);
            return new TextTemplate(
              `Некорректный логин или пароль от системы LKS. Введите заново логин для системы LKS.`,
            );
        }
      } else {
        throw e;
      }
    }
  }
}
