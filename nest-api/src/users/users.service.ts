import { Injectable } from '@nestjs/common';
import { Role } from 'src/roles/role.enum';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'sampap',
      password: 'changeme',
      roles: [Role.Viewer],
    },
    {
      userId: 2,
      username: 'papsam',
      password: 'guess',
      roles: [Role.Admin, Role.Viewer],
    },
    {
      userId: 3,
      username: 'superuser',
      password: 'superpass',
      roles: [Role.Admin, Role.Viewer, Role.Editor],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username == username);
  }
}
