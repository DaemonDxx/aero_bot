import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Template } from '../template';
import { Context } from 'telegraf';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

@Injectable()
export class TemplateInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data) => {
        if (!this.isTemplate(data)) return data;
        const template: Template = data;
        const tgCtx = this.getTelegrafContext(context);

        if (this.isNewMessage(tgCtx)) {
          await tgCtx.replyWithHTML(
            template.getMessageText(),
            template.getMarkup(),
          );
        } else {
          await tgCtx.editMessageText(template.getMessageText(), {
            reply_markup: template.getMarkup() as any,
            parse_mode: 'HTML',
          });
        }

        return;
      }),
    );
  }

  private isTemplate(data: any): boolean {
    return data instanceof Template;
  }

  private getTelegrafContext(ctx: ExecutionContext): Context {
    const tgCtx = TelegrafExecutionContext.create(ctx);
    return tgCtx.getContext();
  }

  private isNewMessage(ctx: Context): boolean {
    return !ctx.callbackQuery;
  }
}
