// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Module } from '@nestjs/common';
import { OfframpController } from './offramp.controller';
import { OfframpService } from './offramp.service';
import { KotaniPayService } from './offrampProviders/kotaniPay.service';

@Module({
  controllers: [OfframpController],
  providers: [OfframpService, KotaniPayService]
})
export class OfframpModule { }
