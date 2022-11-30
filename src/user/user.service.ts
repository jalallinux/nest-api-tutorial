import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserUpdateDto, UserUpdatePasswordDto } from './dto';
import * as argon from "argon2";

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async me(user: User) {
    delete user.password
    return user
  }

  async update(userId: number, dto: UserUpdateDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto, updated_at: new Date() }
    })

    delete user.password
    return user
  }

  async updatePassword(user: User, dto: UserUpdatePasswordDto) {

    if (!(await argon.verify(user.password, dto.current_password))) {
      throw new ForbiddenException("Current password is incorrect")
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await argon.hash(dto.password),
        updated_at: new Date()
      }
    })

    delete updatedUser.password
    return updatedUser
  }
}
