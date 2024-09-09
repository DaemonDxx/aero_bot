import { Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { LoggerService, UseInterceptors } from '@nestjs/common';
import { TemplateInterceptor } from '../../templates/interceptors/template.interceptor';
import { EntryTemplate } from '../../templates/scenes/start/entry.template';
import { SceneContext } from 'telegraf/scenes';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';
import { AUTH_SCENE_ID } from '../scenes-id.const';
import { Context } from 'telegraf';

@Update()
@UseInterceptors(TemplateInterceptor)
export class StartScene {
  constructor(
    @Logger()
    private readonly logger: LoggerService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    this.logger.log(`starting usage bot by chatID ${ctx.chat.id}`);
    return new EntryTemplate();
  }

  @Hears(EntryTemplate.ENTRY_BTN)
  async onEntry(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(AUTH_SCENE_ID);
  }
}
