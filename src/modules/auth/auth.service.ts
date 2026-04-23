import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existing = await this.usersService.checkUserExistsByEmail(dto.email);
    if (existing) {
      throw new ConflictException(
        this.i18n.translate('auth.EMAIL_ALREADY_EXISTS'),
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create the user
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      username: dto.username,
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return UserResponseDto.build(user, token);
  }

  async login(dto: LoginDto) {
    // Find the user by email
    const user = await this.usersService.findByEmailOrNull(dto.email);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.INVALID_CREDENTIALS'),
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.INVALID_CREDENTIALS'),
      );
    }

    // Create JWT payload and sign token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return UserResponseDto.build(user, token);
  }
}
