import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { UserRepository } from '../repositories';
import { IUser } from '../interfaces';
import { UserRoleEnum } from '../enums';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private readonly repository: UserRepository) {}

  async seed(): Promise<void> {
    const user: IUser | IUser[] = [
      {
        email: 'ecommerce@superadmin.com',
        password: '12345678Super',
        role: UserRoleEnum.SUPER_ADMIN,
        person: {
          fullName: 'ecommerce',
          codePostal: '8714',
          country: 'Ve',
        },
      },
      {
        email: 'ecommerce@admin.com',
        password: '12345678Admin',
        role: UserRoleEnum.ADMIN,
        person: {
          fullName: 'ecommerce',
          codePostal: '33101',
          country: 'USA',
        },
      },
    ];

    await this.repository.saveMany(user);
  }

  async drop(): Promise<void> {
    await this.repository.deleteMany();
  }
}
