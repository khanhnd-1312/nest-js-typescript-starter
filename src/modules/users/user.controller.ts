import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/types';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@ApiSecurity('Authorization')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    const dbUser = await this.usersService.findById(user.id);
    return UserResponseDto.build(dbUser);
  }

  @Put()
  async updateUser(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(user.id, dto);
    return UserResponseDto.build(updatedUser);
  }
}
