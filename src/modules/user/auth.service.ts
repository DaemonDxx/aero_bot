import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { Logger } from '../../utils/decorators/inject-logger.decorator';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from './entity/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { ServiceError } from '../../utils/errors/service.error';
import { AuthServiceClient, AuthSystem } from '../../../gen/auth.v1';
import { AuthError } from './errors/auth.error';
import { AuthPayload } from './types';
import { Long } from '@grpc/proto-loader';

@Injectable()
export class AuthService implements OnModuleInit {
  private pbAuthService: AuthServiceClient;

  constructor(
    @Logger()
    private readonly logger: LoggerService,
    @Inject('AUTH_PACKAGE')
    private readonly client: ClientGrpc,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.pbAuthService = this.client.getService('AuthService');
  }

  async auth(chatID: bigint, payload: AuthPayload): Promise<User> {
    try {
      const user = await this.userService.getUserByChatID(chatID);
      if (user) return user;
    } catch (e) {
      throw new ServiceError(
        AuthService.name,
        `find user by chatID ${chatID} error`,
        e,
      );
    }

    try {
      this.logger.debug(`${chatID} - send grpc auth method...`);
      const res = await firstValueFrom(this.pbAuthService.auth(payload));
      this.logger.debug(`${chatID} - grpc auth method successful`);

      this.logger.debug(`${chatID} - create user in db...`);
      const { userID } = await this.prisma.tGUser.create({
        data: {
          chatID,
          userID: (res.user.id as unknown as Long).toNumber(),
        },
      });
      this.logger.debug(`${chatID} - create user successfully`);
      return new User(userID, chatID);
    } catch (e) {
      throw new ServiceError(
        AuthService.name,
        `auth for chatID ${chatID} error`,
        e,
      );
    }
  }

  async check(payload: AuthPayload) {
    let system: AuthSystem;
    try {
      this.logger.debug(`${payload.accordLogin} - grpc check auth payload...`);
      const { details } = await firstValueFrom(
        this.pbAuthService.check(payload),
      );
      this.logger.debug(
        `${payload.accordLogin} - grpc check payload successfully. Result - ${details.system}`,
      );
      system = details.system;
    } catch (e) {
      throw new ServiceError(AuthService.name, `check failed: ${e.message}`, e);
    }

    switch (system) {
      case AuthSystem.SYSTEM_UNKNOWN:
        return;
      case AuthSystem.SYSTEM_ACCORD:
        throw new AuthError('ACCORD');
      case AuthSystem.SYSTEM_LKS:
        throw new AuthError('LKS');
    }
  }
}
