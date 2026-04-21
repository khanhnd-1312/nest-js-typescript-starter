import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './types';

describe('UserController', () => {
  let controller: UserController;

  const authenticatedUser: AuthenticatedUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'tester',
    bio: null,
    image: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [JwtAuthGuard],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('me returns the current user in RealWorld format', () => {
    const result = controller.me(authenticatedUser);

    expect(result).toEqual({
      user: {
        email: authenticatedUser.email,
        username: authenticatedUser.username,
        bio: authenticatedUser.bio,
        image: authenticatedUser.image,
      },
    });
  });
});
