import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BQUEUE } from '@rahataid/sdk';
import { SettingsModule } from '@rumsan/extensions/settings';
import { UsersModule } from '@rumsan/user';
import { DevService } from '../utils/develop.service';
import { EmailService } from './email.service';
import { ListenersService } from './listeners.service';
import { MessageSenderService } from './messageSender.service';
import { MetaTxnService } from './metatxn.service';

@Module({
  imports: [
    SettingsModule,
    UsersModule,
    BullModule.registerQueue({
      name: BQUEUE.RAHAT,
    }),
    BullModule.registerQueue({
      name: BQUEUE.RAHAT_PROJECT,
    }),
    BullModule.registerQueue({
      name: BQUEUE.HOST,
    }),
    BullModule.registerQueue({
      name: BQUEUE.META_TXN
    }),
    ClientsModule.registerAsync([
      {
        name: 'RAHAT_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
          },
        }),
        inject: [ConfigService],
      },
    ])
  ],
  providers: [ListenersService, DevService, EmailService, MessageSenderService, MetaTxnService],
})
export class ListenersModule { }
