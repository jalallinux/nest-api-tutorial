import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new ForbiddenException("Credentials incorrect")
    }

    return this.responseWithToken(user)
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          firstname: dto.firstname,
          lastname: dto.lastname,
          email: dto.email,
          password: await argon.hash(dto.password),
        }
      })
      
      return this.responseWithToken(user)
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException("Credentials taken")
          }
        }
        throw error
    }
  }

  async me(user: User) {
    delete user.password
    return user
  }

  private responseWithToken(user: User): object {
    const token = this.jwt.sign(
      {sub: user.id, email: user.email},
      {expiresIn: `${this.config.get('JWT_TTL')}m`, secret: this.config.get('JWT_SECRET')}
    )

    delete user.password
    return {
      data: {
        ...user, access_token: token
      }
    }
  }
}
