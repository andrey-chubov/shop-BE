import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { changeUserPasswordDto } from './dto/changeUserPassword.dto';
import { UserDto } from './dto/user.dto';
import { UserDocument } from './model/user-model';
import { UsersRepository } from './users.repository';
import config from '../../config';
import { WRONG_PASSWORD, WRONG_USER } from '../../shared/errors/errorMessages';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersRepository.create(createUserDto);
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.usersRepository.find();
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.usersRepository.findById(id);
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.usersRepository.findOne({ email });
  }

  async findUserByPhone(phone: string): Promise<UserDocument> {
    return this.usersRepository.findOne({ phone });
  }

  async findUserByRefreshToken(refreshToken: string): Promise<UserDocument> {
    return this.usersRepository.findOne({ refreshToken });
  }

  async updateUser(
    id: string,
    updateUser: UpdateUserDto | UserDto,
  ): Promise<UserDocument> {
    return this.usersRepository.updateById(id, updateUser);
  }

  async deleteUserById(id: string): Promise<UserDocument> {
    return this.usersRepository.deleteById(id);
  }

  async changePassword(
    id: string,
    userDto: changeUserPasswordDto,
  ): Promise<UserDocument> {
    const user = await this.assertUserExistsById(id);
    await this.assertPassword(user.password, userDto.password);
    const password = await bcrypt.hash(userDto.passwordNew, config.bcryptSalt);
    return this.usersRepository.updateById(id, { password });
  }

  async assertUserExistsById(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new BadRequestException(WRONG_USER);
    }

    return user;
  }

  async assertPassword(userPassword: string, password: string): Promise<void> {
    const passwordMatches = await bcrypt.compare(password, userPassword);
    if (!passwordMatches) {
      throw new BadRequestException(WRONG_PASSWORD);
    }
  }
}
