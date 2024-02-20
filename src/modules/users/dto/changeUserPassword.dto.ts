import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_MATCH_REGEX } from '../../../shared/constants';

export class changeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(6, { message: 'Минимальная длина 6 символов' })
  @Matches(PASSWORD_MATCH_REGEX, {
    message:
      'Пароль должен содержать только английские буквы и минимум одну цифру!',
  })
  passwordNew: string;
}
