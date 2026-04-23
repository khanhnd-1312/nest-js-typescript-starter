import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types';
import { UserResponseDto } from './dto/user-response.dto';

describe('UserController', () => {
  let controller: UserController;

  const authenticatedUser: AuthenticatedUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'tester',
    bio: null,
    image: null,
  };

  const dbUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'tester',
    bio: null,
    image: null,
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const usersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UsersService, useValue: usersService },
        JwtAuthGuard,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  it('me queries DB and returns user in RealWorld format', async () => {
    usersService.findById.mockResolvedValue(dbUser);

    const result = await controller.getCurrentUser(authenticatedUser);

    expect(usersService.findById).toHaveBeenCalledWith(authenticatedUser.id);
    expect(result).toEqual(UserResponseDto.build(dbUser));
  });
});
