import { MailService } from '../../../src/modules/mail/mail.service';

export const createFakeMailService = (): Record<
  keyof MailService,
  jest.Mock
> => ({
  sendMailResetPassword: jest.fn(),
  sendNotification: jest.fn(),
});
