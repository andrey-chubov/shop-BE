import { ProductsRepository } from '../../../src/modules/product/products.repository';
import { GetProductsDtoBuilder } from '../getProductsDtoBuilder';
import { ProductsBuilder } from '../productBuilder';

export const createFakeProductsRepository = (): Record<
  keyof ProductsRepository,
  jest.Mock
> => ({
  find: jest.fn().mockReturnValue(mockGetProductsDto),
  findById: jest.fn().mockReturnValue(mockProduct),
  findByCategory: jest.fn().mockReturnValue(mockGetProductsDto),
  findByFilters: jest.fn().mockReturnValue(mockGetProductsDto),
  findNew: jest.fn().mockReturnValue([mockProduct]),
  findNewByCategory: jest.fn().mockReturnValue([mockProduct]),
  findSelectedId: jest.fn().mockReturnValue(mockGetProductsDto),
  updateById: jest.fn().mockReturnValue(mockProduct),
  productsCount: jest.fn(),
  productsCountCategory: jest.fn(),
  create: jest.fn().mockReturnValue(mockProduct),
});

const mockProduct = ProductsBuilder.defaultAll().result;
const mockGetProductsDto = GetProductsDtoBuilder.defaultAll().result;
