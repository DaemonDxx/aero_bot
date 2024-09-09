import { AuthPayload } from '../../../modules/user/types';
import { GlobalState } from '../../types';

export type AuthState = GlobalState & {
  auth: AuthPayload;
};
