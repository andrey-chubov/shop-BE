import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { UserValidationPipes } from '../../pipes/userValidation.pipe';
import { CreateUserDto } from '../../modules/users/dto/createUser.dto';
import { AuthenticationService } from './authentication.service';
import { LocalAuthGuard } from './guards/localAuth.guard';
import config from '../../config';
import { AccessAuthGuard } from './guards/accessAuth.guard';
import { RefreshAuthGuard } from './guards/refreshAuth.guard';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @UsePipes(UserValidationPipes)
  @Post('registration')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authenticationService.registration(
      createUserDto,
    );
    res.cookie('access_token', userData.accessToken, config.ACCESS_PARAMETR);
    res.cookie('refresh_token', userData.refreshToken, config.REFRESH_PARAMETR);

    return userData;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authenticationService.login(req.user);
    if (userData.user.isAdmin) {
      res.cookie(
        'access_token',
        userData.accessToken,
        config.ACCESS_PARAMETR_ADMIN,
      );
    } else {
      res.cookie('access_token', userData.accessToken, config.ACCESS_PARAMETR);
    }

    res.cookie('refresh_token', userData.refreshToken, config.REFRESH_PARAMETR);

    return userData;
  }

  @UseGuards(AccessAuthGuard)
  @Get('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authenticationService.logout(req.user);
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authenticationService.refresh(req.user);
    if (userData.user.isAdmin) {
      res.cookie(
        'access_token',
        userData.accessToken,
        config.ACCESS_PARAMETR_ADMIN,
      );
    } else {
      res.cookie('access_token', userData.accessToken, config.ACCESS_PARAMETR);
    }

    res.cookie('refresh_token', userData.refreshToken, config.REFRESH_PARAMETR);

    return { accessToken: userData.accessToken, user: userData.user };
  }

  @UsePipes(UserValidationPipes)
  @Post('forgotPassword')
  async forgotPassword(
    @Body() forgotPassword: ForgotPasswordDto,
  ): Promise<void> {
    return this.authenticationService.forgotPassword(forgotPassword);
  }

  @UsePipes(UserValidationPipes)
  @Patch('changePassword')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
  ): Promise<void> {
    await this.authenticationService.changePassword(changePassword);
  }

  @UsePipes(UserValidationPipes)
  @Post('wrongPassword')
  async wrongPassword(
    @Body() forgotPassword: ForgotPasswordDto,
  ): Promise<void> {
    return this.authenticationService.wrongPassword(forgotPassword);
  }
}
