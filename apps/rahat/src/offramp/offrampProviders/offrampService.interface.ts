// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export interface OfframpService<TCreate, TExecute, TCheck> {
    createOfframpRequest(providerUuid: string, data: TCreate): Promise<any>;
    executeOfframpRequest(providerUuid: string, data: TExecute): Promise<any>;
    checkOfframpStatus(providerUuid: string, data: TCheck): Promise<any>;
}
