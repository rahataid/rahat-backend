import { Module } from '@nestjs/common';
import { OfframpController } from './offramp.controller';
import { OfframpService } from './offramp.service';
import { KotaniPayService } from './offrampProviders/kotaniPay.service';

@Module({
  controllers: [OfframpController],
  providers: [OfframpService, KotaniPayService]
})
export class OfframpModule { }
