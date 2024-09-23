import { PipeTransform, Type } from '@nestjs/common';

export type Notification = {
  fromUserID: string;
  key: string;
  payload: unknown;
};

export type NotificationModuleConfig = {
  brokers: string[];
  topic: string;
};

export type ParamDecoratorMetadata = {
  argIndex: number;
  type?: Type<any>;
  pipes: (Type<PipeTransform> | PipeTransform)[];
};

export type HandlerEvent = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handler: Function;
  argsMap: ArgsMap;
};

export type ArgsMap = {
  address: ParamDecoratorMetadata | undefined;
  payload: ParamDecoratorMetadata | undefined;
};
