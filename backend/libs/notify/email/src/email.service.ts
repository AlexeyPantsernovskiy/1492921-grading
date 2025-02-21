import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { LogonInfo, User } from '@project/shared-core';
import { NotifyConfig } from '@project/notify-config';

import { EmailConfig } from './email.constant';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(NotifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof NotifyConfig>;

  public async sendNotifyUserRegister(user: User, logonInfo: LogonInfo) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: user.email,
      subject: EmailConfig.UserRegister.subject,
      template: EmailConfig.UserRegister.template,
      context: {
        userName: user.name,
        url: logonInfo.url,
        applicationName: logonInfo.applicationName,
        login: logonInfo.login,
        password: logonInfo.password,
        subject: EmailConfig.UserRegister.subject,
      },
    });
  }
}
