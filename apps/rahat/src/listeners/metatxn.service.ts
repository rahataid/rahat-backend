// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { METATXN } from "../processors/meta-transaction/metaTransaction.events";

@Injectable()
export class MetaTxnService {
    @OnEvent(METATXN.EL)
    async forwardToEl(data: any) {
        // Forward the flow to EL project
    }
}