import { Transform } from 'class-transformer';
import { OrderStatus } from './order.entity';
import { longToNumberTransform } from '../../../utils/functions/long-to-number.transform-func';
import { timestampToDateTransformFunc } from '../../../utils/functions/timestamp-to-date.transform-func';

export enum FlightStatus {
  Await = 'Await',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export class Flight {
  flightNumber: string;
  airplane: string;

  @Transform(timestampToDateTransformFunc)
  departure: Date;

  @Transform(timestampToDateTransformFunc)
  arrival: Date;

  @Transform(longToNumberTransform)
  duration: number;

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
  status: FlightStatus;
}
