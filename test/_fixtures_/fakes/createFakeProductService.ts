import { ProductsService } from '../../../src/modules/product/products.service';
import { ProductsBuilder } from '../productBuilder';

export const createFakeProductService = (): Record<
  keyof ProductsService,
  jest.Mock
> => ({
  createProducts: jest.fn(),
  getAllProducts: jest.fn(),
  getNewProducts: jest.fn(),
  getNewProductsByCategory: jest.fn(),
  getProductsByCategory: jest.fn(),
  getProductById: jest.fn().mockReturnValue(mockProduct),
  getProductsWithFilters: jest.fn(),
  getSelectedProducts: jest.fn(),
  updateProduct: jest.fn(),
  deleteImageProducts: jest.fn(),
  getAmountProductsInCategory: jest.fn(),
});

const mockProduct = ProductsBuilder.defaultAll().result;
