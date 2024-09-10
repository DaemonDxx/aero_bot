import { Flight } from './flight.entity';
import { Transform, Type } from 'class-transformer';
import { longToNumberTransform } from '../../../utils/functions/long-to-number.transform-func';
import { timestampToDateTransformFunc } from '../../../utils/functions/timestamp-to-date.transform-func';

export class OrderItem {
  @Transform(longToNumberTransform)
  id: number;

  @Type(() => Flight)
  flights: Flight[];

  @Transform(timestampToDateTransformFunc)
  departure: Date;

  @Transform(timestampToDateTransformFunc)
  arrival: Date;

  description: string;
  route: string;

  @Transform(timestampToDateTransformFunc)
  confirmDate: Date;
}
