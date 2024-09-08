import { ServiceError } from '../../../utils/errors/service.error';

export class AuthError extends ServiceError {
  system: 'ACCORD' | 'LKS';

  constructor(system: 'ACCORD' | 'LKS') {
    super('AuthService', `login or password for system ${system} incorrect`);
    this.system = system;
  }
}
