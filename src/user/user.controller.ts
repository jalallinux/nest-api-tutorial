import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decrator';
import { JwtGuard } from '../auth/guards';
import { UserUpdateDto, UserUpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('me')
  me(@GetUser() user: User) {
    return this.userService.me(user);
  }

  @Patch('update')
  update(@Body() dto: UserUpdateDto, @GetUser('id') userId: number) {
    return this.userService.update(userId, dto);
  }

  @Patch('update-password')
  updatePassword(@Body() dto: UserUpdatePasswordDto, @GetUser() user: User) {
    return this.userService.updatePassword(user, dto);
  }
}
