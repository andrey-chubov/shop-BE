import { createFakeProductsRepository } from '../../_fixtures_/fakes/createFakeProductsRepository';
import { ProductsService } from '../../../src/modules/product/products.service';
import { createFakeFileService } from '../../_fixtures_/fakes/createFakeFileService';
import { CreateProductsDtoBuilder } from '../../_fixtures_/createProductDtoBuilder';
import { Test } from '@nestjs/testing';
import { ProductsRepository } from '../../../src/modules/product/products.repository';
import { FilesService } from '../../../src/modules/files/file.service';
import { IProduct } from '../../../src/modules/product/interfaces/product.interface';
import { ProductsBuilder } from '../../_fixtures_/productBuilder';
import { GetProductsDtoBuilder } from '../../_fixtures_/getProductsDtoBuilder';
import { GetProductsDto } from '../../../src/modules/product/dto/getProducts.dto';
import config from '../../../src/config';
import { UpdateProductsDtoBuilder } from '../../_fixtures_/updateProductsDtoBuilder';
import { FilteredProductDtoBuilder } from '../../_fixtures_/filteredProductDtoBuilder';

describe('ProductsService', () => {
  let productService: ProductsService;
  const stubRepository = createFakeProductsRepository();
  const stubFileService = createFakeFileService();
  const mockCreateProductsDto = CreateProductsDtoBuilder.defaultAll().result;
  const mockProduct = ProductsBuilder.defaultAll().result;
  const mockGetProductsDto = GetProductsDtoBuilder.defaultAll().result;
  const mockUpdateProductsDto = UpdateProductsDtoBuilder.defaultAll().result;
  const mockFilterDto = FilteredProductDtoBuilder.defaultAll().result;
  const limit = config.defaultLimitPagination;
  const page = config.defaultPagePagination;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ProductsService],
      providers: [
        {
          provide: ProductsRepository,
          useValue: stubRepository,
        },
        {
          provide: FilesService,
          useValue: stubFileService,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('createProducts', () => {
    let product: IProduct;
    const spyFile = jest
      .spyOn(stubFileService, 'createImages')
      .mockReturnValue([]);

    test('it should be return new product ', async () => {
      product = await productService.createProducts(mockCreateProductsDto, []);
      expect(product).toEqual(mockProduct);
    });
  });

  describe('getAllProducts', () => {
    let products: GetProductsDto;

    test('it should be return array products ', async () => {
      products = await productService.getAllProducts();
      expect(products).toEqual(mockGetProductsDto);
    });
  });

  describe('getNewProducts', () => {
    let products: IProduct[];

    test('it should be return array products ', async () => {
      products = await productService.getNewProducts();
      expect(products).toEqual([mockProduct]);
    });
  });

  describe('getNewProductsByCategory', () => {
    let products: IProduct[];

    test('it should be return array products ', async () => {
      products = await productService.getNewProductsByCategory('categoryId');
      expect(products).toEqual([mockProduct]);
    });
  });

  describe('getProductsByCategory', () => {
    let products: GetProductsDto;

    test('it should be return array products ', async () => {
      products = await productService.getProductsByCategory(
        limit,
        page,
        'categoryId',
      );
      expect(products).toEqual(mockGetProductsDto);
    });
  });

  describe('getProductById', () => {
    let product: IProduct;

    test('it should be return product ', async () => {
      product = await productService.getProductById('Id');
      expect(product).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    let product: IProduct;

    test('it should be return  product ', async () => {
      product = await productService.updateProduct('Id', mockUpdateProductsDto);
      expect(product).toEqual(mockProduct);
    });
  });

  describe('getSelectedProducts', () => {
    let products: GetProductsDto;

    test('it should be return array products ', async () => {
      products = await productService.getSelectedProducts(
        ['d1234', '3434324a'],
        limit,
        page,
      );
      expect(products).toEqual(mockGetProductsDto);
    });
  });

  describe('getProductsWithFilters', () => {
    let products: GetProductsDto;

    test('it should be return array products ', async () => {
      products = await productService.getProductsWithFilters(
        mockFilterDto,
        limit,
        page,
      );
      expect(products).toEqual(mockGetProductsDto);
    });
  });

  describe('getAmountProductsInCategory', () => {
    let count: number;
    const spyAmount = jest
      .spyOn(stubRepository, 'productsCountCategory')
      .mockReturnValue(0);

    test('it should be return count product in category ', async () => {
      count = await productService.getAmountProductsInCategory('categoryId');
      expect(count).toEqual(0);
    });
  });

  describe('deleteImageProducts', () => {
    let product: IProduct;
    const spyRepository = jest
      .spyOn(stubRepository, 'findById')
      .mockReturnValueOnce(mockProduct)
      .mockReturnValueOnce(mockProduct);

    test('it should be delete images in product and then return updated product ', async () => {
      product = await productService.deleteImageProducts(
        'id product',
        mockUpdateProductsDto,
      );
      expect(product).toEqual(mockProduct);
    });

    test('it should be return undefined if user not found ', async () => {
      product = await productService.deleteImageProducts(
        'id product',
        mockUpdateProductsDto,
      );
      expect(undefined).toEqual(undefined);
    });
  });
});
