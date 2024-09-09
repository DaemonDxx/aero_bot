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
      this.logger.debug(`${chatID} - find user id by chat id`);
      const user = await this.prisma.tGUser.findUnique({
        where: {
          chatID,
        },
      });
      this.logger.debug(`${chatID} - user ${user ? 'found' : 'not found'}`);
      if (!user) return;
      return new User(user.userID, user.chatID);
    } catch (e) {
      throw new ServiceError(UserService.name, 'get user from db error', e);
    }
  }

  async getUserInfo(chatID: bigint): Promise<UserInfo> {
    try {
      this.logger.debug(`${chatID} - find user by chat id`);
      const { userID } = await this.prisma.tGUser.findUniqueOrThrow({
        where: {
          chatID,
        },
      });
      this.logger.debug(`${chatID} - user found`);
      this.logger.debug(`${chatID} - grpc send get user info method`);
      return await firstValueFrom(
        this.pbUserService.getUserInfo({ userId: userID }),
      );
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        this.logger.debug(`${chatID} - user not found`);
        throw new UserNotFoundError(chatID);
      }
      throw new ServiceError(UserService.name, `get user info error`, e);
    }
  }
}
