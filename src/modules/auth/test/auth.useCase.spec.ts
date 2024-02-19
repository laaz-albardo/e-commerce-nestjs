import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseConfigTest } from '@src/config';
import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { isInt } from 'class-validator';
import { IUser, UserModule } from '@src/modules/user';
import { AuthModule } from '../auth.module';

describe('Start Auth Test', () => {
  let app: INestApplication;
  let connection: Connection;
  let apiClient: supertest.Agent = null;
  const testPort = isInt(Number(process.env.SERVER_TEST_PORT))
    ? process.env.SERVER_TEST_PORT
    : 8080;

  const userPath = '/user';
  const authPath = '/auth';
  let token: string;

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

  describe('Auth Use Case', () => {
    test('Login', async () => {
      const userPayload: IUser = {
        email: 'test@test.com',
        password: '1234567890',
        person: {
          fullName: 'test test',
          codePostal: '6101',
          country: 'venezuela',
        },
      };

      const userResponse = await apiClient
        .post(userPath)
        .set('Accept', 'application/json')
        .send(<IUser>userPayload);

      expect(userResponse.statusCode).toStrictEqual(201);
      expect(userResponse.body).toBeDefined();

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

    test('Auth Me', async () => {
      const authResponse = await apiClient
        .get(`${authPath}/me`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(authResponse.statusCode).toStrictEqual(200);
      expect(authResponse.body).toBeDefined();
    });

    test('Logout', async () => {
      const authResponse = await apiClient
        .post(`${authPath}/logout`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(authResponse.statusCode).toStrictEqual(202);
      expect(authResponse.body).toBeDefined();
    });
  });

  describe('Auth Use Case Error', () => {
    test('Login -> Should throw an error if the credentials are incorrect.', async () => {
      const loginPayload = {
        email: 'test@test.com',
        password: '123456789',
      };

      const authResponse = await apiClient
        .post(`${authPath}/login`)
        .set('Accept', 'application/json')
        .send(loginPayload);

      expect(authResponse.statusCode).toStrictEqual(401);

      token = null;
    });

    test('Auth Me -> Should throw an error if the token is invalid.', async () => {
      const authResponse = await apiClient
        .get(`${authPath}/me`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(authResponse.statusCode).toStrictEqual(401);
      expect(authResponse.body).toBeDefined();
    });

    test('Logout -> Should throw an error if the token is invalid.', async () => {
      const authResponse = await apiClient
        .post(`${authPath}/logout`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(authResponse.statusCode).toStrictEqual(401);
      expect(authResponse.body).toBeDefined();
    });
  });
});
