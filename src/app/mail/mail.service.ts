import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailResetPasswordDto } from './mail.dto';
@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendForgotPassword(payload: MailResetPasswordDto) {
    await this.mailService.sendMail({
      to: payload.email,
      subject: 'lupa password',
      template: './lupa_password',
      context: {
        link: payload.link,
        name: payload.name,
        feLink : payload.feLink
      },
    });
  }
}
