import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { WRONG_USER } from '../../shared/errors/errorMessages';
import { UserDocument } from '../users/model/user-model';
import { UsersService } from '../users/users.service';

@Injectable()
export class FavoritesService {
  private logger = new Logger('FavoritesService');

  constructor(private readonly usersService: UsersService) {}

  async toggleUserFavorites(
    id: string,
    productId: string,
  ): Promise<UserDocument> {
    const currentUser = await this.usersService.findUserById(id);

    if (!currentUser) {
      throw new BadRequestException(WRONG_USER);
    }

    if (currentUser.favorites.some(item => item._id.toString() === productId)) {
      const indexToDelete = currentUser.favorites.findIndex(
        item => item._id.toString() === productId,
      );
      currentUser.favorites.splice(indexToDelete, 1);
      this.logger.log(
        `User ${currentUser.email} delete ${productId} from favorites`,
      );

      return await this.usersService.updateUser(id, {
        ...currentUser,
      });
    }

    currentUser.favorites.push(new Types.ObjectId(productId));
    this.logger.log(`User ${currentUser.email} add ${productId} in favorites`);

    return await this.usersService.updateUser(id, { ...currentUser });
  }
}
