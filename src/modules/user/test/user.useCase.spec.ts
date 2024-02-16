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

describe('Start User Test', () => {
  let app: INestApplication;
  let connection: Connection;
  let apiClient: supertest.Agent = null;
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

    connection = await module.get(getConnectionToken());
    app = module.createNestApplication();
    await app.listen(testPort);
    await app.init();

    apiClient = supertest(await app.getUrl());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  describe('Save User Use Case', () => {
    describe('Save User Success', () => {
      test('Create User', async () => {
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
        expect(response.body).toBeDefined();
      });
    });

    describe('Save User Error', () => {
      test('Should throw an error if user email exist', async () => {
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

  describe('List Users Use Case', () => {
    describe('List Users Success', () => {
      test('List Users', async () => {
        const response = await apiClient
          .get(path)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toStrictEqual(200);
        expect(response.body).toBeInstanceOf(Array<User>);
      });
    });
  });
});
