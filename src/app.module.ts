import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '../config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./config/.evn', './config/.development.env'],
      validationSchema: configSchema,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
