// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Controller, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  addBulkBeneficiaryToProject,
  CreateBeneficiaryDto,
  CreateBeneficiaryGroupsDto,
  ImportTempBenefDto,
  ListBeneficiaryDto,
  ListBeneficiaryGroupDto,
  ListTempGroupsDto,
  UpdateBeneficiaryDto,
  UpdateBeneficiaryGroupDto,
} from '@rahataid/extensions';
import {
  BeneficiaryJobs,
  ValidateWallet
} from '@rahataid/sdk';
import { UUID } from 'crypto';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryUtilsService } from './beneficiary.utils.service';
import { BeneficiaryStatService } from './beneficiaryStat.service';
import { VerificationService } from './verification.service';

@Controller()
export class BeneficiaryController {
  constructor(
    private readonly service: BeneficiaryService,
    private readonly utilService: BeneficiaryUtilsService,
    private readonly statsService: BeneficiaryStatService,
    private readonly verificationService: VerificationService
  ) { }

  @MessagePattern({ cmd: BeneficiaryJobs.CREATE })
  async create(@Payload() createBeneficiaryDto: CreateBeneficiaryDto) {
    return this.service.create(createBeneficiaryDto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET })
  async getBeneficiary(uuid: UUID) {
    return this.service.findOne(uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_BY_WALLET })
  async getBeneficiaryByWallet(wallet: string) {
    return this.service.findOneByWallet(wallet);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_BY_PHONE })
  async getBeneficiaryByPhone(wallet: string) {
    return this.service.findOneByPhone(wallet);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.CREATE_BULK })
  createBulk(@Payload() data) {
    // const payloadData = Array.isArray(data?.data) ? data?.data : data?.payload;

    return this.service.createBulk(
      data,
      data?.projectUUID,
      data?.data?.walkinBulk
    );
  }

  @MessagePattern({
    cmd: BeneficiaryJobs.IMPORT_BENEFICIARY_LARGE_QUEUE,
  })
  createBulkWithQueue(@Payload() queueData) {
    const payloadData = Array.isArray(queueData?.data)
      ? queueData?.data
      : queueData?.payload;
    return this.service.createBulkWithQueue(payloadData, queueData);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST })
  async list(dto: ListBeneficiaryDto) {
    return this.service.list(dto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LEAD_CONVERSION_BENEFICIARY })
  async leadConversions(dto: ListBeneficiaryDto) {
    return this.service.listBeneficiaryPiiByWalletAddress(dto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_BY_PROJECT })
  async listByProject(data: any) {
    return this.service.listBenefByProject(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_PII })
  async listPiiData(dto: any) {
    return this.service.listPiiData(dto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.STATS })
  async stats() {
    return this.statsService.getAllStats();
  }

  @MessagePattern({ cmd: BeneficiaryJobs.PROJECT_STATS })
  async projectStats(uuid: string) {
    return this.statsService.getAllStats(uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.ADD_TO_PROJECT })
  async addToProject(payload: any) {
    const { dto, projectUid } = payload;
    return this.service.addBeneficiaryToProject(dto, projectUid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.BULK_ADD_TO_PROJECT })
  async bulkaddToProject(payload: addBulkBeneficiaryToProject) {
    return this.service.addBulkBeneficiaryToProject(payload);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.ASSIGN_TO_PROJECT })
  async assignToProject(payload: any) {
    return this.utilService.assignBeneficiaryToProject(payload);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.BULK_ASSIGN_TO_PROJECT })
  async bulkAssignToProject(payload: any) {
    return this.service.bulkAssignToProject(payload);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.UPDATE })
  update(@Param('uuid') uuid: UUID, @Payload() dto: UpdateBeneficiaryDto) {
    const benefUUID = uuid ? uuid : dto.uuid;
    return this.service.update(benefUUID, dto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.DELETE })
  delete(payload: any) {
    return this.service.delete(payload.uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.REMOVE })
  async remove(payload: any) {
    return this.service.remove(payload);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GENERATE_LINK })
  generateLink(uuid: UUID) {
    return this.verificationService.generateLink(uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.VALIDATE_WALLET })
  validateWallet(validationData: ValidateWallet) {
    return this.verificationService.validateWallet(validationData);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.VERIFY_SIGNATURE })
  verifySignature(verificationData: any) {
    return this.verificationService.verifySignature(verificationData);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_REFERRAL })
  listVendorReferral(data) {
    return this.service.listReferredBen(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_BEN_VENDOR_COUNT })
  getTotalCount(data) {
    return this.service.getTotalCount(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_PROJECT_SPECIFIC })
  getProjectSpecific(data) {
    return this.service.getProjectSpecificData(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_TABLE_STATS })
  getTableStats() {
    return this.statsService.getTableStats();
  }

  @MessagePattern({ cmd: BeneficiaryJobs.ADD_GROUP })
  addGroup(payload: CreateBeneficiaryGroupsDto) {
    return this.service.addGroup(payload);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_ONE_GROUP })
  getGroup(uuid: string) {
    return this.service.getOneGroup(uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.REMOVE_ONE_GROUP })
  removeGroup(uuid: string) {
    return this.service.removeOneGroup(uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_ALL_GROUPS })
  getAllGroups(dto: ListBeneficiaryGroupDto) {
    return this.service.getAllGroups(dto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.UPDATE_GROUP })
  updateGroup(
    @Param('uuid') uuid: UUID,
    @Payload() dto: UpdateBeneficiaryGroupDto
  ) {
    const groupUUID = uuid ? uuid : dto?.uuid;
    return this.service.updateGroup(groupUUID, dto);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.ASSIGN_GROUP_TO_PROJECT })
  async assignGroupToProject(payload: any) {
    return this.service.assignBeneficiaryGroupToProject(payload);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_GROUP_BY_PROJECT })
  async listGroupByProject(data: any) {
    return this.service.listBenefGroupByProject(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_ONE_GROUP_BY_PROJECT })
  async getOneGroupByProject(uuid: UUID) {
    return this.service.getOneGroupByProject(uuid);
  }

  @MessagePattern({
    cmd: BeneficiaryJobs.IMPORT_BENEFICIARIES_FROM_COMMUNITY_TOOL,
  })
  async importBeneficiariesFromTool(data: any) {
    return this.service.importBeneficiariesFromTool(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_TEMP_BENEFICIARY })
  async listTempBeneficiaries(data: any) {
    return this.service.listTempBeneficiaries(data.uuid, data.query);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.LIST_TEMP_GROUPS })
  async listTempGroups(query: ListTempGroupsDto) {
    return this.service.listTempGroups(query);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.IMPORT_TEMP_BENEFICIARIES })
  async importTempBeneficiary(data: ImportTempBenefDto) {
    return this.service.importTempBeneficiaries(data);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_STATS })
  async getProjectStats(data: any) {
    return this.service.projectStatsDataSource(data.uuid);
  }

  @MessagePattern({ cmd: BeneficiaryJobs.GET_ALL_STATS })
  async getAllStats() {
    return this.service.allDataSource();
  }

  @MessagePattern({ cmd: BeneficiaryJobs.CALCULATE_STATS })
  async syncProjectStats(payload) {
    return this.service.syncProjectStats(payload.projectUUID)
  }

  @MessagePattern({ cmd: BeneficiaryJobs.DELETE_BENEFICIARY_AND_PII })
  async deleteBenefAndPii(payload: any) {
    return this.service.deleteBenefAndPii(payload);
  }
}
