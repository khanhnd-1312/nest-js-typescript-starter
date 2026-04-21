import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('register delegates to AuthService.register', async () => {
    const dto = {
      email: 'user@example.com',
      password: 'plain-password',
      username: 'tester',
    };
    const registeredUser = {
      id: 'user-1',
      email: dto.email,
      username: dto.username,
    };
    authService.register.mockResolvedValue(registeredUser);

    await expect(controller.register(dto)).resolves.toEqual(registeredUser);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('login delegates to AuthService.login', async () => {
    const dto = {
      email: 'user@example.com',
      password: 'plain-password',
    };
    const loginResult = {
      user: {
        email: dto.email,
        username: 'tester',
        token: 'signed-jwt',
      },
    };
    authService.login.mockResolvedValue(loginResult);

    await expect(controller.login(dto)).resolves.toEqual(loginResult);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
