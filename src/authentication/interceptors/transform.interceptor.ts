import { ResponseMessageKey } from './../../common/decorators/response/response.decorator';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

export interface Response<T> {
  response: T;
}

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const responseMessage = this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ?? '';
    return next.handle().pipe(
      map((data) => ({
        response: data,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: responseMessage,
      })),
    );
  }
}
