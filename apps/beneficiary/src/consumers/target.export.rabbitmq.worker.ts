import { Inject } from '@nestjs/common';
import { RABBIT_MQ } from '@rahataid/sdk';
import { PrismaService } from '@rumsan/prisma';
import {
  BaseWorker,
  getQueueByName,
  PRISMA_SERVICE,
  QueueUtilsService,
  RabbitMQModuleOptions,
} from '@rumsan/rabbitmq';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
const API_URL = 'API_URL';

export class ExportTargerBeneficiary extends BaseWorker<any> {
  private channelWrapper: ChannelWrapper;
  constructor(
    @Inject(RABBIT_MQ.AMQP_CONNECTION)
    private readonly connection: AmqpConnectionManager,
    queueUtilsService: QueueUtilsService,
    @Inject(PRISMA_SERVICE) private readonly prisma: PrismaService,
    @Inject('QUEUE_NAMES')
    private readonly queuesToSetup: RabbitMQModuleOptions['queues'],
    @Inject(API_URL) private readonly apiUrl: string,
  ) {
    const queue = getQueueByName(queuesToSetup, RABBIT_MQ.CT_BENEFICIARY_EXPORT);
    super(
      queueUtilsService,
      RABBIT_MQ.CT_BENEFICIARY_EXPORT,
      10,
      'batch',
      connection,
      queue.options.arguments,
    );
  }

  async onModuleInit() {
    try {
      this.channelWrapper = this.connection.createChannel({
        json: true,
        confirm: true,
        setup: async (channel) => {
          await this.initializeWorker(channel);
          // console.log('this.data', this.dataProvider);
          console.log('this.apiUrl', this.apiUrl);
        },
      });
    } catch (err) {
      this.logger.error('Error initializing Beneficiary Worker:', err);
    }
  }

  protected async processItem(batch): Promise<void> {
    const [batchData] = batch;

    this.logger.log(`Processing batch: ${batch} }`);

    try {
      const { groupName, beneficiaries } = batchData.data;
      const beneficiaryData = beneficiaries.map((d: any) => {
        return {
          firstName: d.firstName,
          lastName: d.lastName,
          walletAddress: d.walletAddress,
          govtIDNumber: d.govtIDNumber,
          gender: d.gender,
          bankedStatus: d.bankedStatus,
          phoneStatus: d.phoneStatus,
          internetStatus: d.internetStatus,
          email: d.email || null,
          phone: d.phone || null,
          birthDate: d.birthDate || null,
          location: d.location || null,
          latitude: d.latitude || null,
          longitude: d.longitude || null,
          notes: d.notes || null,
          extras: d.extras || null,
        };
      });
      const tempBenefPhone = await this.listTempBenefPhone()
      await this.prisma.$transaction(async (txn) => {
        // 1. Upsert temp group by name
        const group = await txn.tempGroup.upsert({
          where: { name: groupName },
          update: { name: groupName },
          create: { name: groupName },
        });
        return this.saveTempBenefAndGroup(
          txn,
          group.uuid,
          beneficiaryData,
          tempBenefPhone
        );
      });

    } catch (error) {
      this.logger.error('Error processing batch:', error);
      throw error; // Requeue if necessary
    }
  }
  async listTempBenefPhone() {
    return this.prisma.tempBeneficiary.findMany({
      select: {
        phone: true,
        uuid: true,
      },
    });
  }
  async saveTempBenefAndGroup(
    txn: any,
    groupUID: string,
    beneficiaries: any[],
    tempBenefPhone: any[]
  ) {
    for (let b of beneficiaries) {
      const row = await txn.tempBeneficiary.create({
        data: b,
      });
      const benefUID = row.uuid;
      // 3. Upsert temp benef group
      await txn.tempBeneficiaryGroup.upsert({
        where: {
          tempBeneficiaryGroupIdentifier: {
            tempGroupUID: groupUID,
            tempBenefUID: benefUID,
          },
        },
        update: {
          tempGroupUID: groupUID,
          tempBenefUID: benefUID,
        },
        create: {
          tempGroupUID: groupUID,
          tempBenefUID: benefUID,
        },
      });
    }
    this.logger.log(
      'Batch successfully processed and saved to the database.',
    );

    return 'Beneficiary imported to temp storage!';
  }

}


