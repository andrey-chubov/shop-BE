import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../modules/users/dto/createUser.dto';

export class AuthenticationDto extends PartialType(CreateUserDto) {}
