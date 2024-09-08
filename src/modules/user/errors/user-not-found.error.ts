import { ServiceError } from '../../../utils/errors/service.error';

export class UserNotFoundError extends ServiceError {
  constructor(chatID: bigint) {
    super('UserService', `User with id ${chatID} not found.`);
  }
}
