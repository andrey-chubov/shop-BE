import { JwtService } from '@nestjs/jwt';

export const createFakeJwtService = (): Record<
  keyof JwtService,
  jest.Mock
> => ({
  sign: jest.fn(),
  signAsync: jest.fn().mockReturnValue('1'),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
});
