// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { ArgumentsHost, Catch, HttpException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { Observable, throwError } from 'rxjs';
import { handleClientKnownRequestError, handleClientUnknownRequestError } from './prisma.filter';

@Catch(Error)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: Error, host: ArgumentsHost): Observable<any> {

    if (exception instanceof PrismaClientKnownRequestError) {
      const error = handleClientKnownRequestError(exception);
      return throwError(() => new RpcException(error));
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      const message = handleClientUnknownRequestError(exception);
      return throwError(() => new RpcException(message));
    }

    if (exception instanceof RpcException) {
      return throwError(() => new RpcException(exception.message));
    }

    if (exception instanceof HttpException) {
      return throwError(() => new HttpException(exception.message, exception.getStatus()));
    }

    return throwError(() => new RpcException('Internal server error'));
  }
}
