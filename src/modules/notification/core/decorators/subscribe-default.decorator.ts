import { DEFAULT_HANDLER_KEY } from '../constants';
import { Subscribe } from './subscribe-event.decorator';

export const SubscribeDefault = () => Subscribe(DEFAULT_HANDLER_KEY);
