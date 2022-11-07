import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }

    return result;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      console.log({ info });

      throw err || new UnauthorizedException();
    }
    return user;
  }
}
