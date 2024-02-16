import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { User, UserShema } from '../schemas';
import { MongooseConfigTest } from '@src/config';
import * as supertest from 'supertest';
import { IUser } from '../interfaces';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { UserModule } from '../user.module';
import { isInt } from 'class-validator';

describe('UserService', () => {
  let app: INestApplication;
  let apiClient = null;
  const path = '/user';
  const testPort = isInt(Number(process.env.SERVER_TEST_PORT))
    ? process.env.SERVER_TEST_PORT
    : 8080;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseConfigTest,
        MongooseModule.forFeature([{ name: User.name, schema: UserShema }]),
        UserModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.listen(testPort);
    await app.init();

    apiClient = supertest(await app.getUrl());
  });

  afterAll(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  describe('Saver User Use Case Test', () => {
    describe('Save User Success', () => {
      it('Create User', async () => {
        const payload: IUser = {
          email: 'test@test.com',
          password: '1234567890',
          person: {
            fullName: 'test test',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        const response = await apiClient
          .post(path)
          .set('Accept', 'application/json')
          .send(<IUser>payload);

        expect(response.statusCode).toStrictEqual(201);
      });
    });

    describe('Save User Error', () => {
      it('Should throw an error if user email exist', async () => {
        const payload: IUser = {
          email: 'test@test.com',
          password: '1234567890',
          person: {
            fullName: 'test test',
            codePostal: '6101',
            country: 'venezuela',
          },
        };

        const response = await apiClient
          .post(path)
          .set('Accept', 'application/json')
          .send(<IUser>payload);

        expect(response.statusCode).toStrictEqual(409);
      });
    });
  });
});
