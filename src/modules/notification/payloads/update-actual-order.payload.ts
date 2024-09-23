import { Order } from '../../order/entity/order.entity';
import { Type } from 'class-transformer';

export class UpdateActualOrderPayload {
  @Type(() => Order)
  order: Order;
}
