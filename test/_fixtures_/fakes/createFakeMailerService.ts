import { MailerService } from '@nestjs-modules/mailer';

export const createFakeMailerService = (): Record<
  keyof MailerService,
  jest.Mock
> => ({
  sendMail: jest.fn().mockReturnValue(''),
  addTransporter: jest.fn(),
});
