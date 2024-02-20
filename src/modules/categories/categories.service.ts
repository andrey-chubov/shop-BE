import { Injectable, Logger } from '@nestjs/common';
import { FileType } from '../../shared/types/fileType';
import { FilesService } from '../../modules/files/file.service';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoriesDto } from './dto/createCategories.dto';
import { UpdateCategoriesDto } from './dto/updateCategories.dto';
import { CategoriesDocument } from './model/categories-model';

@Injectable()
export class CategoriesService {
  private logger = new Logger('CategoriesService');

  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly filesServices: FilesService,
  ) {}

  async createCategories(
    createCategoriesDto: CreateCategoriesDto,
    file: Array<FileType>,
  ): Promise<CategoriesDocument> {
    const imageName = await this.filesServices.createImage(file);
    this.logger.log(`Category with name: ${createCategoriesDto.name} create`);

    return await this.categoriesRepository.create({
      ...createCategoriesDto,
      image: imageName,
    });
  }

  async getAllCategories(): Promise<CategoriesDocument[]> {
    return this.categoriesRepository.find();
  }

  async findCategoriesById(id: string): Promise<CategoriesDocument> {
    return this.categoriesRepository.findById(id);
  }

  async updateCategories(
    id: string,
    updatedCategories: UpdateCategoriesDto,
  ): Promise<CategoriesDocument> {
    return this.categoriesRepository.updateById(id, updatedCategories);
  }

  async deleteImageCategory(
    id: string,
    updatedCategories: UpdateCategoriesDto,
  ): Promise<CategoriesDocument> {
    const currentCategory = await this.categoriesRepository.findById(id);

    if (currentCategory) {
      await this.filesServices.deleteImage(currentCategory);
      return this.categoriesRepository.updateById(id, {
        ...updatedCategories,
        image: '',
      });
    }
  }

  async deleteCategories(id: string): Promise<CategoriesDocument> {
    return this.categoriesRepository.deleteById(id);
  }
}
