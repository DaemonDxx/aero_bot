import { createParamDecoratorToken } from '../utils/param-decorator-helper-funcs';
import { PipeTransform, Type } from '@nestjs/common';
import { assignMetadata } from '../utils/assign-metadata.func';

export const PAYLOAD_DECORATOR_NAME = 'payload';

export const Payload =
  (ctor?: Type<any>, ...pipes: (Type<PipeTransform> | PipeTransform)[]) =>
  (target: any, method: string, index: number) => {
    Reflect.defineMetadata(
      createParamDecoratorToken(PAYLOAD_DECORATOR_NAME, method),
      assignMetadata(index, ctor, pipes || []),
      target,
    );
  };
