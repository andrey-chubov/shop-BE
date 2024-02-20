import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './model/user-model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  async find(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .populate('favorites')
      .populate('carts.productId')
      .exec();
  }

  async findOne(obj: UpdateUserDto): Promise<UserDocument> {
    return this.userModel
      .findOne(obj)
      .populate('favorites')
      .populate('carts.productId')
      .exec();
  }

  async updateById(
    id: string,
    updateUser: UpdateUserDto | UserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUser, { new: true })
      .populate('favorites')
      .populate('carts.productId')
      .exec();
  }

  async deleteById(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id);
  }
}
