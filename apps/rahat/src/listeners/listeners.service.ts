// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { BQUEUE, ProjectEvents, ProjectJobs } from '@rahataid/sdk';
import { Project } from '@rahataid/sdk/project/project.types';
import { PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/user';
import { Queue } from 'bull';
import { DevService } from '../utils/develop.service';
import { EmailService } from './email.service';
import { MessageSenderService } from './messageSender.service';
@Injectable()
export class ListenersService {
  private otp: string;
  private dev: DevService;
  constructor(
    @InjectQueue(BQUEUE.RAHAT) private readonly rahatQueue: Queue,
    @InjectQueue(BQUEUE.HOST) private readonly hostQueue: Queue,
    @InjectQueue(BQUEUE.RAHAT_PROJECT) private readonly projectQueue: Queue,
    private readonly configService: ConfigService,
    protected prisma: PrismaService,

    private readonly devService: DevService,
    private emailService: EmailService,
    private messageSenderService: MessageSenderService,

  ) { }

  @OnEvent(EVENTS.OTP_CREATED)
  async sendOTPEmail(data: any) {
    this.otp = data.otp;
    this.emailService.sendEmail(
      data.address,
      'Login OTP',
      'Login OTP',
      `
        <div style="max-width:800px;max-height: 600px;overflow:auto;line-height:2;background: #333333;">
          <div style="margin:50px auto;width:70%;padding:40px 40px; border: 1px solid #fff; border-radius: 12px;">
            <div style="text-align: center;">
              <img src='https://assets.rumsan.net/rumsan-group/rahat-logo-white.png' width="250" title="stage4all" alt="stage4all">
            </div>
            <div style="color:#fff; text-align: center;">
              <h4 style="font-size:1.3em;">Your Rahat system login code</h4>
              <h2
                style="background: #373737;margin: 0 auto;width: 100%;padding: 0 10px;color: #fff;border-radius: 4px; letter-spacing: 10px">
                ${data.otp}</h2>
            </div>
            <div style="color: #fff; text-align: left;">
              <p>This is a one-time-code that expires in 5 minutes.</p>
              <p style="font-size:0.9em;">Please DO NOT share your code with anyone. Rahat team will never ask for it.</p>
            </div>
            <hr style=" border-top: 1px solid rgb(73, 72, 72)" />
            <div style="color:#fff!important">
              <p>If you didn't attempt to sign up but received this email, please ignore.
              </p>
              <p>
                Regards,<br />
                Team Rahat
              </p>
            </div>
          </div>
        </div>
      `
    );
  }
  @OnEvent(EVENTS.USER_CREATED)
  async sendUserCreatedEmail(data: any) {
    this.emailService.sendEmail(
      data.address,
      'Welcome to Rahat.',
      `
      Hi,
      
      We're thrilled to have you on board! You've been successfully added to Rahat dashboard.
      
      Click the link to access the Rahat dashboard: ${this.configService.get('FRONTEND_URL')}.
      
      Best regards,
      Rahat Team  
      `
    );
  }

  @OnEvent(EVENTS.CHALLENGE_CREATED)
  async sendChallengeToDev(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.devService.otp({
      otp: this.otp,
      challenge: data.challenge.challenge,
      requestInfo: data.requestInfo,
    });
  }

  @OnEvent(ProjectEvents.PROJECT_CREATED)
  async onProjectCreated(data: Project) {
    this.projectQueue.add(ProjectJobs.PROJECT_CREATE, data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
  @OnEvent(ProjectEvents.BENEFICIARY_ADDED_TO_PROJECT)
  async onProjectAddedToBen(data) {
    const CONTENT_SID = this.configService.get('REFERRED_VOUCHER_ASSIGNED_SID');
    for (const beneficiary of data.beneficiaries) {
      const payload = {
        phone: beneficiary.piiData.phone,
        type: 'WHATSAPP',
        contentSid: CONTENT_SID,
        contentVariables: {
          1: beneficiary.piiData.name,
        },
      };
      this.messageSenderService.sendWhatappMessage(payload)
    }

  }
  @OnEvent(ProjectEvents.REQUEST_REDEMPTION)
  async onRequestRedemption() {
    const admins = await this.prisma.user.findMany({
      where: {
        UserRole: {
          some: {
            Role: {
              name: 'Admin',
            },
          },
        },
      },
    });
    admins.map((admin) => {
      const CONTENT_SID = this.configService.get('REDEMPTION_REQUEST_SID');
      const payload = {
        phone: admin.phone,
        type: 'WHATSAPP',
        contentSid: CONTENT_SID,

      };
      this.messageSenderService.sendWhatappMessage(payload)

    })

  }


  @OnEvent(ProjectEvents.UPDATE_REDEMPTION)
  async onUpdateRedemption(data) {
    const CONTENT_SID = this.configService.get('REDEMPTION_APPROVED_SUCESS_SID');
    const vendors = await this.prisma.user.findMany({
      where: {
        uuid: {
          in: data
        }
      }
    })
    vendors.map((vendor) => {
      const payload = {
        phone: vendor.phone,
        type: 'WHATSAPP',
        contentSid: CONTENT_SID,
      };
      this.messageSenderService.sendWhatappMessage(payload)
    })
  }

  @OnEvent(ProjectEvents.REDEEM_VOUCHER)
  async onRedeemVoucher(data) {
    const ben = await this.prisma.beneficiary.findUnique({
      where: {
        uuid: data
      }

    });

    const benPii = await this.prisma.beneficiaryPii.findUnique({
      where: {
        beneficiaryId: ben.id
      }
    })

    const CONTENT_SID = this.configService.get('VOUCHER_REDEMPTION_SUCCESS_SID')
    const payload = {
      phone: benPii.phone,
      type: 'WHATSAPP',
      contentSid: CONTENT_SID
    };
    this.messageSenderService.sendWhatappMessage(payload)
  }
}
