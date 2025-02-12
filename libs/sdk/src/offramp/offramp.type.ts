export type OfframpProvider<T> = {

  name: string;
  config: T;
  description?: string;
  extras?: any;

}

export type OfframpRequest = {
  providerUuid: string;
  chain: string;
  token: string;
  amount: number;
  senderAddress: string;
}

export type KotaniPayExecutionData = {
  mobileMoneyReceiver: {
    networkProvider: string;
    phoneNumber: string;
    accountName: string;
  };
  currency: string;
  chain: string;
  token: string;
  cryptoAmount: number;
  senderAddress: string;
};

export type ExecuteOfframpRequest = {
  providerUuid: string;
  requestUuid: string;
  data: KotaniPayExecutionData;
}
