import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { EmailModule } from '@project/notify-email';

import { ClientConfig } from './app.config';
import { UsersController } from './users.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { NotifyConfigModule } from '@project/notify-config';
import { ShopController } from './shop.controller';
@Module({
  imports: [
    HttpModule.register({
      timeout: ClientConfig.HttpTimeout,
      maxRedirects: ClientConfig.HttpMaxRedirects,
    }),
    NotifyConfigModule,
    EmailModule,
  ],
  controllers: [UsersController, ShopController],
  providers: [CheckAuthGuard],
})
export class AppModule {}
