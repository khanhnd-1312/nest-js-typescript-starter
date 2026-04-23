import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async findByEmailOrNull(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.USER_NOT_FOUND'));
    }
    return user;
  }

  async findByIdOrNull(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    const count = await this.usersRepository.countBy({ email });
    return count > 0;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Check if email already exists
    if (data.email && data.email !== user.email) {
      const existing = await this.checkUserExistsByEmail(data.email);
      if (existing) {
        throw new ConflictException(
          this.i18n.translate('auth.EMAIL_ALREADY_EXISTS'),
        );
      }
    }

    // If password is being updated, hash it before saving
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Remove only undefined fields so explicit null values can clear nullable columns
    Object.keys(data).forEach((key: keyof UpdateUserDto) => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    // Assign the new data to the user entity
    Object.assign(user, data);

    return this.usersRepository.save(user);
  }
}
