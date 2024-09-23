import { Subscribe } from '../core/decorators/subscribe-event.decorator';
import { Injectable, LoggerService, ValidationPipe } from '@nestjs/common';
import { SenderService } from '../../sender/sender.service';
import { Address } from '../core/decorators/address.decorator';
import { Payload } from '../core/decorators/payload.decorator';
import { UpdateActualOrderPayload } from '../payloads/update-actual-order.payload';
import { UserService } from '../../user/user.service';
import { ActualOrderTemplate } from '../../../telegram/templates/scenes/main/actual-order.template';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';

@Injectable()
export class OrderNotificationListener {
  constructor(
    @Logger()
    private readonly logger: LoggerService,
    private readonly orderService: SenderService,
    private readonly userService: UserService,
  ) {}

  @Subscribe('UPDATE_ACTUAL_ORDER')
  async onUpdateActualOrder(
    @Address() userID: number,
    @Payload(UpdateActualOrderPayload, new ValidationPipe({ transform: true }))
    { order }: UpdateActualOrderPayload,
  ): Promise<void> {
    const tgID = await this.userService.getUsersByUserID(userID);
    for (const chatID of tgID) {
      try {
        await this.orderService.send(chatID, new ActualOrderTemplate(order));
      } catch (e) {
        this.logger.error(
          `Notification by 'UpdateActualOrder' send to chatID ${chatID} error: ${e.message}`,
        );
      }
    }
  }
}
