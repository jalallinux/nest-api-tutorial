import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

  async me(user: User) {
    delete user.password
    return user
  }
}
