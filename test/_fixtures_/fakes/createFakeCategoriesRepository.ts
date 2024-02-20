import { CategoriesRepository } from '../../../src/modules/categories/categories.repository';
import { CategoriesBuilder } from '../categoriesBuilder';

export const createFakeCategoriesRepository = (): Record<
  keyof CategoriesRepository,
  jest.Mock
> => ({
  find: jest.fn().mockReturnValue([mockCategory]),
  findById: jest.fn().mockReturnValue(mockCategory),
  updateById: jest.fn().mockReturnValue(mockCategory),
  deleteById: jest.fn().mockReturnValue(mockCategory),
  create: jest.fn().mockReturnValue(mockCategory),
  assertProductsExists: jest.fn(),
});

const mockCategory = CategoriesBuilder.defaultAll().result;
