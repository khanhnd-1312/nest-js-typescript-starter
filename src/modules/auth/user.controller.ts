import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { type AuthenticatedUser } from './types';

@ApiTags('User')
@ApiSecurity('Authorization')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  @ApiOkResponse({
    schema: {
      example: {
        user: {
          email: 'test@example.com',
          username: 'test',
          bio: 'test bio',
          image: 'https://example.com/images/test.jpg',
        },
      },
    },
  })
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
