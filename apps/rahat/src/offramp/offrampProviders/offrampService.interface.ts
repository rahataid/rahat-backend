export interface OfframpService<TCreate, TExecute, TCheck> {
    createOfframpRequest(providerUuid: string, data: TCreate): Promise<any>;
    executeOfframpRequest(providerUuid: string, data: TExecute): Promise<any>;
    checkOfframpStatus(providerUuid: string, data: TCheck): Promise<any>;
}
