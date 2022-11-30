import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return {
      message: 'I am login method',
    };
  }

  register() {
    return {
      message: 'I am register method',
    };
  }
}
