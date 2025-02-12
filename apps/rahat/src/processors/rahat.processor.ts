import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { APP_JOBS, BQUEUE } from '@rahataid/sdk';
import { Job } from 'bull';

@Processor(BQUEUE.RAHAT)
export class RahatProcessor {
  private readonly logger = new Logger(RahatProcessor.name);

  @Process(APP_JOBS.EMAIL)
  async sendEmail(job: Job<any>) {
    console.log('Email sent');
    // this.emailService.sendEmail(
    //   job.data.address,
    //   'OTP for login',
    //   'OTP for login',
    //   `<h1>OTP for login</h1><p>${job.data.otp}</p>`
    // );
  }

}
