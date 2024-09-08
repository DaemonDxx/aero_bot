import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { UserInfo, UserServiceClient } from '../../../gen/user.v1';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '../../utils/decorators/inject-logger.decorator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserNotFoundError } from './errors/user-not-found.error';
import { ClientGrpc } from '@nestjs/microservices';
import { ServiceError } from '../../utils/errors/service.error';
import { firstValueFrom } from 'rxjs';
import { User } from './entity/user.entity';

@Injectable()
export class UserService implements OnModuleInit {
  private pbUserService: UserServiceClient;

  constructor(
    @Logger()
    private readonly logger: LoggerService,
    @Inject('USER_PACKAGE')
    private readonly client: ClientGrpc,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.pbUserService = this.client.getService('UserService');
  }

  async getUser(chatID: bigint): Promise<User> {
    try {
      const user = await this.prisma.tGUser.findUnique({
        where: {
          chatID,
        },
      });
      return new User(user.userID, user.chatID);
    } catch (e) {
      throw new ServiceError(UserService.name, 'get user from db error', e);
    }
  }

  async getUserInfo(chatID: bigint): Promise<UserInfo> {
    try {
      const { userID } = await this.prisma.tGUser.findUniqueOrThrow({
        where: {
          chatID,
        },
      });
      return await firstValueFrom(
        this.pbUserService.getUserInfo({ userId: userID }),
      );
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new UserNotFoundError(chatID);
      }
      throw new ServiceError(UserService.name, `get user info error`, e);
    }
  }
}
