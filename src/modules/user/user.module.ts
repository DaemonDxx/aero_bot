import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthService } from './auth.service';
import * as process from 'node:process';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'AUTH_PACKAGE',
          useFactory: async (config: ConfigService) => {
            return {
              transport: Transport.GRPC,
              options: {
                package: 'auth.v1',
                protoPath: join(process.cwd(), 'proto/auth.v1.proto'),
                url: config.get('GRPC_SERVER_URL'),
              },
            };
          },
          inject: [ConfigService],
        },
        {
          name: 'USER_PACKAGE',
          useFactory: async (config: ConfigService) => {
            return {
              transport: Transport.GRPC,
              options: {
                package: 'user.v1',
                protoPath: join(process.cwd(), 'proto/user.v1.proto'),
                url: config.get('GRPC_SERVER_URL'),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [AuthService, UserService],
  exports: [UserService, AuthService],
})
export class UserModule {}
