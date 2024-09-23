import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { Logger } from '../../../utils/decorators/inject-logger.decorator';
import { logCreator, LogEntry, LoggerEntryContent, logLevel } from 'kafkajs';

@Injectable()
export class KafkaLoggerService {
  constructor(
    @Logger()
    private readonly loggerService: LoggerService,
  ) {}

  getKafkaLoggerFunc(): logCreator {
    return (level) => {
      //this.loggerService.setLogLevels(this.getLevel(level));
      return this.logFunc.bind(this);
    };
  }

  private getLevel(level: logLevel): LogLevel[] {
    switch (level) {
      case logLevel.INFO:
        return ['log'];
      case logLevel.WARN:
        return ['warn'];
      case logLevel.ERROR:
        return ['error'];
      case logLevel.DEBUG:
        return ['debug'];
      case logLevel.NOTHING:
        return ['verbose'];
    }
  }

  private logFunc({ namespace, level, label, log }: LogEntry): void {
    switch (level) {
      case logLevel.INFO:
        this.loggerService.log(this.createLogMessage(namespace, label, log));
        break;
      case logLevel.WARN:
        this.loggerService.warn(this.createLogMessage(namespace, label, log));
        break;
      case logLevel.ERROR:
        this.loggerService.error(this.createLogMessage(namespace, label, log));
        break;
      case logLevel.DEBUG:
        this.loggerService.debug(this.createLogMessage(namespace, label, log));
        break;
      case logLevel.NOTHING:
        this.loggerService.verbose(
          this.createLogMessage(namespace, label, log),
        );
        break;
    }
  }

  private createLogMessage(
    namespace: string,
    label: string,
    log: LoggerEntryContent,
  ): string {
    return `[${namespace}] (${label}) - ${log.message}`;
  }
}
