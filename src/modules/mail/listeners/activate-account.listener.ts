import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailEventEnum } from '../enums';
import { User } from '@src/modules/user';

@Injectable()
export class ActivateAccountListener {
  private readonly logger = new Logger(ActivateAccountListener.name);

  constructor(private readonly mailService: MailerService) {}

  @OnEvent(MailEventEnum.ACTIVATE_ACCOUNT, { async: true })
  async handleActivateAccountEvent({ email, person }: User) {
    try {
      this.logger.log('send email activate account');

      await this.mailService.sendMail({
        to: email,
        subject: 'Welcome to Ecommerce!',
        template: './user/activate-account',
        context: {
          name: person.fullName,
        },
      });

      this.logger.log('activate account email sent');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
