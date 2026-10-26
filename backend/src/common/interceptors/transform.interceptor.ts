import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        if (res === undefined || res === null) {
          return { success: true, data: null };
        }
        if (Buffer.isBuffer(res) || res instanceof Uint8Array) {
          return res as any;
        }
        // If response is already formatted with data and meta
        if (typeof res === 'object' && 'data' in res && 'meta' in res) {
          return {
            success: true,
            data: res.data,
            meta: res.meta,
          };
        }
        return {
          success: true,
          data: res,
        };
      }),
    );
  }
}
