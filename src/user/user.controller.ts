import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decrator';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

  @Get('me')
  me(@GetUser() user: User) {
    return this.userService.me(user);
  }
}
