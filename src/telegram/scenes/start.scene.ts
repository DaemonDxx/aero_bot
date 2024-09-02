import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class StartScene {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply("test")
  }
}
