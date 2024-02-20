import { IsArray } from 'class-validator';
import { LocalCartType } from '../../../shared/types/localCartType';

export class UpdateCartDto {
  @IsArray()
  carts: Array<LocalCartType>;
}
