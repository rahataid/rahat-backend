import { Process, Processor } from "@nestjs/bull";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { BQUEUE, MS_TIMEOUT, ProjectContants } from "@rahataid/sdk";
import { JOBS } from "@rahataid/sdk/project/project.events";
import { timeout } from "rxjs";
import { ERC2771FORWARDER } from "../../utils/contracts";
import { createContractSigner } from "../../utils/web3";

@Processor(BQUEUE.META_TXN)
export class MetaTransationProcessor {
    private readonly logger = new Logger(MetaTransationProcessor.name);
    constructor(
        @Inject(ProjectContants.ELClient) private readonly client: ClientProxy) { }

    @Process(JOBS.META_TRANSACTION.ADD_QUEUE)
    async processMetaTxn(job: any) {
        this.logger.log(`Added job ${job.id} to queue`)
        await sleep(3000);
        const { params, trigger } = job.data;

        const { metaTxRequest } = params;

        const forwarderContract = await createContractSigner(
            ERC2771FORWARDER,
            process.env.ERC2771_FORWARDER_ADDRESS
        );

        metaTxRequest.gas = BigInt(metaTxRequest.gas);
        metaTxRequest.nonce = BigInt(metaTxRequest.nonce);
        metaTxRequest.value = BigInt(metaTxRequest.value);

        const tx = await forwarderContract.execute(metaTxRequest);
        const res = await tx.wait();

        let triggerData = {
            payload: trigger?.payload
        }
        if (trigger?.spreadPayload) triggerData = { ...trigger?.payload }

        try {
            if (trigger) {
                await this.client.send({ cmd: trigger.event_name, uuid: trigger.projectUuid }, triggerData)
                    .pipe(timeout(MS_TIMEOUT)).toPromise();

            }
        } catch (error) {
            console.log(error)
        }


        this.logger.warn(`Processed job ${job.id}`)
        return res;

    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));