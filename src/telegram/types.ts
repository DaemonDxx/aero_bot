import { Context } from 'telegraf';

export type GlobalState = {
  isAuth: boolean;
};

export type TgContext = Context & {
  session: GlobalState;
};
