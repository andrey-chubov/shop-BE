import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriesDto {
  @IsString()
  @IsNotEmpty({ message: 'Название категории не должно быть пустым!' })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Изображение для категории не должно быть пустым!' })
  image: string;
}
