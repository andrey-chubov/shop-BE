import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import config from '../../config';
import { UserValidationPipes } from '../../pipes/userValidation.pipe';
import { FileType } from '../../shared/types/fileType';
import { assertFileFormat } from '../../modules/files/assertFileFormat';
import { editFileName } from '../../modules/files/editFileName';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/createCategories.dto';
import { UpdateCategoriesDto } from './dto/updateCategories.dto';
import { CategoriesDocument } from './model/categories-model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UsePipes(UserValidationPipes)
  @Post()
  @UseInterceptors(
    FilesInterceptor('image', config.maxCountImageCategory, {
      storage: diskStorage({
        destination: './dist/static/images',
        filename: editFileName,
      }),
      fileFilter: assertFileFormat,
    }),
  )
  createCategories(
    @Body() createCategoriesDto: CreateCategoriesDto,
    @UploadedFiles() file: Array<FileType>,
  ): Promise<CategoriesDocument> {
    return this.categoriesService.createCategories(createCategoriesDto, file);
  }

  @Patch('image/:id')
  deleteImageCategory(
    @Param('id') id: string,
    @Body() updateCategoriesDto: UpdateCategoriesDto,
  ): Promise<CategoriesDocument> {
    return this.categoriesService.deleteImageCategory(id, updateCategoriesDto);
  }

  @Get()
  getAllCategories(): Promise<CategoriesDocument[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  findCategoriesById(@Param('id') id: string): Promise<CategoriesDocument> {
    return this.categoriesService.findCategoriesById(id);
  }

  @UsePipes(UserValidationPipes)
  @Patch(':id')
  updateCategories(
    @Param('id') id: string,
    @Body() updateCategoriesDto: UpdateCategoriesDto,
  ): Promise<CategoriesDocument> {
    return this.categoriesService.updateCategories(id, updateCategoriesDto);
  }

  @UsePipes(UserValidationPipes)
  @Delete(':id')
  deleteCategories(@Param('id') id: string): Promise<CategoriesDocument> {
    return this.categoriesService.deleteCategories(id);
  }
}
