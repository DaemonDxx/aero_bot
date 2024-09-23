import { SetMetadata } from '@nestjs/common';
import { EVENT_HANDLER_KEY } from '../constants';

export const Subscribe = (event: string) =>
  SetMetadata(EVENT_HANDLER_KEY, event);
