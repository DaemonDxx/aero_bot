import { Ctx, Hears, SceneEnter, Wizard } from 'nestjs-telegraf';
import { CHANGE_PASSWORDS_SCENE, MAIN_SCENE_ID } from '../scenes-id.const';
import { LoggerService, UseInterceptors } from '@nestjs/common';
import { TemplateInterceptor } from '../../templates/interceptors/template.interceptor';
import { ReplyService } from '../../reply.service';
import { MainStartTemplate } from '../../templates/scenes/main/main-start.template';
import { WizardContext } from 'telegraf/scenes';
import { Context } from 'telegraf';
import { OrderService } from '../../../modules/order/order.service';
import { ActualOrderTemplate } from '../../templates/scenes/main/actual-order.template';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';
import { TextTemplate } from '../../templates/text.template';

@Wizard(MAIN_SCENE_ID)
@UseInterceptors(TemplateInterceptor)
export class MainScene {
  private startTemplate = new MainStartTemplate();

  constructor(
    @Logger()
    private readonly logger: LoggerService,
    private readonly replyService: ReplyService,
    private readonly orderService: OrderService,
  ) {}

  @SceneEnter()
  async onEnter() {
    return this.startTemplate;
  }

  @Hears(MainStartTemplate.ACTUAL_DUTY_BTN)
  async onActualDuty(@Ctx() ctx: Context) {
    try {
      const msg = await this.replyService.reply(
        ctx,
        new TextTemplate(`Получаем информации об актуальном наряде...`),
      );
      const order = await this.orderService.getActualOrder(BigInt(ctx.chat.id));
      await this.replyService.editMessage(msg, new ActualOrderTemplate(order));
    } catch (e) {
      this.logger.error(e);
      return new TextTemplate(
        `Не удалось получить информаци об актуальном наряде. Повторите попытку позже.`,
      );
    }
  }

  @Hears(MainStartTemplate.CHANGE_PASSWORDS_BTN)
  async onChangePassword(@Ctx() ctx: WizardContext) {
    await ctx.scene.enter(CHANGE_PASSWORDS_SCENE);
  }
}
