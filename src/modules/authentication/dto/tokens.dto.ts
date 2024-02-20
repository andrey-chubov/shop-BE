import { UserDto } from '../../../modules/users/dto/user.dto';

export class AuthenticationTokens {
  accessToken: string;
  refreshToken: string;
  user?: UserDto;
}
