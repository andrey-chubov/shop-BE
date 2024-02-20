import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { UserValidationPipes } from '../../pipes/userValidation.pipe';
import { AccessAuthGuard } from '../authentication/guards/accessAuth.guard';
import { CartsService } from '../carts/carts.service';
import { UpdateCartDto } from '../carts/dto/updateCart.dto';
import { FavoritesService } from '../favorites/favorites.service';
import { changeUserPasswordDto } from './dto/changeUserPassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDocument } from './model/user-model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly favoriteService: FavoritesService,
    private readonly cartService: CartsService,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AccessAuthGuard)
  @Patch('favorites/:productId')
  toggleUserFavorites(
    @Req() req,
    @Param('productId') productId: string,
  ): Promise<UserDocument> {
    return this.favoriteService.toggleUserFavorites(req.user.id, productId);
  }

  @UseGuards(AccessAuthGuard)
  @Patch('carts/:productId')
  toggleUserCarts(
    @Req() req,
    @Param('productId') productId: string,
  ): Promise<UserDocument> {
    return this.cartService.toggleUserCarts(req.user.id, productId);
  }

  @UseGuards(AccessAuthGuard)
  @Patch('carts/:productId/increment')
  incrementAmountProductInCart(
    @Req() req,
    @Param('productId') productId: string,
  ): Promise<UserDocument> {
    return this.cartService.incrementAmountProductInCart(
      req.user.id,
      productId,
    );
  }

  @UseGuards(AccessAuthGuard)
  @Patch('carts/:productId/decrement')
  decrementAmountProductInCart(
    @Req() req,
    @Param('productId') productId: string,
  ): Promise<UserDocument> {
    return this.cartService.decrementAmountProductInCart(
      req.user.id,
      productId,
    );
  }

  @UseGuards(AccessAuthGuard)
  @Patch('carts')
  clearCart(@Req() req): Promise<UserDocument> {
    return this.cartService.clearCart(req.user.id);
  }

  @UseGuards(AccessAuthGuard)
  @Patch('synchronyse')
  updateCart(
    @Req() req,
    @Body() localCart: UpdateCartDto,
  ): Promise<UserDocument> {
    return this.cartService.updateCart(req.user.id, localCart);
  }

  @Get()
  getAllUsers(): Promise<UserDocument[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findUserById(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.deleteUserById(id);
  }

  @UsePipes(UserValidationPipes)
  @UseGuards(AccessAuthGuard)
  @Patch('password')
  changePassword(
    @Req() req,
    @Body() userDto: changeUserPasswordDto,
  ): Promise<UserDocument> {
    return this.usersService.changePassword(req.user.id, userDto);
  }

  @UsePipes(UserValidationPipes)
  @UseGuards(AccessAuthGuard)
  @Patch('update')
  updateUser(
    @Req() req,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.updateUser(req.user.id, userDto);
  }
}
