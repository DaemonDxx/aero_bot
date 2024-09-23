import { ParamDecoratorMetadata } from '../types';
import { PipeTransform, Type } from '@nestjs/common';

export const assignMetadata = (
  index: number,
  type: Type<any>,
  pipes: (Type<PipeTransform> | PipeTransform)[],
): ParamDecoratorMetadata => {
  return {
    argIndex: index,
    type: type,
    pipes,
  };
};
