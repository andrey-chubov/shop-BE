import { Test } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '../../../src/modules/mail/mail.service';
import { createFakeMailerService } from '../../_fixtures_/fakes/createFakeMailerService';

describe('MailService', () => {
  let mailService: MailService;
  const stubMailer = createFakeMailerService();
  const token = 'test token';
  const name = 'test name';
  const email = 'test email';
  const geolocation = 'test geolocation';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [MailService],
      providers: [
        {
          provide: MailerService,
          useValue: stubMailer,
        },
      ],
    }).compile();

    mailService = moduleRef.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  describe('sendMailResetPassword', () => {
    test('should be called mailerService', async () => {
      const spyMail = jest.spyOn(stubMailer, 'sendMail');
      await mailService.sendMailResetPassword(token, name, email);
      expect(spyMail).toBeCalledTimes(1);
    });
  });

  describe('sendNotification', () => {
    test('should be called mailerService', async () => {
      const spyMail = jest.spyOn(stubMailer, 'sendMail');
      await mailService.sendNotification(token, name, email, geolocation);
      expect(spyMail).toBeCalledTimes(1);
    });
  });
});
