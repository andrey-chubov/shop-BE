import { Test } from '@nestjs/testing';
import { CategoriesRepository } from '../../../src/modules/categories/categories.repository';
import { ICategory } from '../../../src/modules/categories/interfaces/category.interface';
import { FilesService } from '../../../src/modules/files/file.service';
import { CategoriesBuilder } from '../../_fixtures_/categoriesBuilder';
import { CategoriesService } from '../../../src/modules/categories/categories.service';
import { createFakeCategoriesRepository } from '../../_fixtures_/fakes/createFakeCategoriesRepository';
import { createFakeFileService } from '../../_fixtures_/fakes/createFakeFileService';
import { UpdateCategoriesDtoBuilder } from '../../_fixtures_/updateCategoriesDtoBuilder';
import { CreateCategoriesDtoBuilder } from '../../_fixtures_/createCategoriesDtoBuilder';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  const stubCategoriesRepository = createFakeCategoriesRepository();
  const stubFileService = createFakeFileService();
  const mockCategory = CategoriesBuilder.defaultAll().result;
  const mockCreateCategory = CreateCategoriesDtoBuilder.defaultAll().result;
  const mockCategoruUpdate = UpdateCategoriesDtoBuilder.defaultAll().result;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [CategoriesService],
      providers: [
        {
          provide: CategoriesRepository,
          useValue: stubCategoriesRepository,
        },
        {
          provide: FilesService,
          useValue: stubFileService,
        },
      ],
    }).compile();

    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    describe('when getAllCategories is called', () => {
      let categories: ICategory[];

      beforeEach(async () => {
        categories = await categoriesService.getAllCategories();
      });

      test('then it should call categoriesRepository', () => {
        expect(stubCategoriesRepository.find).toHaveBeenCalled();
      });

      test('then is should be return  categories', () => {
        expect(categories).toEqual([mockCategory]);
      });
    });
  });

  describe('findCategoriesById', () => {
    describe('when findCategoriesById is called', () => {
      let category: ICategory;

      beforeEach(async () => {
        category = await categoriesService.findCategoriesById('1231232');
      });

      test('then it should call categoriesRepository', () => {
        expect(stubCategoriesRepository.findById).toHaveBeenCalled();
      });

      test('then is should be return  categories', () => {
        expect(category).toEqual(mockCategory);
      });
    });
  });

  describe('deleteCategoriesById', () => {
    describe('when deleteCategoriesById is called', () => {
      let category: ICategory;

      beforeEach(async () => {
        category = await categoriesService.deleteCategories('1231232');
      });

      test('then it should call categoriesRepository', () => {
        expect(stubCategoriesRepository.deleteById).toHaveBeenCalled();
      });

      test('then is should be return  categories', () => {
        expect(category).toEqual(mockCategory);
      });
    });
  });

  describe('updateCategories', () => {
    describe('when updateCategories is called', () => {
      let category: ICategory;

      beforeEach(async () => {
        category = await categoriesService.updateCategories(
          '1231232',
          mockCategoruUpdate,
        );
      });

      test('then it should call categoriesRepository', () => {
        expect(stubCategoriesRepository.updateById).toHaveBeenCalled();
      });

      test('then is should be return  categories', () => {
        expect(category).toEqual(mockCategory);
      });
    });
  });

  describe('createCategories', () => {
    describe('when updateCategories is called', () => {
      let category: ICategory;

      beforeEach(async () => {
        category = await categoriesService.createCategories(
          mockCreateCategory,
          [],
        );
      });

      test('then it should call categoriesRepository', () => {
        expect(stubCategoriesRepository.create).toHaveBeenCalled();
      });

      test('then is should be return  categories', () => {
        expect(category).toEqual(mockCategory);
      });
    });
  });

  describe('deleteImageCategory', () => {
    describe('when updateCategories is called', () => {
      let category: ICategory;

      beforeEach(async () => {
        category = await categoriesService.deleteImageCategory(
          'fg2342',
          mockCategoruUpdate,
        );
      });

      test('then it should call categoriesRepository', () => {
        expect(stubCategoriesRepository.findById).toHaveBeenCalled();
        expect(stubFileService.deleteImage).toHaveBeenCalled();
        expect(stubCategoriesRepository.updateById).toHaveBeenCalled();
      });

      test('then is should be return  categories', () => {
        expect(category).toEqual(mockCategory);
      });
    });
  });
});
