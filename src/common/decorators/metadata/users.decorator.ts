import { UserEntity } from '../../entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator((data: keyof UserEntity, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest<Request>().user as UserEntity;

  return data ? user && user[data] : user;
});
