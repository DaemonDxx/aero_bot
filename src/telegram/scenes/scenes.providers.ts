import { StartScene } from './start/start.scene';
import { AuthScene } from './auth/auth.scene';
import { MainScene } from './main/main.scene';
import { ChangePasswordsScene } from './auth/change-passwords.scene';

export const scenesProviders = [
  StartScene,
  AuthScene,
  MainScene,
  ChangePasswordsScene,
];
