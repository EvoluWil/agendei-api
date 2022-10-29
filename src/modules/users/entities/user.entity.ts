import { enumUserRoles, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  email: string;
  name: string;
  password: string;
  picture: string;
  role: enumUserRoles;
  createdAt: Date;
  updatedAt: Date;
}
