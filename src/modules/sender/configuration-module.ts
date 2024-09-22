import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SenderModuleConfig } from './types';

export const {
  ConfigurableModuleClass: SenderConfigurableModule,
  MODULE_OPTIONS_TOKEN: SENDER_OPTION_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<SenderModuleConfig>().build();
