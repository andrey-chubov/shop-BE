import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsMobilePhone,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { PASSWORD_MATCH_REGEX } from '../../../shared/constants';
import { CartType } from '../../../shared/types/cartType';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Имя не должно быть пустым!' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой!' })
  lastName: string;

  @IsString()
  @IsEmail({}, { message: 'Некорректный Email!' })
  readonly email: string;

  @IsString()
  @Matches(PASSWORD_MATCH_REGEX, {
    message:
      'Пароль не меньше 6 символов, должен содержать только английские буквы и минимум одну цифру!',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Адресс не должен  быть пустым!' })
  address: string;

  @IsString()
  @IsMobilePhone(['ru-RU'], { message: 'Некорректный номер телефона!' })
  phone: string;

  favorites: Types.ObjectId[];
  carts: Array<CartType>;
  isAdmin: boolean;
  refreshToken: string;
}
