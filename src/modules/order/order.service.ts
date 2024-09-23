import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderServiceClient } from '../../../gen/order.v1';
import { Order } from './entity/order.entity';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Logger } from '../../utils/decorators/inject-logger.decorator';
import { ServiceError } from '../../utils/errors/service.error';

@Injectable()
export class OrderService implements OnModuleInit {
  private pbOrderService: OrderServiceClient;

  constructor(
    @Logger()
    private readonly logger: LoggerService,
    @Inject('ORDER_PACKAGE')
    private readonly client: ClientGrpc,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.pbOrderService = this.client.getService('OrderService');
  }

  async getActualOrder(chatID: bigint): Promise<Order> {
    try {
      this.logger.debug(`try get actual order...`);
      const user = await this.userService.getUserByChatID(chatID);
      //todo вынести извлечение user в interceptors
      if (!user) return;

      this.logger.debug(`send grpc get auth order method`);
      const res = await firstValueFrom(
        this.pbOrderService.getActualOrder({
          userId: user.id,
        }),
      );
      this.logger.debug(`actual order is get`);
      return plainToInstance(Order, res.order);
    } catch (e) {
      throw new ServiceError(
        OrderService.name,
        `get actual order error: ${e.message}`,
        e,
      );
    }
  }
}
