import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [UsersModule],
  exports: [FavoritesService],
  providers: [FavoritesService],
})
export class FavoritesModule {}
