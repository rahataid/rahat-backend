// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { InjectQueue } from "@nestjs/bull";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { BQUEUE, ProjectContants } from "@rahataid/sdk";
import { PrismaService } from "@rumsan/prisma";
import { JobStatus, Queue } from "bull";
import { UUID } from "crypto";

interface JobFilterOptions {
  status?: JobStatus[];
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class QueueService {
  private rsprisma;
  constructor(
    protected prisma: PrismaService,
    @Inject(ProjectContants.ELClient) private readonly client: ClientProxy,
    @InjectQueue('CONTRACT') private readonly contractQueue: Queue,
    @InjectQueue(BQUEUE.RAHAT) private readonly rahatQueue: Queue,
    @InjectQueue(BQUEUE.RAHAT_BENEFICIARY) private readonly rahatBeneficiaryQueue: Queue,
    @InjectQueue(BQUEUE.META_TXN) private readonly metaTransactionQueue: Queue
  ) {
    this.rsprisma = prisma.rsclient;
  }

  async getJobs(queue: Queue, filters: JobFilterOptions = {}) {
    const { status, name, startDate, endDate } = filters;
    const jobs = await queue.getJobs(status ? status : ['failed', 'waiting', 'active', 'completed', 'delayed']);

    // Apply additional filters on the jobs
    const filteredJobs = jobs
      .filter(job =>
        (!name || job.name === name) &&
        (!startDate || job.timestamp >= startDate.getTime()) &&
        (!endDate || job.timestamp <= endDate.getTime())
      );

    return Promise.all(filteredJobs.map(async job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      progress: job.progress,
      returnvalue: job.returnvalue,
      status: await job.getState()
    })));
  }

  async retryJob(queue: Queue, jobId: string | number | UUID) {
    const job = await queue.getJob(jobId);
    console.log('job', job)
    if (job && job.failedReason) {
      await job.retry();
      return { message: `Job ${jobId} retried successfully.` };
    } else {
      return { message: `Job ${jobId} not found or not in failed state.` };
    }
  }

  // Specific methods for each queue
  async getPendingContractJobs(filters: JobFilterOptions) {
    return this.getJobs(this.contractQueue, filters);
  }

  async retryContractJob(jobId: string | number | UUID) {
    return this.retryJob(this.contractQueue, jobId);
  }

  async getPendingRahatJobs(filters: JobFilterOptions) {
    return this.getJobs(this.rahatQueue, filters);
  }

  async retryRahatJob(jobId: string | number | UUID) {
    return this.retryJob(this.rahatQueue, jobId);
  }

  async getPendingRahatBeneficiaryJobs(filters: JobFilterOptions) {
    return this.getJobs(this.rahatBeneficiaryQueue, filters);
  }

  async retryRahatBeneficiaryJob(jobId: string | number | UUID) {
    return this.retryJob(this.rahatBeneficiaryQueue, jobId);
  }

  async getPendingMetaTxnJobs(filters: JobFilterOptions) {
    return this.getJobs(this.metaTransactionQueue, filters);
  }

  async retryMetaTxnJob(jobId: string | number | UUID) {
    return this.retryJob(this.metaTransactionQueue, jobId);
  }
}
