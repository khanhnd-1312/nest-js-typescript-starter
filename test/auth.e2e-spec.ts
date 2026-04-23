import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App as SupertestApp } from 'supertest/types';
import { AuthController } from '../src/modules/auth/auth.controller';
import { UserController } from '../src/modules/users/user.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/users.service';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let isAuthorized: boolean;

  const authenticatedUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'tester',
    bio: null,
    image: null,
  };

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const usersService = {
    findById: jest.fn(),
  };

  const jwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      if (!isAuthorized) {
        throw new UnauthorizedException();
      }

      const req = context.switchToHttp().getRequest<{
        user?: typeof authenticatedUser;
      }>();
      req.user = authenticatedUser;

      return true;
    }),
  };

  beforeEach(async () => {
    isAuthorized = true;
    usersService.findById.mockResolvedValue(authenticatedUser);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, UserController],
      providers: [
        JwtAuthGuard,
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/users returns the register response', () => {
    const registerResponse = {
      user: {
        email: authenticatedUser.email,
        username: authenticatedUser.username,
        token: 'signed-jwt',
        bio: null,
        image: null,
      },
    };
    authService.register.mockResolvedValue(registerResponse);

    return request(app.getHttpServer() as SupertestApp)
      .post('/api/users')
      .send({
        email: authenticatedUser.email,
        password: 'plain-password',
        username: authenticatedUser.username,
      })
      .expect(201)
      .expect(registerResponse);
  });

  it('POST /api/users/login returns the login response', () => {
    const loginResponse = {
      user: {
        email: authenticatedUser.email,
        username: authenticatedUser.username,
        token: 'signed-jwt',
        bio: null,
        image: null,
      },
    };
    authService.login.mockResolvedValue(loginResponse);

    return request(app.getHttpServer() as SupertestApp)
      .post('/api/users/login')
      .send({
        email: authenticatedUser.email,
        password: 'plain-password',
      })
      .expect(200)
      .expect(loginResponse);
  });

  it('GET /api/user returns 401 when the guard rejects the request', () => {
    isAuthorized = false;

    return request(app.getHttpServer() as SupertestApp)
      .get('/api/user')
      .expect(401)
      .expect((res: request.Response) => {
        const body = res.body as { statusCode: number; message: string };
        expect(body.statusCode).toBe(401);
        expect(body.message).toBeDefined();
      });
  });

  it('GET /api/user returns the current authenticated user', () => {
    return request(app.getHttpServer() as SupertestApp)
      .get('/api/user')
      .set('Authorization', 'Token signed-jwt')
      .expect(200)
      .expect((res: request.Response) => {
        const body = res.body as {
          user: typeof authenticatedUser & { token?: string | null };
        };
        expect(body.user).toMatchObject({
          email: authenticatedUser.email,
          username: authenticatedUser.username,
          bio: null,
          image: null,
        });
        expect(body.user.token).toBeUndefined();
      });
  });
});
