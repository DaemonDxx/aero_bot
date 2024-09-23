import {
  ArgumentMetadata,
  Inject,
  Injectable,
  LoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { DiscoverHandlersService } from './discover-handlers.service';
import { CONSUMER_TOKEN } from './constants';
import { Consumer } from 'kafkajs';
import { NOTIFICATION_OPTION_TOKEN } from './configuration-module';
import { ArgsMap, Notification, NotificationModuleConfig } from './types';
import { isFunction } from '@nestjs/common/utils/shared.utils';
import { ModuleRef } from '@nestjs/core';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';

@Injectable()
export class NotificationListenerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Logger()
    private readonly logger: LoggerService,
    @Inject(CONSUMER_TOKEN)
    private readonly consumer: Consumer,
    @Inject(NOTIFICATION_OPTION_TOKEN)
    private readonly options: NotificationModuleConfig,
    private readonly discover: DiscoverHandlersService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onApplicationBootstrap() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.options.topic,
    });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const msg = JSON.parse(message.value.toString()) as Notification;
          const { handler, argsMap } = this.discover.getHandler(msg.key);
          const args = await this.createArgs(msg, argsMap);
          // eslint-disable-next-line prefer-spread
          handler.apply(undefined, args);
        } catch (e) {
          this.logger.error(`Handle notification error: ${e.message}`, e);
        }
      },
    });
  }

  private async applyPipes(
    value: unknown,
    pipes: (Type<PipeTransform> | PipeTransform)[],
    metadata: ArgumentMetadata,
  ): Promise<any> {
    let result: any;
    for (const pipe of pipes) {
      let instancePipe: PipeTransform;
      if (isFunction(pipe)) instancePipe = await this.moduleRef.create(pipe);
      else instancePipe = pipe as PipeTransform;
      result = await instancePipe.transform(value, metadata);
    }
    return result;
  }

  private async createArgs(
    msg: Notification,
    { payload, address }: ArgsMap,
  ): Promise<Array<any>> {
    const args = [];
    if (payload) {
      const metadata = this.createMetadata(payload.type);
      args[payload.argIndex] = await this.applyPipes(
        msg.payload,
        payload.pipes,
        metadata,
      );
    }
    if (address) {
      const metadata = this.createMetadata(payload.type);
      args[address.argIndex] = await this.applyPipes(
        msg.fromUserID,
        payload.pipes,
        metadata,
      );
    }
    return args;
  }

  private createMetadata(type: Type<any>): ArgumentMetadata {
    return {
      type: 'custom',
      metatype: type,
    };
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
