import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { BaseResponse, CustomErrorException } from '@src/shared';
import { v4 as uuidV4 } from 'uuid';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseConfigTest } from '@src/config';
import { ConfigModule } from '@nestjs/config';
import {
  CategoryModule,
  GetCategoryUseCase,
  ListCategoriesUseCase,
} from '@src/modules/category';
import { FileModule, SaveArrayFilesUseCase } from '@src/modules/file';
import {
  DeleteProductUseCase,
  GetProductUseCase,
  SaveProductUseCase,
  UpdateProductUseCase,
} from '../useCases';
import { ProductRepository } from '../repositories';
import { ProductTransformer } from '../transformers';
import { ProductService } from '../product.service';

describe('Start Product Test', () => {
  let productService: ProductService,
    repository: ProductRepository,
    connection: mongoose.Connection;

  const response: any = new BaseResponse();

  const fileProductMock: any = [
    {
      _id: new mongoose.Types.ObjectId(),
      route: uuidV4(),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      route: uuidV4(),
    },
  ];

  const fileCategoryMock: any = {
    _id: new mongoose.Types.ObjectId(),
    route: uuidV4(),
  };

  const categoryMock: any = {
    _id: new mongoose.Types.ObjectId(),
    name: 'mens',
    file: fileCategoryMock,
  };

  const productMock: any = {
    _id: new mongoose.Types.ObjectId(),
    name: 'mens',
    description: 'test prueba',
    stock: 10,
    price: 100000,
    enable: true,
    category: categoryMock,
    files: fileProductMock,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        FileModule,
        CategoryModule,
        MongooseConfigTest,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      providers: [
        ProductService,
        SaveProductUseCase,
        ListCategoriesUseCase,
        GetProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
        SaveArrayFilesUseCase,
        GetCategoryUseCase,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    connection = await app.get(getConnectionToken());
    productService = app.get<ProductService>(ProductService);
    repository = app.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  describe('initialize Product services', () => {
    it('should be defined', async () => {
      expect(productService).toBeDefined();
      expect(productService.findAll).toBeDefined();

      expect(productService.findOneById).toBeDefined();

      expect(productService.create).toBeDefined();

      expect(productService.update).toBeDefined();

      expect(productService.remove).toBeDefined();

      expect(repository).toBeDefined();
      expect(repository.create).toBeDefined();
      expect(repository.save).toBeDefined();
      expect(repository.findAll).toBeDefined();
      expect(repository.findOneById).toBeDefined();
      expect(repository.findOne).toBeDefined();
      expect(repository.update).toBeDefined();
      expect(repository.delete).toBeDefined();
    });
  });

  describe('success', () => {
    describe('save use cases', () => {
      it('should save a product', async () => {
        const Product = {
          name: 'mens',
        };

        const ProductMockResponse = await response.send(
          productMock,
          HttpStatus.CREATED,
          new ProductTransformer(),
        );

        const ProductResponse = await response.send(
          Product,
          HttpStatus.CREATED,
          new ProductTransformer(),
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementationOnce(
            async () => await Promise.resolve(ProductMockResponse.data),
          );

        const result = await productService.create(
          ProductResponse.data,
          fileProductMock,
        );

        // Assert
        expect(result.data).toEqual(ProductMockResponse.data);
      });
    });

    describe('find use cases', () => {
      it('should get categories', async () => {
        jest
          .spyOn(repository, 'findAll')
          .mockImplementationOnce(
            async () => await Promise.resolve(productMock),
          );

        const result = await productService.findAll();

        // Assert
        expect(result).toBeDefined();
        expect(result.data['_id']).toEqual(productMock._id);
      });

      it('should get a Product by id', async () => {
        jest.spyOn(repository, 'findOneById').mockResolvedValue(productMock);

        const result = await productService.findOneById(productMock._id);

        // Assert
        expect(repository.findOneById).toHaveBeenCalledWith(productMock._id);
        expect(result).toBeDefined();
        expect(result.data['_id']).toEqual(productMock._id);
      });
    });

    describe('update use cases', () => {
      it('should update a Product', async () => {
        const updateProduct = {
          ...productMock,
          name: 'womens',
          category: categoryMock,
          files: fileProductMock,
        };

        const product = {
          name: 'womens',
          category: categoryMock,
          files: fileProductMock,
        };

        jest.spyOn(repository, 'findOneById').mockResolvedValue(productMock);

        jest.spyOn(repository, 'update').mockResolvedValue(updateProduct);

        const result = await productService.update(productMock._id, product);

        // Assert
        expect(repository.update).toHaveBeenCalledWith(
          productMock._id,
          product,
        );
        expect(result.data['name']).toEqual(product.name);
      });
    });

    describe('delete use cases', () => {
      it('should delete a Product', async () => {
        const deleteProductMock = {
          ...productMock,
          file: null,
        };

        jest
          .spyOn(repository, 'findOneById')
          .mockResolvedValue(deleteProductMock);

        jest.spyOn(repository, 'delete').mockResolvedValue(deleteProductMock);

        const result = await productService.remove(deleteProductMock._id);

        // Assert
        expect(repository.delete).toHaveBeenCalledWith(deleteProductMock._id);
        expect(result.data['_id']).toEqual(deleteProductMock._id);
      });
    });
  });

  describe('fails', () => {
    describe('save Product', () => {
      it('should throw ConflictException if name is registered', async () => {
        const Product = {
          name: 'mens',
        };

        const ProductResponse = await response.send(
          Product,
          HttpStatus.CREATED,
          new ProductTransformer(),
        );

        const conflictException = new ConflictException(
          `mens Product is already registered`,
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementation(
            async () => await Promise.reject(conflictException),
          );

        // Assert
        await expect(
          productService.create(ProductResponse.data, fileProductMock),
        ).rejects.toThrow(CustomErrorException);
      });
    });

    describe('get Product by id', () => {
      it('should throw BadRequestException if invalid ID is provide', async () => {
        const id = 'invalid-id';

        const isValidObjectIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(false);

        // Assert
        await expect(productService.findOneById(id)).rejects.toThrow(
          CustomErrorException,
        );
        isValidObjectIdMock.mockRestore();
      });

      it('should throw NotFoundException if Product is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const notFoundException = new NotFoundException(`Product not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(productService.findOneById(testId)).rejects.toThrow(
          CustomErrorException,
        );
      });
    });

    describe('update Product', () => {
      it('should throw BadRequestException if invalid ID is provide', async () => {
        const id = 'invalid-id';

        const updateProduct = {
          ...productMock,
          name: 'womens',
        };

        const isValidObjectIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(false);

        // Assert
        await expect(productService.update(id, updateProduct)).rejects.toThrow(
          CustomErrorException,
        );
        isValidObjectIdMock.mockRestore();
      });

      it('should throw NotFoundException if Product is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const updateProduct = {
          ...productMock,
          name: 'womens',
        };

        const notFoundException = new NotFoundException(`Product not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(
          productService.update(testId, updateProduct),
        ).rejects.toThrow(CustomErrorException);
      });

      it('should throw ConflictException if Product name is registered', async () => {
        const updateProduct = {
          ...productMock,
          name: 'womens',
        };

        const conflictException = new ConflictException(
          `womens Product is already registered`,
        );

        jest.spyOn(repository, 'findOneById').mockResolvedValue(productMock);

        jest
          .spyOn(repository, 'update')
          .mockImplementation(
            async () => await Promise.reject(conflictException),
          );

        // Assert
        await expect(
          productService.update(productMock._id, updateProduct),
        ).rejects.toThrow(CustomErrorException);
      });
    });

    describe('delete Product', () => {
      it('should throw BadRequestException if invalid ID is provide', async () => {
        const id = 'invalid-id';

        const isValidObjectIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(false);

        // Assert
        await expect(productService.remove(id)).rejects.toThrow(
          CustomErrorException,
        );
        isValidObjectIdMock.mockRestore();
      });

      it('should throw NotFoundException if Product is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const notFoundException = new NotFoundException(`Product not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(productService.remove(testId)).rejects.toThrow(
          CustomErrorException,
        );
      });
    });
  });
});
