// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Beneficiary } from '@prisma/client';
import {
  AddToProjectDto,
  CreateBeneficiaryDto,
  ListBeneficiaryDto,
} from '@rahataid/extensions';
import {
  AAPayload,
  BeneficiaryConstants,
  BeneficiaryEvents,
  BeneficiaryJobs,
  BeneficiaryPayload,
  generateRandomWallet,
  ProjectContants,
  MicroserviceOptions,
} from '@rahataid/sdk';
import { PaginatorTypes, PrismaService } from '@rumsan/prisma';
import { lastValueFrom } from 'rxjs';
import { isAddress } from 'viem';

@Injectable()
export class BeneficiaryUtilsService {
  constructor(
    private readonly prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
    @Inject(ProjectContants.ELClient) private readonly client: ClientProxy
  ) {}

  buildWhereClause(dto: ListBeneficiaryDto): Record<string, any> {
    const { projectId, startDate, endDate } = dto;
    const where: any = { deletedAt: null };

    if (projectId) {
      where.BeneficiaryProject =
        projectId === 'NOT_ASSGNED' ? { none: {} } : { some: { projectId } };
    }

    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    } else if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    } else if (endDate) {
      where.createdAt = { lte: new Date(endDate) };
    }

    return where;
  }

  // Method to attach PII data to the result
  async attachPiiData(
    result: PaginatorTypes.PaginatedResult<Beneficiary>
  ): Promise<PaginatorTypes.PaginatedResult<Beneficiary>> {
    const resultData = result.data;

    if (resultData.length > 0) {
      const beneficiaryIds = resultData.map((d) => d.id);
      const benfPiiData = await this.prismaService.beneficiaryPii.findMany({
        where: { beneficiaryId: { in: beneficiaryIds } },
      });

      const piiDataMap = new Map(
        benfPiiData.map((pii) => [pii.beneficiaryId, pii])
      );

      result.data = resultData.map((d) => ({
        ...d,
        piiData: piiDataMap.get(d.id) || null,
      }));
    }

    return result;
  }

  async ensureValidWalletAddress(walletAddress?: string): Promise<string> {
    if (!walletAddress) {
      return generateRandomWallet().address;
    }

    const existingBeneficiary = await this.prismaService.beneficiary.findUnique(
      {
        where: { walletAddress },
      }
    );

    if (existingBeneficiary) {
      throw new RpcException('Wallet address already exists');
    }
    if (!isAddress(walletAddress)) {
      throw new RpcException('Wallet should be valid Ethereum Address');
    }
    return walletAddress;
  }

  async ensurePhoneNumbers(dtos: CreateBeneficiaryDto[]) {
    const hasPhone = dtos.every((dto) => dto.piiData.phone);
    if (!hasPhone) throw new RpcException('Phone number is required');
  }

  async ensureUniquePhone(phone: string): Promise<void> {
    const existingPiiData = await this.prismaService.beneficiaryPii.findUnique({
      where: { phone },
    });
    if (existingPiiData) {
      throw new RpcException('Phone number should be unique');
    }
  }

  async addPIIData(beneficiaryId: string, piiData: any): Promise<void> {
    await this.prismaService.beneficiaryPii.create({
      data: {
        beneficiaryId,
        phone: piiData.phone.toString(),
        ...piiData,
      },
    });
  }

  async assignToProjects(
    beneficiaryUuid: string,
    projectUuids: string[]
  ): Promise<void> {
    const assignPromises = projectUuids.map((projectUuid) => {
      return this.assignBeneficiaryToProject({
        beneficiaryId: beneficiaryUuid,
        projectId: projectUuid,
      });
    });

    await Promise.all(assignPromises);
  }

  async assignBeneficiaryToProject(assignBeneficiaryDto: AddToProjectDto) {
    const { beneficiaryId, projectId } = assignBeneficiaryDto;

    //fetch project and beneficiary detail in parallel
    const [projectData, beneficiaryData] = await Promise.all([
      this.prismaService.project.findUnique({ where: { uuid: projectId } }),
      this.prismaService.beneficiary.findUnique({
        where: { uuid: beneficiaryId },
        include: { pii: true },
      }),
    ]);

    if (!projectData) return;
    if (!beneficiaryData) throw new RpcException('Beneficiary not Found.');

    //Build Project Payload
    const projectPayload = this.buildProjectPayload(
      projectData,
      beneficiaryData
    );

    //Save beneficiary to Project
    await this.saveBeneficiaryToProject({
      beneficiaryId,
      projectId,
    });

    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_ASSIGNED_TO_PROJECT, {
      projectUuid: projectId,
    });

    //3. Sync beneficiary to project
    return this.handleMicroserviceCall({
      client: this.client.send(
        { cmd: BeneficiaryJobs.ADD_TO_PROJECT, uuid: projectId },
        projectPayload
      ),
      onSuccess(response) {
        console.log('response', response);
      },
      onError(error) {
        console.log('error', error);
        throw new RpcException(error.message);
      },
    });
  }

  private buildProjectPayload(projectData: any, beneficiaryData: any) {
    const payload: BeneficiaryPayload = {
      uuid: beneficiaryData.uuid,
      walletAddress: beneficiaryData.walletAddress,
      extras: beneficiaryData.extras || null,
      type: BeneficiaryConstants.Types.ENROLLED,
      isVerified: beneficiaryData.isVerified,
    };

    //Handle aa project type
    if (projectData.type.toLowerCase() === 'aa') {
      delete payload.type;
      (payload as AAPayload).gender = beneficiaryData.gender;
      payload.extras = { ...payload.extras, phone: beneficiaryData.pii.phone };
    }

    if (projectData.type.toLowerCase() === 'rp') {
      delete payload.type;
    }

    return payload;
  }

  async saveBeneficiaryToProject(dto: AddToProjectDto) {
    return this.prismaService.beneficiaryProject.create({ data: dto });
  }

  prepareBulkInsertData(dtos: CreateBeneficiaryDto[]) {
    const beneficiariesData = dtos.map(({ piiData, ...data }) => data);
    const piiDataList = dtos.map(({ uuid, piiData }) => ({ ...piiData, uuid }));
    return { beneficiariesData, piiDataList };
  }

  async insertBeneficiariesAndPIIData(
    beneficiariesData: any[],
    piiDataList: any[],
    dtos: CreateBeneficiaryDto[]
  ) {
    const insertedBeneficiaries = await this.prismaService.$transaction(
      async (prisma) => {
        await prisma.beneficiary.createMany({ data: beneficiariesData });
        // Retrieve inserted beneficiaries for linking PII data

        const insertedBeneficiaries = await prisma.beneficiary.findMany({
          where: {
            uuid: {
              in: dtos.map((dto) => dto.uuid),
            },
          },
        });

        // Map PII data with correct beneficiary IDs
        const piiBulkInsertData = piiDataList.map((piiData) => {
          const beneficiary = insertedBeneficiaries.find(
            (b) => b.uuid === piiData.uuid
          );
          return {
            beneficiaryId: beneficiary.id,
            ...piiData,
            uuid: undefined, // Remove the temporary UUID field
          };
        });

        // Insert PII data in bulk
        if (piiBulkInsertData.length > 0) {
          const sanitizedPiiBenef = piiBulkInsertData.map((bulkData) => ({
            ...bulkData,
            phone: bulkData.phone ? bulkData.phone.toString() : null,
          }));
          await prisma.beneficiaryPii.createMany({
            data: sanitizedPiiBenef,
          });
        }

        return prisma.beneficiary.findMany({
          where: {
            uuid: {
              in: dtos.map((dto) => dto.uuid),
            },
          },
          include: {
            pii: true, // Include the related PII data
          },
        });
      }
    );
    return insertedBeneficiaries;
  }

  async handleMicroserviceCall<TRequest, TResponse>(
    options: MicroserviceOptions<TRequest, TResponse>
  ): Promise<TResponse> {
    const { client, onSuccess, onError } = options;

    try {
      // Convert Observable to Promise and wait for the response
      const response = await lastValueFrom(client);
      // If onSuccess callback is provided, call it with the response
      if (onSuccess) await onSuccess(response);
      return response;
    } catch (error) {
      // If onError callback is provided, call it with the error
      if (onError) {
        await onError(error);
      } else {
        // Rethrow the error if no onError callback is provided
        throw error;
      }
    }
  }
}
