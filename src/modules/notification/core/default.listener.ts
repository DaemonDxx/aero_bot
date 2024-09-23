import { Injectable, LoggerService } from '@nestjs/common';
import { SubscribeDefault } from './decorators/subscribe-default.decorator';
import { Address } from './decorators/address.decorator';
import { Payload } from './decorators/payload.decorator';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';

@Injectable()
export class DefaultListener {
  constructor(
    @Logger()
    private readonly logger: LoggerService,
  ) {}

  //todo добавить декоратор @Context()
  @SubscribeDefault()
  async onDefaultHandler(
    @Address() userID: number,
    @Payload() payload: unknown,
  ): Promise<void> {
    this.logger.warn(
      `Unhandled notification: (to: userID ${userID}) ${payload}`,
    );
  }
}
