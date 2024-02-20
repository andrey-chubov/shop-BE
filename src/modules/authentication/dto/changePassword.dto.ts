import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_MATCH_REGEX } from '../../../shared/constants';
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_MATCH_REGEX, {
    message:
      'Пароль не меньше 6 символов, должен содержать только английские буквы и минимум одну цифру',
  })
  readonly password: string;
}
