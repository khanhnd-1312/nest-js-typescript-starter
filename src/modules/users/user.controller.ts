import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/types';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('User')
@ApiSecurity('Authorization')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResponseDto })
  @Get()
  async me(@CurrentUser() user: AuthenticatedUser) {
    const dbUser = await this.usersService.findById(user.id);
    return UserResponseDto.build(dbUser);
  }
}
