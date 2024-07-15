import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { CategoryRepository } from '../repositories';
import mongoose from 'mongoose';
import {
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  SaveCategoryUseCase,
  UpdateCategoryUseCase,
} from '../useCases';
import { BaseResponse, CustomErrorException } from '@src/shared';
import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CategoryTransformer } from '../transformers';
import { FileModule, SaveFileUseCase } from '@src/modules/file';
import { MongooseConfigTest } from '@src/config';
import { ConfigModule } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Start Category Test', () => {
  let categoryService: CategoryService,
    repository: CategoryRepository,
    connection: mongoose.Connection;

  const response: any = new BaseResponse();

  const fileMock: any = {
    _id: new mongoose.Types.ObjectId(),
    route: uuidV4(),
  };

  const categoryMock: any = {
    _id: new mongoose.Types.ObjectId(),
    name: 'mens',
    file: fileMock,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        FileModule,
        MongooseConfigTest,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      providers: [
        CategoryService,
        SaveCategoryUseCase,
        ListCategoriesUseCase,
        GetCategoryUseCase,
        UpdateCategoryUseCase,
        DeleteCategoryUseCase,
        SaveFileUseCase,
        {
          provide: CategoryRepository,
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
    categoryService = app.get<CategoryService>(CategoryService);
    repository = app.get<CategoryRepository>(CategoryRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  describe('initialize category services', () => {
    it('should be defined', async () => {
      expect(categoryService).toBeDefined();
      expect(categoryService.findAll).toBeDefined();

      expect(categoryService.findOneById).toBeDefined();

      expect(categoryService.create).toBeDefined();

      expect(categoryService.update).toBeDefined();

      expect(categoryService.remove).toBeDefined();

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
      it('should save a category', async () => {
        const category = {
          name: 'mens',
        };

        const categoryMockResponse = await response.send(
          categoryMock,
          HttpStatus.CREATED,
          new CategoryTransformer(),
        );

        const categoryResponse = await response.send(
          category,
          HttpStatus.CREATED,
          new CategoryTransformer(),
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementationOnce(
            async () => await Promise.resolve(categoryMockResponse.data),
          );

        const result = await categoryService.create(
          categoryResponse.data,
          fileMock,
        );

        // Assert
        expect(result.data).toEqual(categoryMockResponse.data);
      });
    });

    describe('find use cases', () => {
      it('should get categories', async () => {
        jest
          .spyOn(repository, 'findAll')
          .mockImplementationOnce(
            async () => await Promise.resolve(categoryMock),
          );

        const result = await categoryService.findAll();

        // Assert
        expect(result).toBeDefined();
        expect(result.data['_id']).toEqual(categoryMock._id);
      });

      it('should get a category by id', async () => {
        jest.spyOn(repository, 'findOneById').mockResolvedValue(categoryMock);

        const result = await categoryService.findOneById(categoryMock._id);

        // Assert
        expect(repository.findOneById).toHaveBeenCalledWith(categoryMock._id);
        expect(result).toBeDefined();
        expect(result.data['_id']).toEqual(categoryMock._id);
      });
    });

    describe('update use cases', () => {
      it('should update a category', async () => {
        const updateCategory = {
          ...categoryMock,
          name: 'womens',
          file: fileMock,
        };

        const category = {
          name: 'womens',
          file: fileMock,
        };

        jest.spyOn(repository, 'findOneById').mockResolvedValue(categoryMock);

        jest.spyOn(repository, 'update').mockResolvedValue(updateCategory);

        const result = await categoryService.update(categoryMock._id, category);

        // Assert
        expect(repository.update).toHaveBeenCalledWith(
          categoryMock._id,
          category,
        );
        expect(result.data['name']).toEqual(category.name);
      });
    });

    describe('delete use cases', () => {
      it('should delete a category', async () => {
        const deleteCategoryMock = {
          ...categoryMock,
          file: null,
        };

        jest
          .spyOn(repository, 'findOneById')
          .mockResolvedValue(deleteCategoryMock);

        jest.spyOn(repository, 'delete').mockResolvedValue(deleteCategoryMock);

        const result = await categoryService.remove(deleteCategoryMock._id);

        // Assert
        expect(repository.delete).toHaveBeenCalledWith(deleteCategoryMock._id);
        expect(result.data['_id']).toEqual(deleteCategoryMock._id);
      });
    });
  });

  describe('fails', () => {
    describe('save category', () => {
      it('should throw ConflictException if name is registered', async () => {
        const category = {
          name: 'mens',
        };

        const categoryResponse = await response.send(
          category,
          HttpStatus.CREATED,
          new CategoryTransformer(),
        );

        const conflictException = new ConflictException(
          `mens category is already registered`,
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementation(
            async () => await Promise.reject(conflictException),
          );

        // Assert
        await expect(
          categoryService.create(categoryResponse.data, fileMock),
        ).rejects.toThrow(CustomErrorException);
      });
    });

    describe('get category by id', () => {
      it('should throw NotFoundException if category is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const notFoundException = new NotFoundException(`Category not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(categoryService.findOneById(testId)).rejects.toThrow(
          CustomErrorException,
        );
      });
    });

    describe('update category', () => {
      it('should throw NotFoundException if category is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const updateCategory = {
          ...categoryMock,
          name: 'womens',
        };

        const notFoundException = new NotFoundException(`Category not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(
          categoryService.update(testId, updateCategory),
        ).rejects.toThrow(CustomErrorException);
      });

      it('should throw ConflictException if category name is registered', async () => {
        const updateCategory = {
          ...categoryMock,
          name: 'womens',
        };

        const conflictException = new ConflictException(
          `womens category is already registered`,
        );

        jest.spyOn(repository, 'findOneById').mockResolvedValue(categoryMock);

        jest
          .spyOn(repository, 'update')
          .mockImplementation(
            async () => await Promise.reject(conflictException),
          );

        // Assert
        await expect(
          categoryService.update(categoryMock._id, updateCategory),
        ).rejects.toThrow(CustomErrorException);
      });
    });

    describe('delete category', () => {
      it('should throw NotFoundException if category is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const notFoundException = new NotFoundException(`Category not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(categoryService.remove(testId)).rejects.toThrow(
          CustomErrorException,
        );
      });
    });
  });
});
