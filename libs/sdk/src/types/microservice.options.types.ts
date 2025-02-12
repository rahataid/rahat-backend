import { Observable } from 'rxjs';

export interface MicroserviceOptions<TRequest, TResponse> {
  client: Observable<TResponse>;
  onSuccess?: (respose: TResponse) => Promise<void> | void;
  onError?: (error: any) => Promise<void> | void;
}
