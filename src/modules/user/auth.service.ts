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
      const user = await this.userService.getUser(chatID);
      if (user) return user;
    } catch (e) {
      throw new ServiceError(
        AuthService.name,
        `find user by chatID ${chatID} error`,
        e,
      );
    }

    try {
      const res = await firstValueFrom(this.pbAuthService.auth(payload));
      const { userID } = await this.prisma.tGUser.create({
        data: {
          chatID,
          userID: res.user.id,
        },
      });
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
      const { details } = await firstValueFrom(
        this.pbAuthService.check(payload),
      );
      system = details.system;
    } catch (e: any) {
      this.logger.error(e);
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