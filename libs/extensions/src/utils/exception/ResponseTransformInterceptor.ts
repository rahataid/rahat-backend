import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from '@rumsan/sdk/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    if (request.query.raw) return next.handle();

    return next.handle().pipe(
      map((retData) => {
        const resData: Response<T> = {
          success: true,
          data: null,
        };

        // 1) If `retData` is null/undefined, default to { data: null }
        if (retData === null || retData === undefined) {
          retData = { data: null };
        }

        // 2) If `retData` is a primitive/string/array => just store in `resData.data`
        if (
          typeof retData === 'string' ||
          typeof retData === 'number' ||
          typeof retData === 'boolean' ||
          Array.isArray(retData)
        ) {
          resData.data = retData as T;
        } else {
          // 3) Otherwise, assume `retData` is an object
          //    Safely destructure meta/data/code, fallback to empty object if it's not truly an object
          const { meta, data, code, ...rest } = retData || {};

          // 4) If `data` is undefined or null, we check `rest`
          if (data === undefined || data === null) {
            resData.data =
              Object.keys(rest).length === 0 ? null : (rest as T);
          } else {
            // We do have a `data` property
            resData.data = data;
          }

          // 5) Assign optional properties if they exist
          resData.meta = meta;
          resData.code = code;
        }

        return resData;
      }),
    );
  }
}
