import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  login() {
    return {
      message: 'I am login method',
    };
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await argon.hash(dto.password),
        },
        select: {
          id: true,
          email: true,
          created_at: true
        }
      })
      return user;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException("Credentials taken")
          }
        }
    }
  }
}
