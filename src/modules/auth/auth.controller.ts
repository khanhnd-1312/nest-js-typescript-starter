import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    schema: {
      example: {
        user: {
          email: 'user@example.com',
          username: 'string',
          token: 'string',
          bio: 'string',
          image: 'string',
        },
      },
    },
  })
  @Post()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOkResponse({
    schema: {
      example: {
        user: {
          email: 'user@example.com',
          username: 'string',
          token: 'string',
          bio: 'string',
          image: 'string',
        },
      },
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK) // Default is 201 for POST, but we want 200 for login
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
