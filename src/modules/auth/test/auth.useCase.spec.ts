import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseConfigTest } from '@src/config';
import mongoose from 'mongoose';
import { UserModule, UserRepository, UserRoleEnum } from '@src/modules/user';
import { AuthModule } from '../auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthUserUseCase, LoginUseCase } from '../useCases';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

describe('Start Auth Test', () => {
  let authService: AuthService,
    repository: UserRepository,
    connection: mongoose.Connection;

  const userMock: any = {
    _id: new mongoose.Types.ObjectId(),
    email: 'testing@test.com',
    password: '1234567890La',
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
        AuthModule,
        MongooseConfigTest,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        EventEmitterModule.forRoot({ global: true }),
      ],
      providers: [
        AuthService,
        LoginUseCase,
        AuthUserUseCase,
        JwtService,
        {
          provide: UserRepository,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    connection = await app.get(getConnectionToken());
    authService = app.get<AuthService>(AuthService);
    repository = app.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  describe('initialize auth services', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
      expect(authService.login).toBeDefined();

      expect(authService).toBeDefined();
      expect(authService.profile).toBeDefined();

      expect(repository).toBeDefined();
      expect(repository.findOneById).toBeDefined();
    });
  });

  describe('success', () => {
    describe('login use case', () => {
      it('should login a user', async () => {
        const userLogin = {
          _doc: {
            _id: userMock._id,
            email: 'testing@test.com',
            password: '1234567890La',
          },
        };

        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        const result = await authService.login(userLogin);

        expect(result.hash).toBeDefined();
        expect(result.user.email).toEqual(userLogin._doc.email);
      });
    });

    describe('auth me use case', () => {
      it('should authenticate a user', async () => {
        jest.spyOn(repository, 'findOneById').mockResolvedValue(userMock);

        const result = await authService.profile(userMock._id);

        expect(repository.findOneById).toHaveBeenCalledWith(userMock._id);
        expect(result).toBeDefined();
        expect(result['_id']).toEqual(userMock._id);
      });
    });
  });
});
