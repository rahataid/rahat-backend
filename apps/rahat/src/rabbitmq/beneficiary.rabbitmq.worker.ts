import { Global, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AmqpConnectionManager, ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from 'amqplib';
import { QueueUtilsService } from "./queue-utils.service";
import { BaseWorker } from "./worker.base";


@Global()
@Injectable()
export class BeneficiaryWorker extends BaseWorker<any> implements OnModuleInit {
  constructor(
    @Inject('AMQP_CONNECTION') private readonly connection: AmqpConnectionManager,
    queueUtilsService: QueueUtilsService
  ) {
    super(queueUtilsService, 'beneficiary-queue',); // Queue name and default batch size
  }

  private channelWrapper: ChannelWrapper;

  async onModuleInit() {
    try {
      this.channelWrapper = this.connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
          await this.initializeWorker(channel);
        },
      });

      this.channelWrapper.on('close', () => {
        this.logger.error('AMQP channel closed');
      });

      this.channelWrapper.on('error', (err) => {
        this.logger.error('AMQP channel error:', err);
      });

      this.logger.log('Beneficiary Worker initialized.');
    } catch (err) {
      this.logger.error('Error initializing Beneficiary Worker:', err);
    }
  }

  protected async processItem(item: any): Promise<void> {
    this.logger.log(`Processing beneficiary: ${JSON.stringify(item)}`);

    // Add business login here
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate async processing
    this.logger.log(`Beneficiary processed: ${JSON.stringify(item)}`);
  }


}

