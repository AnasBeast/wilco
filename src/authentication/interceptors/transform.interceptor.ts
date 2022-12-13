import { ResponseMessageKey } from './../../common/decorators/response/response.decorator';
import { Pagination, PaginationKey } from './../../common/decorators/response/pagination.decorator';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { database } from 'firebase-admin';

export interface Response<T> {
  response: T;
}

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const responseMessage = this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ?? '';
    const pagination = this.reflector.get<boolean>(PaginationKey, context.getHandler());
    if (pagination) {
      return next.handle().pipe(
        map(({data, pagination}) => ({
          response: data,
          pagination,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: responseMessage,
        }), ),
      );
    } else {
      return next.handle().pipe(
        map((value) => ({
          response: value,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: responseMessage,
        })),
      );
    }
    
  }
}
