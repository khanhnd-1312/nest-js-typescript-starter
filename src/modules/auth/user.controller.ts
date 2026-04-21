import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { type AuthenticatedUser } from './types';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get()
  me(@CurrentUser() user: AuthenticatedUser) {
    return {
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    };
  }
}
