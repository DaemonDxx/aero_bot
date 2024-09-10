import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as process from 'node:process';
import { TestController } from './test.controller';

@Module({
  imports: [
    UserModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'ORDER_PACKAGE',
          useFactory: async (config: ConfigService) => {
            return {
              transport: Transport.GRPC,
              options: {
                package: 'order.v1',
                protoPath: join(process.cwd(), 'proto/order.v1.proto'),
                url: config.get('GRPC_SERVER_URL'),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
  ],
  //todo удалить
  controllers: [TestController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
