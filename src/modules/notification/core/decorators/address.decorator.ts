import { createParamDecoratorToken } from '../utils/param-decorator-helper-funcs';
import { ParseIntPipe, PipeTransform, Type } from '@nestjs/common';
import { assignMetadata } from '../utils/assign-metadata.func';

export const ADDRESS_DECORATOR_NAME = 'address';

export const Address =
  (...pipes: (Type<PipeTransform> | PipeTransform)[]) =>
  (target: any, method: string, index: number) => {
    pipes.push(ParseIntPipe);
    Reflect.defineMetadata(
      createParamDecoratorToken(ADDRESS_DECORATOR_NAME, method),
      assignMetadata(index, Number, pipes),
      target,
    );
  };
