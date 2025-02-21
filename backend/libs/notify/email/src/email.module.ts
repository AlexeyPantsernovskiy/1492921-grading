import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { getMailerAsyncOptions } from '@project/shared-helpers';

import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync(getMailerAsyncOptions('application.mail')),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
