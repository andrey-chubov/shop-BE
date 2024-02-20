import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import {
  DELETE_FILE_ERROR,
  LOADING_FILE_ERROR,
} from '../../../src/shared/errors/errorMessages';
import { FilesService } from '../../../src/modules/files/file.service';
import { ProductsBuilder } from '../../_fixtures_/productBuilder';
import { CategoriesBuilder } from '../../_fixtures_/categoriesBuilder';

describe('FilesService', () => {
  let fileService: FilesService;
  const mockFile = {
    fieldname: 'file',
    originalname: 'TradeHistory.csv',
    encoding: '7bit',
    mimetype: 'text/csv',
    buffer: Buffer.from(__dirname + '/../../TradeHistory.csv', 'utf8'),
    size: 51828,
  } as Express.Multer.File;
  const mockProduct = ProductsBuilder.defaultAll().result;
  const mockCategory = CategoriesBuilder.getImage().result;

  beforeEach(() => {
    fileService = new FilesService();
  });

  describe('createImages', () => {
    const cases = [
      {
        toString: () => '1 should be return array',
        files: [mockFile],
        expected: [mockFile.filename],
      },
      {
        toString: () => '2 should be return exception, when array null',
        files: null,
        expected: new BadRequestException(LOADING_FILE_ERROR),
      },
    ];

    test.each(cases)('%s', async ({ files, expected }) => {
      try {
        const result = await fileService.createImages(files);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('createImage', () => {
    const cases = [
      {
        toString: () => '1 should be return file',
        files: [mockFile],
        expected: mockFile.filename,
      },
      {
        toString: () => '2 should be return exception, when array null',
        files: null,
        expected: new BadRequestException(LOADING_FILE_ERROR),
      },
    ];

    test.each(cases)('%s', async ({ files, expected }) => {
      try {
        const result = await fileService.createImage(files);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('deleteImages', () => {
    const cases = [
      {
        toString: () => '1 should be return []',
        currentProduct: mockProduct,
        expected: [],
      },
      {
        toString: () => '2 should be return exception, when array null',
        currentProduct: null,
        expected: new BadRequestException(DELETE_FILE_ERROR),
      },
    ];

    test.each(cases)('%s', async ({ currentProduct, expected }) => {
      try {
        const result = await fileService.deleteImages(currentProduct);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('deleteImage', () => {
    const spyFs = jest
      .spyOn(fs, 'unlinkSync')
      .mockImplementation((): any => '');
    const cases = [
      {
        toString: () => '1 should be return nothing',
        currentCategory: mockCategory,
        expected: undefined,
      },
      {
        toString: () => '2 should be return exception, when  null',
        currentCategory: null,
        expected: new BadRequestException(DELETE_FILE_ERROR),
      },
    ];

    test.each(cases)('%s', async ({ currentCategory, expected }) => {
      try {
        const result = await fileService.deleteImage(currentCategory);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });
});
