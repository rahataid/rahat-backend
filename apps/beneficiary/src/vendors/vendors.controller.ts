// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Controller } from '@nestjs/common';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly service: VendorsService) { }

  // @MessagePattern({ cmd: VendorJobs.REGISTER })
  // registerVendor(@Payload() dto: VendorRegisterDto) {
  //   return this.service.registerVendor(dto);
  // }

  // @MessagePattern({ cmd: VendorJobs.ASSIGN_PROJECT })
  // assignToProject(@Payload() dto: VendorAddToProjectDto) {
  //   return this.service.assignToProject(dto)
  // }

  // @MessagePattern({ cmd: VendorJobs.LIST })
  // list(dto) {
  //   return this.service.listVendor(dto);
  // }

  // @MessagePattern({ cmd: VendorJobs.LIST_BY_PROJECT })
  // listByProject(dto) {
  //   return this.service.listProjectVendor(dto)
  // }

  // @MessagePattern({ cmd: VendorJobs.GET })
  // getVendor(id) {
  //   return this.service.getVendor(id)
  // }

  // @MessagePattern({ cmd: VendorJobs.GET_COUNT })
  // getVendorCount() {
  //   return this.service.getVendorCount()
  // }

  // // @MessagePattern({ cmd: VendorJobs.GET_REDEMPTION_VENDORS })
  // // listRedemptionVendors(data) {
  // //   return this.service.listRedemptionVendor(data)
  // // }

  // @MessagePattern({ cmd: VendorJobs.GET_OTP })
  // getOtp(data) {
  //   return this.service.getOtp(data)
  // }
  // @MessagePattern({ cmd: VendorJobs.VERIFY_OTP })
  // verifyOtp(data) {
  //   return this.service.verifyOtp(data)
  // }

  // @MessagePattern({ cmd: VendorJobs.UPDATE })
  // updateVendor(data) {
  //   return this.service.updateVendor(data)
  // }

}
