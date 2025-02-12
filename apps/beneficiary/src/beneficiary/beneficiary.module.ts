import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StatsModule } from '@rahat/stats';
import { BQUEUE, ProjectContants } from '@rahataid/sdk';
import { PrismaModule } from '@rumsan/prisma';
import { BeneficiaryConsumer } from '../consumers/beneficiary.consumer';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryUtilsService } from './beneficiary.utils.service';
import { BeneficiaryStatService } from './beneficiaryStat.service';
import { VerificationService } from './verification.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: ProjectContants.ELClient,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        },
      },
    ]),
    PrismaModule,
    StatsModule,
    BullModule.registerQueue({
      name: BQUEUE.RAHAT_BENEFICIARY,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: { from: '"No Reply" <no-reply@rumsan.com>' },
        template: {
          dir: __dirname + '/assets/templates',
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  controllers: [BeneficiaryController],
  providers: [
    BeneficiaryService,
    BeneficiaryStatService,
    VerificationService,
    BeneficiaryConsumer,
    BeneficiaryUtilsService
  ],
})
export class BeneficiaryModule { }
