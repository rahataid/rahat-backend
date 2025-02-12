import { lastValueFrom, Observable } from 'rxjs';

interface MicroserviceOptions<TRequest, TResponse> {
  client: Observable<TResponse>;
  onSuccess?: (response: TResponse) => Promise<void> | void | any;
  onError?: (error: any) => Promise<void> | void | any;
}

export async function handleMicroserviceCall<TRequest, TResponse>(
  options: MicroserviceOptions<TRequest, TResponse>
): Promise<TResponse> {
  const { client, onSuccess, onError } = options;

  try {
    // Convert Observable to Promise and wait for the response
    const response = await lastValueFrom(client);

    // If onSuccess callback is provided, call it with the response
    if (onSuccess) {
      await onSuccess(response);
    }

    return response;
  } catch (error) {
    // If onError callback is provided, call it with the error
    if (onError) {
      await onError(error);
    } else {
      // Rethrow the error if no onError callback is provided
      throw error;
    }
  }
}
