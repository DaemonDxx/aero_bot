import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { DEFAULT_HANDLER_KEY, EVENT_HANDLER_KEY } from './constants';
import { ArgsMap, HandlerEvent, ParamDecoratorMetadata } from './types';
import { createParamDecoratorToken } from './utils/param-decorator-helper-funcs';
import { ADDRESS_DECORATOR_NAME } from './decorators/address.decorator';
import { PAYLOAD_DECORATOR_NAME } from './decorators/payload.decorator';

@Injectable()
export class DiscoverHandlersService implements OnModuleInit {
  private readonly handlers: Map<string, HandlerEvent>;

  constructor(private readonly discover: DiscoveryService) {
    this.handlers = new Map<string, HandlerEvent>();
  }

  async onModuleInit() {
    const res =
      await this.discover.providerMethodsWithMetaAtKey(EVENT_HANDLER_KEY);
    for (const wrapper of res) {
      const key = wrapper.meta as string;
      const handler = wrapper.discoveredMethod.handler;
      const method = wrapper.discoveredMethod.methodName;
      const instance = wrapper.discoveredMethod.parentClass.instance;

      const argsMap = this.createIndexArgsMap(instance, method);
      this.handlers.set(key, {
        handler: handler.bind(instance),
        argsMap: argsMap,
      });
    }
  }

  getHandler(key: string): HandlerEvent | undefined {
    return this.handlers.has(key)
      ? this.handlers.get(key)
      : this.handlers.get(DEFAULT_HANDLER_KEY);
  }

  private createIndexArgsMap(instance: any, method: string): ArgsMap {
    const addressMetadata = Reflect.getMetadata(
      createParamDecoratorToken(ADDRESS_DECORATOR_NAME, method),
      instance,
    ) as ParamDecoratorMetadata;
    const payloadMetadata = Reflect.getMetadata(
      createParamDecoratorToken(PAYLOAD_DECORATOR_NAME, method),
      instance,
    );

    return {
      address: addressMetadata,
      payload: payloadMetadata,
    };
  }
}
