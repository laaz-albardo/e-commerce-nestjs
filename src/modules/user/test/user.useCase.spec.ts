import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { User } from '../schemas';
import { MongooseConfigTest } from '@src/config';
import supertest from 'supertest';
import { IUser } from '../interfaces';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { UserModule } from '../user.module';
import { isInt } from 'class-validator';
import { Types } from 'mongoose';
import { UserRoleEnum } from '../enums';
import { AuthModule } from '@src/modules/auth';

describe('Start User Test', () => {
  let app: INestApplication;
  let connection: Connection;
  let apiClient: supertest.Agent = null;
  const testPort = isInt(Number(process.env.SERVER_TEST_PORT))
    ? process.env.SERVER_TEST_PORT
    : 8080;

  const path = '/user';
  const authPath = '/auth';
  let userId = null;
  let token = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseConfigTest, UserModule, AuthModule],
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

  describe('User Use Case', () => {
    test('Create User', async () => {
      const payload: IUser = {
        email: 'test@test.com',
        password: '1234567890',
        role: UserRoleEnum.ADMIN,
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
      expect(response.body.data).toBeDefined();

      userId = response.body.data._id;

      const loginPayload = {
        email: 'test@test.com',
        password: '1234567890',
      };

      const authResponse = await apiClient
        .post(`${authPath}/login`)
        .set('Accept', 'application/json')
        .send(loginPayload);

      expect(authResponse.statusCode).toStrictEqual(201);
      expect(authResponse.body).toBeDefined();

      token = authResponse.body.data.token;
    });

    test('List Users', async () => {
      const response = await apiClient
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.data).toBeInstanceOf(Array<User>);
    });

    test('Get User By Id', async () => {
      const response = await apiClient
        .get(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.data).toBeDefined();
    });

    test('Update User', async () => {
      const payload: IUser = {
        email: 'test2@test.com',
        password: '12345678',
        role: UserRoleEnum.ADMIN,
        person: {
          fullName: 'test test2',
          codePostal: '6101',
          country: 'venezuela',
        },
      };

      const response = await apiClient
        .put(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(<IUser>payload);

      expect(response.statusCode).toStrictEqual(202);
      expect(response.body.data).toBeDefined();

      userId = response.body.data._id;
    });

    test('Delete User By Id', async () => {
      const response = await apiClient
        .delete(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(202);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('User Use Case Error', () => {
    test('Save User -> Should throw an error if user email exist', async () => {
      const payload: IUser = {
        email: 'test@test.com',
        password: '1234567890',
        role: UserRoleEnum.ADMIN,
        person: {
          fullName: 'test test',
          codePostal: '6101',
          country: 'venezuela',
        },
      };

      await apiClient
        .post(path)
        .set('Accept', 'application/json')
        .send(<IUser>payload);

      const response = await apiClient
        .post(path)
        .set('Accept', 'application/json')
        .send(<IUser>payload);

      expect(response.statusCode).toStrictEqual(409);
    });

    test(`Get User By Id -> Should throw an error if user Id is invalid`, async () => {
      userId = 248;

      const response = await apiClient
        .get(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(400);
    });

    test(`Get User By Id -> Should throw an error if user Id don't exist`, async () => {
      userId = new Types.ObjectId();

      const response = await apiClient
        .get(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(404);
    });

    test(`Update User By Id -> Should throw an error if user Id is invalid`, async () => {
      userId = 248;

      const response = await apiClient
        .put(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(400);
    });

    test(`Update User By Id -> Should throw an error if user Id don't exist`, async () => {
      userId = new Types.ObjectId();

      const response = await apiClient
        .put(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(404);
    });

    test('Update User By Id-> Should throw an error if user email exist by other user', async () => {
      const payload: IUser = {
        email: 'test2@test.com',
        password: '1234567890',
        role: UserRoleEnum.CLIENT,
        person: {
          fullName: 'test test',
          codePostal: '6101',
          country: 'venezuela',
        },
      };

      const userResponse = await apiClient
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(<IUser>payload);

      userId = userResponse.body.data._id;

      payload.email = 'test@test.com';

      const response = await apiClient
        .put(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(<IUser>payload);

      expect(response.statusCode).toStrictEqual(409);
    });

    test(`Delete User By Id -> Should throw an error if user Id is invalid`, async () => {
      userId = 248;

      const response = await apiClient
        .delete(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(400);
    });

    test(`Delete User By Id -> Should throw an error if user Id don't exist`, async () => {
      userId = new Types.ObjectId();

      const response = await apiClient
        .delete(`${path}/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toStrictEqual(404);
    });
  });
});
