import { Ctx, Hears, SceneEnter, Wizard } from 'nestjs-telegraf';
import { CHANGE_PASSWORDS_SCENE, MAIN_SCENE_ID } from '../scenes-id.const';
import { UseInterceptors } from '@nestjs/common';
import { TemplateInterceptor } from '../../templates/interceptors/template.interceptor';
import { ReplyService } from '../../reply.service';
import { MainStartTemplate } from '../../templates/scenes/main/main-start.template';
import { WizardContext } from 'telegraf/scenes';

@Wizard(MAIN_SCENE_ID)
@UseInterceptors(TemplateInterceptor)
export class MainScene {
  private startTemplate = new MainStartTemplate();

  constructor(private readonly replyService: ReplyService) {}

  @SceneEnter()
  async onEnter() {
    return this.startTemplate;
  }

  @Hears(MainStartTemplate.CHANGE_PASSWORDS_BTN)
  async onChangePassword(@Ctx() ctx: WizardContext) {
    await ctx.scene.enter(CHANGE_PASSWORDS_SCENE);
  }
}
