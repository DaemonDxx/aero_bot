import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TgContext } from '../../types';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const State = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const tgCtx = TelegrafExecutionContext.create(ctx).getContext<TgContext>();
    return tgCtx.session;
  },
);
