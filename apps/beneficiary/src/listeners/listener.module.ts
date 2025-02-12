import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StatsService } from '@rahat/stats';
import { BQUEUE, ProjectContants } from '@rahataid/sdk';
import { BeneficiaryStatService } from '../beneficiary/beneficiaryStat.service';
import { EmailService } from './email.service';
import { ListenersService } from './listener.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: BQUEUE.RAHAT_BENEFICIARY,
    }),
    ClientsModule.register([
      {
        name: ProjectContants.ELClient, // Registering the EL_CLIENT here
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        },
      },
    ]),
  ],
  providers: [ListenersService, StatsService, BeneficiaryStatService, EmailService],
})
export class ListenersModule { }
