import { ConfigurableModuleBuilder } from '@nestjs/common';
import { NotificationModuleConfig } from './types';

export const {
  ConfigurableModuleClass: NotificationConfigurableModule,
  MODULE_OPTIONS_TOKEN: NOTIFICATION_OPTION_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<NotificationModuleConfig>().build();
