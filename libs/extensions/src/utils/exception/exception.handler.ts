import { HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ExceptionResponse } from '@rumsan/sdk/types';

export class ExceptionHandler {
  static logger = new Logger(ExceptionHandler?.name);
  private static isObjectWithErrors(value: string | object): value is { errors: any[] } {
    return typeof value === 'object' && value !== null && 'errors' in value;
  }

  static handleHttpException(
    exception: HttpException,
    responseData: ExceptionResponse,
    response: any
  ): ExceptionResponse {
    console.log(
      exception.getResponse()
    )
    const exceptionResponse = exception?.getResponse();
    if (exceptionResponse !== null) {
      responseData.meta = exceptionResponse;
    } else {
      responseData.meta = response?.errors ?? '';
    }

    responseData.name = exception?.name;
    responseData.statusCode = exception?.getStatus();
    responseData.message = exception?.message;
    responseData.group = 'HTTP';
    console.log(responseData.message)
    this.logger.error(responseData?.message);

    return responseData;
  }

  static handleRpcException(
    exception: RpcException,
    responseData: ExceptionResponse
  ) {
    responseData.name = exception?.name;
    responseData.message = exception?.message;
    responseData.group = 'RPC';

    this.logger.error(responseData?.message);

    return responseData;
  }

  static handleMicroserviceError(
    exception: any,
    responseData: ExceptionResponse
  ) {
    responseData.name = 'Microservice';
    responseData.message = exception.message;
    responseData.group = 'Microservice';
    responseData.statusCode = 400;
  }

  static handleGenericError(
    exception: Error,
    responseData: ExceptionResponse
  ): ExceptionResponse {
    console.log({ stack: exception?.stack }, exception.message)
    responseData.name = exception?.name;
    responseData.message = exception?.message;
    responseData.group = 'General Error';
    responseData.meta = exception?.stack;

    this.logger.error(responseData?.message);

    return responseData;
  }
}
