import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { I18nService } from 'nestjs-i18n';

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
}
