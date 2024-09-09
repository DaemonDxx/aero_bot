import { Ctx, Start, Update } from 'nestjs-telegraf';
import { LoggerService, UseInterceptors } from '@nestjs/common';
import { TemplateInterceptor } from '../../templates/interceptors/template.interceptor';
import { EntryTemplate } from '../../templates/scenes/start/entry.template';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';
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
}
