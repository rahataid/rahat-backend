// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Project } from '@prisma/client';
import { BQUEUE, ProjectJobs } from '@rahataid/sdk';
import { SettingsService } from '@rumsan/extensions/settings';
import { Job } from 'bull';

@Processor(BQUEUE.RAHAT_PROJECT)
export class ProjectProcessor {
  private readonly logger = new Logger(ProjectProcessor.name);

  constructor(
    @Inject('DEPLOYMENT_CLIENT') private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) { }

  @Process(ProjectJobs.PROJECT_CREATE)
  async processProjectCreation(job: Job<Project>) {
    try {
      this.logger.log(
        '######## SENDING PROJECT CREATION TASK TO THE WORKER ###########'
      );
      const workerPayload = {
        projectId: job?.data?.uuid,
        type: job?.data?.type,
      };
      return this.client.emit({ cmd: 'project.create' }, workerPayload);
      // remaining setup scripts
    } catch (err) {
      this.logger.error(err);
      // emit ws message to connected client
    }
  }

  private getProjectVariables() {
    return {
      PRIVATE_KEY: SettingsService.get('EL.PRIVATE_KEY'),
      REDIS_HOST: SettingsService.get('EL.REDIS_HOST'),
      REDIS_PORT: SettingsService.get('EL.REDIS_PORT'),
      REDIS_PASSWORD: SettingsService.get('EL.REDIS_PASSWORD'),
      DB_HOST: SettingsService.get('EL.DB_HOST'),
      DB_PORT: SettingsService.get('EL.DB_PORT'),
      DB_USERNAME: SettingsService.get('EL.DB_USERNAME'),
      DB_PASSWORD: SettingsService.get('EL.DB_PASSWORD'),
      DEPLOYER_PRIVATE_KEY: SettingsService.get('EL.DEPLOYER_PRIVATE_KEY'),
      ADMIN_PRIVATE_KEY: SettingsService.get('EL.ADMIN_PRIVATE_KEY'),
      VENDOR_PRIVATE_KEY: SettingsService.get('EL.VENDOR_PRIVATE_KEY'),
      RAHAT_ADMIN_PRIVATE_KEY: SettingsService.get(
        'EL.RAHAT_ADMIN_PRIVATE_KEY'
      ),
      VENDOR_WALLET: SettingsService.get('EL.VENDOR_WALLET'),
      ENROLLED_BENEFICIARY: SettingsService.get('EL.ENROLLED_BENEFICIARY'),
      NETWORK_PROVIDER: SettingsService.get('EL.NETWORK_PROVIDER'),
      NETWORK_ID: SettingsService.get('EL.NETWORK_ID'),
      CHAIN_NAME: SettingsService.get('EL.CHAIN_NAME'),
      CHAIN_ID: SettingsService.get('EL.CHAIN_ID'),
      CURRENCY_NAME: SettingsService.get('EL.CURRENCY_NAME'),
      CURRENCY_SYMBOL: SettingsService.get('EL.CURRENCY_SYMBOL'),
      DOCKER_IMAGE: SettingsService.get('EL.DOCKER_IMAGE'),
    };
  }
}
