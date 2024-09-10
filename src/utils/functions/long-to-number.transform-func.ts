import { TransformFnParams } from 'class-transformer';
import { Long } from '@grpc/proto-loader';

export const longToNumberTransform = ({ value }: TransformFnParams) => {
  if (value instanceof Long) {
    return value.toNumber();
  } else {
    return value;
  }
};
