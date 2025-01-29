// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBeneficiaryDto } from '@rahataid/extensions';
import {
  BeneficiaryEvents,
  BeneficiaryJobs,
  BQUEUE,
  generateRandomWallet,
  ProjectContants
} from '@rahataid/sdk';
import { PrismaService } from '@rumsan/prisma';
import { Job } from 'bull';
import { randomUUID, UUID } from 'crypto';
import { splitBeneficiaryPII } from '../beneficiary/helpers';
import { handleMicroserviceCall } from '../utils/handleMicroserviceCall';
import { trimNonAlphaNumericValue } from '../utils/sanitize-data';
import {
  findTempBenefGroups,
  validateDupicatePhone,
  validateDupicateWallet,
} from './processor.utils';

const BATCH_SIZE = 500;

@Processor(BQUEUE.RAHAT_BENEFICIARY)
export class BeneficiaryProcessor {
  private readonly logger = new Logger(BeneficiaryProcessor.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    @Inject(ProjectContants.ELClient) private readonly client: ClientProxy,
    private eventEmitter: EventEmitter2
  ) { }

  @Process(BeneficiaryJobs.UPDATE_STATS)
  async sample(job: Job<any>) {
    console.log('sample', job.data);
  }

  @Process(BeneficiaryJobs.IMPORT_TEMP_BENEFICIARIES)
  async importTempBeneficiary(job: Job<any>) {
    try {
      const { groupUUID } = job.data;
      const tempGroup = await this.prisma.tempGroup.findUnique({
        where: { uuid: groupUUID },
      });
      const groups = await findTempBenefGroups(this.prisma, groupUUID);
      if (!groups.length) return;
      const beneficiaries = groups.map((f) => f.tempBeneficiary);
      if (!beneficiaries.length) return;

      // Validate duplicate phones and wallets
      const dupliPhones = await validateDupicatePhone(
        this.prisma,
        beneficiaries
      );
      if (dupliPhones.length)
        throw new Error(`Duplicate phones found: ${dupliPhones.toString()}`);
      const dupliWallets = await validateDupicateWallet(
        this.prisma,
        beneficiaries
      );
      if (dupliWallets.length)
        throw new Error(
          `Duplicate walletAddress found: ${dupliWallets.toString()}`
        );

      // =====Txn start====
      for (let i = 0; i < beneficiaries.length; i += BATCH_SIZE) {
        console.log('Batch=>', i);
        const batch = beneficiaries.slice(i, i + BATCH_SIZE);
        await this.prisma.$transaction(
          async (txn) => {
            await importAndAddToGroup({ txn, beneficiaries: batch, tempGroup });
          },
          {
            maxWait: 5000,
            timeout: 25000,
          }
        );
      }
      // ====Txn start end===
      await removeTempGroup(this.prisma, tempGroup.uuid);
    } catch (err) {
      console.log('Import Error=>', err.message);
      throw err;
    }
  }

  @Process(BeneficiaryJobs.GENERATE_LINK)
  async generateLink(job: Job<any>) {
    console.log(job.data);
    if (job.data) {
      await this.mailerService.sendMail({
        to: job.data.email,
        from: 'raghav.kattel@rumsan.net',
        subject: 'Wallet Verification Link',
        template: './wallet-verification',
        context: { encryptedData: job.data.encrypted, name: job.data.name },
      });
      console.log('Email sent to', job.data.email);
      return true;
    }

    throw new BadRequestException();
  }

  @Process({
    name: BeneficiaryJobs.IMPORT_BENEFICIARY_LARGE_QUEUE,
    concurrency: 1,
  })
  async importBeneficiaryLargeQueue(
    job: Job<{
      data: CreateBeneficiaryDto[];
      projectUUID: UUID;
      batchNumber: number;
      ignoreExisting: boolean;
      totalBatches: number;
      automatedGroupOption: {
        groupKey: string;
        createAutomatedGroup: boolean
      };
    }>
  ) {
    const {
      data: beneficiaries,
      projectUUID,
      ignoreExisting,
      batchNumber,
      totalBatches,
      automatedGroupOption,
    } = job.data;


    // const canProceed = await canProcessJob(job, this.logger);
    // if (!canProceed) {
    //   return; // Stop processing if the queue is busy
    // }
    // console.log(`Processing batch ${batchNumber} of ${totalBatches}`);

    // Helper function to validate phone numbers and wallet addresses
    const validateBeneficiaries = async (
      batch: CreateBeneficiaryDto[],
      prisma: PrismaService
    ) => {
      const phoneNumbers = batch.map(
        (beneficiary) => beneficiary.piiData.phone
      );
      const walletAddresses = batch
        .map((beneficiary) => beneficiary.walletAddress)
        .filter(Boolean);

      // Find duplicate phone numbers
      const duplicatePhones = await checkPhoneNumber(batch, prisma);
      // Find duplicate wallet addresses if provided
      const duplicateWallets =
        walletAddresses.length > 0
          ? await checkWalletAddress(batch, prisma)
          : [];

      if (!ignoreExisting) {
        if (duplicatePhones.length > 0) {
          throw new RpcException(
            `Duplicate phone numbers: ${duplicatePhones.join(', ')}`
          );
        }

        if (duplicateWallets.length > 0) {
          throw new RpcException(
            `Duplicate wallet addresses: ${duplicateWallets.join(', ')}`
          );
        }
      } else {
        // Filter out duplicates if `ignoreExisting` is true
        return batch.filter(
          (beneficiary) =>
            !duplicatePhones.includes(beneficiary.piiData.phone) &&
            !duplicateWallets.includes(beneficiary.walletAddress)
        );
      }

      return batch;
    };

    // Log the size of the current batch being processed
    console.log(
      `Batch ${batchNumber} contains ${beneficiaries.length} beneficiaries.`
    );

    await this.prisma
      .$transaction(
        async (txn) => {
          // Validate and possibly filter out duplicates
          const filteredBatch = await validateBeneficiaries(
            beneficiaries,
            this.prisma
          );
          if (filteredBatch.length === 0) {
            console.log(
              `Batch ${batchNumber} skipped, no new beneficiaries after filtering.`
            );
            return; // Skip the batch if there are no valid beneficiaries to process
          }

          // Pre-generate UUIDs and wallet addresses if necessary
          filteredBatch.forEach((beneficiary) => {
            beneficiary.uuid = beneficiary.uuid || randomUUID();
            beneficiary.walletAddress =
              beneficiary.walletAddress || generateRandomWallet().address;
          });

          // Separate PII data and beneficiary data
          const beneficiariesData = filteredBatch.map(
            ({ piiData, ...data }) => data
          );

          const piiDataList = filteredBatch.map(({ uuid, piiData }) => ({
            ...piiData,
            uuid,
          }));

          // Insert beneficiaries in bulk
          const insertedBeneficiaries =
            await txn.beneficiary.createManyAndReturn({
              data: beneficiariesData,
            }).catch((error) => {
              console.error(
                `Failed to insert beneficiaries: ${error.message}`
              );
              throw new RpcException(
                `Failed to insert beneficiaries: ${error.message}`
              );
            });
          // console.log(insertedBeneficiaries);
          // // Retrieve inserted beneficiaries for linking PII data
          // const insertedBeneficiaries = await txn.beneficiary.findMany({
          //   where: {
          //     uuid: { in: filteredBatch.map((beneficiary) => beneficiary.uuid) },
          //   },
          // });

          // Map PII data with correct beneficiary IDs
          const piiBulkInsertData = piiDataList.map((piiData) => {
            const beneficiary = insertedBeneficiaries.find(
              (b) => b.uuid === piiData.uuid
            );
            return {
              beneficiaryId: beneficiary.id,
              ...piiData,
              uuid: undefined,
            }; // Remove temporary UUID
          });

          // Insert PII data in bulk
          if (piiBulkInsertData.length > 0) {
            await txn.beneficiaryPii.createMany({ data: piiBulkInsertData });
          }

          // for automated grouping
          let createdBenGroups;
          if (automatedGroupOption.createAutomatedGroup) {
            const uniqueGroup = [
              ...new Set(
                beneficiaries.map(
                  (b) => b[trimNonAlphaNumericValue(automatedGroupOption?.groupKey).toLowerCase()]
                )
              ),
            ];


            const groups = await txn.beneficiaryGroup.findMany({
              where: {
                name: {
                  in: uniqueGroup,
                },
              },
            });
            console.log('groups', groups)

            const beneficiaryGroupData = insertedBeneficiaries.map((b) => {
              const beneficiaryId = b.uuid;
              const beneficiaryGroupId = groups.find(
                (g) =>
                  g.name === b[trimNonAlphaNumericValue(automatedGroupOption?.groupKey).toLowerCase()]
              ).uuid;
              return {
                beneficiaryId,
                beneficiaryGroupId,
              };
            });

            createdBenGroups =
              await txn.groupedBeneficiaries.createManyAndReturn({
                data: beneficiaryGroupData,
                skipDuplicates: true,
                select: {
                  Beneficiary: true,
                  beneficiaryGroup: true,
                  uuid: true,
                },
              }).catch((error) => {
                console.error(
                  `Failed to insert beneficiaries: ${error.message}`
                );
                throw new RpcException(
                  `Failed to insert beneficiaries: ${error.message}`
                );
              });
          }

          // Assign beneficiaries to the project if projectUUID is provided
          if (projectUUID) {
            // if (projectUUID && !automatedGroupOption.groupKey) {
            await txn.beneficiaryProject.createMany({
              data: insertedBeneficiaries.map(({ uuid }) => ({
                beneficiaryId: uuid,
                projectId: projectUUID,
              })),
            }).catch((error) => {
              console.error(
                `Failed to assign beneficiaries to project: ${error.message}`
              );
              throw new RpcException(
                `Failed to assign beneficiaries to project: ${error.message}`
              );
            });

            const assignPromises = insertedBeneficiaries.map((b) => {
              const projectPayload = {
                uuid: b.uuid,
                walletAddress: b.walletAddress,
                extras: {
                  location: b?.location,
                  ...(typeof b.extras === 'object' ? b.extras : {}),
                },

                isVerified: b?.isVerified,
              };
              return handleMicroserviceCall({
                client: this.client.send(
                  { cmd: BeneficiaryJobs.ADD_TO_PROJECT, uuid: projectUUID },
                  projectPayload
                ),
                onSuccess: (response) => {
                  this.logger.log(
                    `Successfully assigned beneficiary ${b.uuid} to project ${projectUUID}`
                  );
                  return response;
                },
                onError(error) {
                  console.log(
                    'Error assiging Beneficiaries to project.',
                    error
                  );
                  throw new RpcException(error.message);
                },
              });
            });

            await Promise.all(assignPromises);
          }

          // if (automatedGroupOption.groupKey && projectUUID) {
          //   // console.log('createdGroups', createdBenGroups);
          //   const assignedGroupsToProject = createdBenGroups.map((bg) => {
          //     const payload = {
          //       beneficiaryGroupId: bg.beneficiaryGroup.uuid,
          //       projectId: projectUUID,
          //     };
          //     console.log('payload', payload);
          //     return handleMicroserviceCall({
          //       client: this.client.send(
          //         {
          //           cmd: BeneficiaryJobs.ASSIGN_GROUP_TO_PROJECT,
          //           uuid: projectUUID,
          //         },
          //         payload
          //       ),
          //       onSuccess(response) {
          //         console.log('response', response);
          //         return response;
          //       },
          //       onError(error) {
          //         console.log('Error assiging Groups to project.', error);
          //         throw new RpcException(error.message);
          //       },
          //     });
          //   });
          //   await Promise.all(assignedGroupsToProject);
          // }
          console.log(`Successfully processed batch ${batchNumber}`);
        },
        {
          timeout: 25000,
        }
      )
      .catch((error) => {
        console.log('Error importing Beneficiaries', error)
        console.error(
          `Failed to process batch ${batchNumber}: ${error.message}`
        );
        throw new RpcException(`Batch ${batchNumber} failed: ${error.message}`);
      });

    this.eventEmitter.emit(
      BeneficiaryEvents.BENEFICIARY_ASSIGNED_TO_PROJECT,
      {
        projectUuid: projectUUID,
      }
    );

    return {
      success: true,
      message: `Batch ${batchNumber} of ${totalBatches} processed successfully.`,
    };
  }
}

// Helper functions to check for duplicates

async function checkPhoneNumber(
  beneficiaries: CreateBeneficiaryDto[],
  prisma: PrismaService
): Promise<string[]> {
  const phoneNumbers = beneficiaries.map(
    (beneficiary) => beneficiary.piiData.phone
  );
  const duplicates = await prisma.beneficiaryPii.findMany({
    where: { phone: { in: phoneNumbers } },
    select: { phone: true },
  });
  return duplicates.map((dup) => dup.phone);
}

async function checkWalletAddress(
  beneficiaries: CreateBeneficiaryDto[],
  prisma: PrismaService
): Promise<string[]> {
  const walletAddresses = beneficiaries.map(
    (beneficiary) => beneficiary.walletAddress
  );
  const duplicates = await prisma.beneficiary.findMany({
    where: { walletAddress: { in: walletAddresses } },
    select: { walletAddress: true },
  });
  return duplicates.map((dup) => dup.walletAddress);
}

// Mock function to generate random wallet address

//===========Import helper txns=====================
async function importAndAddToGroup({ txn, beneficiaries, tempGroup }) {
  const { name, uuid: tempGUID } = tempGroup;
  const group = await upsertGroup(txn, name);
  for (const benef of beneficiaries) {
    const { uuid, ...rest } = benef;
    const { piiData, nonPii } = splitBeneficiaryPII(rest);
    const newBenef = await upsertBeneficiary(txn, nonPii);
    const piiDataPayload = { ...piiData, beneficiaryId: newBenef.id };
    await upsertPiiData(txn, piiDataPayload);
    await addBenefToGroup(txn, group.uuid, newBenef.uuid);
    const removed = await removeFromTempBenefGroup(txn, uuid, tempGUID);
    await removeTempBeneficiary(txn, removed.tempBenefUID);
  }
}

async function upsertBeneficiary(txn: any, data: any) {
  return txn.beneficiary.upsert({
    where: { walletAddress: data.walletAddress },
    update: data,
    create: data,
  });
}

async function upsertPiiData(txn: any, data: any) {
  return txn.beneficiaryPii.upsert({
    where: { phone: data.phone },
    update: data,
    create: data,
  });
}

async function addBenefToGroup(txn: any, groupUID: UUID, benefUID: UUID) {
  const payload = {
    beneficiaryGroupId: groupUID,
    beneficiaryId: benefUID,
  };
  return txn.groupedBeneficiaries.upsert({
    where: {
      beneficiaryGroupIdentifier: payload,
    },
    update: payload,
    create: payload,
  });
}

async function removeTempBeneficiary(txn: any, uuid: UUID) {
  const rows = await txn.tempBeneficiaryGroup.findMany({
    where: { tempBenefUID: uuid },
  });
  if (rows.length) return;
  return txn.tempBeneficiary.delete({ where: { uuid } });
}

async function upsertGroup(txn: any, name: string) {
  return txn.beneficiaryGroup.upsert({
    where: { name },
    update: { name },
    create: { name },
  });
}

async function removeFromTempBenefGroup(
  txn: any,
  benefUID: UUID,
  groupUUID: UUID
) {
  return txn.tempBeneficiaryGroup.delete({
    where: {
      tempBeneficiaryGroupIdentifier: {
        tempBenefUID: benefUID,
        tempGroupUID: groupUUID,
      },
    },
  });
}

async function removeTempGroup(prisma: any, tempGroupUID: string) {
  return prisma.tempGroup.delete({ where: { uuid: tempGroupUID } });
}

//=========== // End Import helper txns=====================
