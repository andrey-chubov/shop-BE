import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { IProduct } from '../product/interfaces/product.interface';
import {
  LOADING_FILE_ERROR,
  DELETE_FILE_ERROR,
} from '../../shared/errors/errorMessages';
import { FileType } from '../../shared/types/fileType';
import { ICategory } from '../categories/interfaces/category.interface';
import config from '../../config';

@Injectable()
export class FilesService {
  private logger = new Logger('FilesService');

  async createImages(files: Array<FileType>): Promise<string[]> {
    try {
      const fileNames = [];
      files.map((image: Express.Multer.File) => {
        return fileNames.push(image.filename);
      });
      this.logger.log(`Create images ${fileNames.toString()}`);
      return fileNames;
    } catch (error) {
      throw new BadRequestException(LOADING_FILE_ERROR);
    }
  }

  async createImage(files: Array<FileType>): Promise<string> {
    try {
      this.logger.log(`Create image ${files[0].filename}`);
      return files[0].filename;
    } catch (error) {
      throw new BadRequestException(LOADING_FILE_ERROR);
    }
  }

  async deleteImages(currentProduct: IProduct): Promise<string[]> {
    try {
      currentProduct.images.map(image => {
        const filePath = path.resolve('./', config.pathToMulter, image);
        fs.unlinkSync(filePath);
      });
      this.logger.log(
        `Delete images for product ${currentProduct._id.toString()}`,
      );
      return [];
    } catch (error) {
      throw new BadRequestException(DELETE_FILE_ERROR);
    }
  }

  async deleteImage(currentCategory: ICategory): Promise<void> {
    try {
      const filePath = path.resolve(
        './',
        config.pathToMulter,
        currentCategory.image,
      );
      fs.unlinkSync(filePath);
      this.logger.log(`Delete image for category ${currentCategory.name}`);
    } catch (error) {
      throw new BadRequestException(DELETE_FILE_ERROR);
    }
  }
}
