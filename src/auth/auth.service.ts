import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async login(dto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new ForbiddenException("Credentials incorrect")
    }

    delete user.password
    return user
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await argon.hash(dto.password),
        }
      })
      
      delete user.password
      return user;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException("Credentials taken")
          }
        }
        throw error
    }
  }
}
