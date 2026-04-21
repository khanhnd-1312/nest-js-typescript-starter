import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../types';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

export const currentUserFactory = (
  prop: keyof AuthenticatedUser | undefined,
  context: ExecutionContext,
) => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  if (prop) {
    return request.user[prop];
  }

  return request.user;
};

export const CurrentUser = createParamDecorator(currentUserFactory);
