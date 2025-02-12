import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StatsModule } from '@rahat/stats';
import { SettingsModule } from '@rumsan/extensions/settings';
import { PrismaService } from '@rumsan/prisma';
import {
  AuthsModule,
  RSUserModule,
  RolesModule,
  UsersModule,
} from '@rumsan/user';
import { BeneficiaryModule } from '../beneficiary/beneficiary.module';
import { ExternalAppGuard } from '../decorators';
import { GrievanceModule } from '../grievance/grievance.module';
import { ListenersModule } from '../listeners/listeners.module';
import { OfframpModule } from '../offramp/offramp.module';
import { MetaTxnProcessorsModule } from '../processors/meta-transaction/metaTransaction.module';
import { ProcessorsModule } from '../processors/processors.module';
import { ProjectModule } from '../projects/projects.module';
import { QueueModule } from '../queue/queue.module';
import { RequestContextModule } from '../request-context/request-context.module';
import { TokenModule } from '../token/token.module';
import { UploadModule } from '../upload/upload.module';
import { AppUsersModule } from '../vendors/vendors.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BeneficiaryModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),

        },
        settings: {
          stalledInterval: 30000, // Time (ms) to check for stalled jobs, default is 30 seconds.
          lockDuration: 60000, // Time (ms) for a job to finish before considering it stalled, default is 30 seconds.
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({ maxListeners: 10, ignoreErrors: false }),
    ListenersModule,
    AppUsersModule,
    RSUserModule.forRoot([AuthsModule, UsersModule, RolesModule]),
    ProjectModule,
    StatsModule,
    ProcessorsModule,
    MetaTxnProcessorsModule,
    UploadModule,
    GrievanceModule,
    TokenModule,
    SettingsModule,
    OfframpModule,
    RequestContextModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: ExternalAppGuard,
  }],
})
export class AppModule { }
