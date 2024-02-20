import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import config from '../../config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailResetPassword(
    token: string,
    name: string,
    email: string,
  ): Promise<void> {
    const url = `${config.hostClient}/reset-password/${token}`;
    await this.mailerService.sendMail({
      from: config.fromMail,
      to: email,
      subject: 'Сброс пароля',
      html: `
      <h3>Привет ${name}!</h3>
      <p>Пожалуйста используй эту <a href="${url}">ссылку</a> для сброса твоего пароля.</p>
    `,
    });
  }

  async sendNotification(
    token: string,
    name: string,
    email: string,
    geolocation: string,
  ): Promise<void> {
    const url = `${config.hostClient}/reset-password/${token}`;
    await this.mailerService.sendMail({
      from: config.fromMail,
      to: email,
      subject: 'Неверный пароль',
      html: `
      <h3>Привет ${name}!</h3>
      <p>Был введен не верный пароль.</p>
      <p>${geolocation}</p>
      <p>Если это были вы тогда проигнорируйте это письмо иначе ссылка для сброса пароля ниже</p>
      <p>Пожалуйста используй эту <a href="${url}">ссылку</a> для сброса твоего пароля.</p>
    `,
    });
  }
}
