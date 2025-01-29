// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Module } from "@nestjs/common";
import { PrismaModule } from "@rumsan/prisma";
import { GrievanceController } from "./grievance.controller";
import { GrievanceService } from "./grievance.service";


@Module({
  imports: [PrismaModule],
  providers: [GrievanceService],
  controllers: [GrievanceController]
})
export class GrievanceModule { }

