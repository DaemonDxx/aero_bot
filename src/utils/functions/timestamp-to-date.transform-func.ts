import { TransformFnParams } from 'class-transformer';
import { Long } from '@grpc/proto-loader';

export const timestampToDateTransformFunc = ({ value }: TransformFnParams) => {
  if (value && value.seconds && value.seconds instanceof Long) {
    return new Date(value.seconds.toNumber() * 1000);
  } else {
    return value;
  }
};
