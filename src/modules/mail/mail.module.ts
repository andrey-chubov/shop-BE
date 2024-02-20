import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import config from '../../config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: config.serviceMail,
        secure: config.secureMail,
        auth: config.authMail,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
