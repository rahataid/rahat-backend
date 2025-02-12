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