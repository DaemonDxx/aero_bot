import { Transform, Type } from 'class-transformer';
import { OrderItem } from './order-item.entity';
import { longToNumberTransform } from '../../../utils/functions/long-to-number.transform-func';

export enum OrderStatus {
  AWAIT = 'AWAIT',
  CONFIRMED = 'CONFIRMED',
  LIMITED = 'LIMITED',
}

export class Order {
  @Transform(longToNumberTransform)
  id: number;

  @Transform(({ value }) => {
    switch (value) {
      case 0:
        return OrderStatus.AWAIT;
      case 1:
        return OrderStatus.CONFIRMED;
      case 2:
        return OrderStatus.LIMITED;
    }
  })
  status: OrderStatus;

  @Type(() => OrderItem)
  items: OrderItem[];
}
