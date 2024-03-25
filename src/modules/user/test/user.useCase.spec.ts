import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConfigTest } from '@src/config';
import { UserModule } from '../user.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  SaveUserAdminUseCase,
  SaveUserUseCase,
  UpdateUserPasswordUseCase,
  UpdateUserUseCase,
} from '../useCases';
import { UserRepository } from '../repositories';
import mongoose from 'mongoose';
import { UserRoleEnum } from '../enums';
import { UserService } from '../user.service';
import { BaseResponse, CustomErrorException } from '@src/shared';
import {
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserTransformer } from '../transformers';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Start User Test', () => {
  let userService: UserService,
    repository: UserRepository,
    updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    connection: mongoose.Connection;

  const response: any = new BaseResponse();

  const userMock: any = {
    _id: new mongoose.Types.ObjectId(),
    email: 'testing@test.com',
    password: '1234567890',
    role: UserRoleEnum.SUPER_ADMIN,
    person: {
      fullName: 'testing mock',
      codePostal: '6101',
      country: 'venezuela',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        MongooseConfigTest,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        EventEmitterModule.forRoot({ global: true }),
      ],
      providers: [
        UserService,
        SaveUserUseCase,
        ListUsersUseCase,
        GetUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        SaveUserAdminUseCase,
        UpdateUserPasswordUseCase,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    connection = await app.get(getConnectionToken());
    userService = app.get<UserService>(UserService);
    updateUserPasswordUseCase = app.get<UpdateUserPasswordUseCase>(
      UpdateUserPasswordUseCase,
    );
    repository = app.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  describe('initialize user services', () => {
    it('should be defined', async () => {
      expect(userService).toBeDefined();
      expect(userService.findAll).toBeDefined();

      expect(userService.findOneById).toBeDefined();

      expect(userService.createAdmin).toBeDefined();

      expect(userService.create).toBeDefined();

      expect(userService.update).toBeDefined();

      expect(userService.updatePassword).toBeDefined();
      expect(updateUserPasswordUseCase.updateUserPassword).toBeDefined();

      expect(userService.remove).toBeDefined();

      expect(repository).toBeDefined();
      expect(repository.create).toBeDefined();
      expect(repository.save).toBeDefined();
      expect(repository.findAll).toBeDefined();
      expect(repository.findOneById).toBeDefined();
      expect(repository.update).toBeDefined();
      expect(repository.delete).toBeDefined();
    });
  });

  describe('success', () => {
    describe('save use cases', () => {
      it('should save a user admin', async () => {
        const user = {
          email: 'test@test.com',
          password: '1234567890',
          person: {
            fullName: 'test test',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        const userMockResponse = await response.send(
          userMock,
          HttpStatus.CREATED,
          new UserTransformer(),
        );

        const userResponse = await response.send(
          user,
          HttpStatus.CREATED,
          new UserTransformer(),
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementationOnce(
            async () => await Promise.resolve(userMockResponse.data),
          );

        const result = await userService.createAdmin(userResponse.data);

        // Assert
        expect(result.data).toEqual(userMockResponse.data);
        expect(result.data['role']).toEqual(UserRoleEnum.SUPER_ADMIN);
      });

      it('should save a user', async () => {
        const user = {
          email: 'test@test.com',
          password: '1234567890',
          person: {
            fullName: 'test test',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        userMock.role = UserRoleEnum.CLIENT;

        const userMockResponse = await response.send(
          userMock,
          HttpStatus.CREATED,
          new UserTransformer(),
        );

        const userResponse = await response.send(
          user,
          HttpStatus.CREATED,
          new UserTransformer(),
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementationOnce(
            async () => await Promise.resolve(userMockResponse.data),
          );

        const result = await userService.create(userResponse.data);

        // Assert
        expect(result.data).toEqual(userMockResponse.data);
        expect(result.data['role']).toEqual(UserRoleEnum.CLIENT);
      });
    });

    describe('find use cases', () => {
      it('should get users', async () => {
        jest
          .spyOn(repository, 'findAll')
          .mockImplementationOnce(async () => await Promise.resolve(userMock));

        const result = await userService.findAll();

        // Assert
        expect(result).toBeDefined();
        expect(result.data['_id']).toEqual(userMock._id);
      });

      it('should get a user by id', async () => {
        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        const result = await userService.findOneById(userMock._id);

        // Assert
        expect(repository.findOneById).toHaveBeenCalledWith(userMock._id);
        expect(result).toBeDefined();
        expect(result.data['_id']).toEqual(userMock._id);
      });
    });

    describe('update use cases', () => {
      it('should update a user', async () => {
        const updateUser = {
          ...userMock,
          email: 'test@testing.com',
          person: { fullName: 'testing' },
        };

        const user = {
          email: 'test@testing.com',
          person: {
            fullName: 'testing',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        jest.spyOn(repository, 'update').mockResolvedValue(updateUser);

        const result = await userService.update(userMock._id, user);

        // Assert
        expect(repository.update).toHaveBeenCalledWith(userMock._id, user);
        expect(result.data['email']).toEqual(user.email);
        expect(result.data['person'].fullName).toEqual(user.person.fullName);
      });

      it('should update a user password', async () => {
        const updateUser = {
          ...userMock,
          password: '0987654321',
        };

        const user = {
          password: '0987654321',
        };

        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        jest.spyOn(repository, 'update').mockResolvedValue(updateUser);

        const result = await updateUserPasswordUseCase.updateUserPassword(
          userMock._id,
          user,
        );

        // Assert
        expect(repository.update).toHaveBeenCalledWith(userMock._id, user);
        expect(result.password).toEqual(updateUser.password);
      });
    });

    describe('delete use cases', () => {
      it('should delete a user', async () => {
        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        jest.spyOn(repository, 'delete').mockResolvedValue(userMock);

        const result = await userService.remove(userMock._id);

        // Assert
        expect(repository.delete).toHaveBeenCalledWith(userMock._id);
        expect(result.data['_id']).toEqual(userMock._id);
      });
    });
  });

  describe('fails', () => {
    describe('save user', () => {
      it('should throw ConflictException if email is registered', async () => {
        const user = {
          email: 'test@test.com',
          password: '1234567890',
          person: {
            fullName: 'test test',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        const userResponse = await response.send(
          user,
          HttpStatus.CREATED,
          new UserTransformer(),
        );

        const conflictException = new ConflictException(
          `test@test.com registered`,
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementation(
            async () => await Promise.reject(conflictException),
          );

        // Assert
        await expect(
          userService.createAdmin(userResponse.data),
        ).rejects.toThrow(CustomErrorException);
      });

      it(`should throw UnprocessableEntityException if password doesn't follow the required format`, async () => {
        const user = {
          email: 'test@test.com',
          password: '1234567890',
          person: {
            fullName: 'test test',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        const userResponse = await response.send(
          user,
          HttpStatus.CREATED,
          new UserTransformer(),
        );

        const unprocessableEntityException = new UnprocessableEntityException(
          `password must have at least one capital letter'`,
        );

        jest
          .spyOn(repository, 'save')
          .mockImplementation(
            async () => await Promise.reject(unprocessableEntityException),
          );

        // Assert
        await expect(
          userService.createAdmin(userResponse.data),
        ).rejects.toThrow(CustomErrorException);
      });
    });

    describe('get user by id', () => {
      it('should throw BadRequestException if invalid ID is provide', async () => {
        const id = 'invalid-id';

        const isValidObjectIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(false);

        // Assert
        await expect(userService.findOneById(id)).rejects.toThrow(
          CustomErrorException,
        );
        isValidObjectIdMock.mockRestore();
      });

      it('should throw NotFoundException if user is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const notFoundException = new NotFoundException(`User not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(userService.findOneById(testId)).rejects.toThrow(
          CustomErrorException,
        );
      });
    });

    describe('update user', () => {
      it('should throw BadRequestException if invalid ID is provide', async () => {
        const id = 'invalid-id';

        const updateUser = {
          ...userMock,
          email: 'test@testing.com',
          person: { fullName: 'testing' },
        };

        const isValidObjectIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(false);

        // Assert
        await expect(userService.update(id, updateUser)).rejects.toThrow(
          CustomErrorException,
        );
        isValidObjectIdMock.mockRestore();
      });

      it('should throw NotFoundException if user is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const updateUser = {
          ...userMock,
          email: 'test@testing.com',
          person: { fullName: 'testing' },
        };

        const notFoundException = new NotFoundException(`User not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(userService.update(testId, updateUser)).rejects.toThrow(
          CustomErrorException,
        );
      });

      it('should throw ConflictException if email is registered by other user', async () => {
        const updateUser = {
          ...userMock,
          email: 'test@testing.com',
          person: { fullName: 'testing' },
        };

        const conflictException = new ConflictException(
          `test@testing.com registered`,
        );

        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        jest
          .spyOn(repository, 'update')
          .mockImplementation(
            async () => await Promise.reject(conflictException),
          );

        // Assert
        await expect(
          userService.update(userMock._id, updateUser),
        ).rejects.toThrow(CustomErrorException);
      });

      it(`should throw UnprocessableEntityException if password doesn't follow the required format`, async () => {
        const updateUserPassword = {
          password: '0987654321',
        };

        const unprocessableEntityException = new UnprocessableEntityException(
          `password must have at least one capital letter'`,
        );

        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        jest
          .spyOn(repository, 'update')
          .mockImplementation(
            async () => await Promise.reject(unprocessableEntityException),
          );

        // Assert
        await expect(
          userService.updatePassword(userMock._id, updateUserPassword),
        ).rejects.toThrow(CustomErrorException);
      });
    });

    describe('delete user', () => {
      it('should throw BadRequestException if invalid ID is provide', async () => {
        const id = 'invalid-id';

        const isValidObjectIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(false);

        // Assert
        await expect(userService.remove(id)).rejects.toThrow(
          CustomErrorException,
        );
        isValidObjectIdMock.mockRestore();
      });

      it('should throw NotFoundException if user is not found', async () => {
        const testId: any = new mongoose.Types.ObjectId();

        const notFoundException = new NotFoundException(`User not found`);

        jest
          .spyOn(repository, 'findOneById')
          .mockImplementation(
            async () => await Promise.reject(notFoundException),
          );

        // Assert
        await expect(userService.remove(testId)).rejects.toThrow(
          CustomErrorException,
        );
      });
    });
  });
});
