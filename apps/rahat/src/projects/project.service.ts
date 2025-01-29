// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateProjectDto,
  TestKoboImportDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
} from '@rahataid/extensions';
import {
  BeneficiaryJobs,
  BQUEUE,
  genRandomPhone,
  MS_ACTIONS,
  MS_TIMEOUT,
  ProjectEvents,
  ProjectJobs,
} from '@rahataid/sdk';
import { BeneficiaryType, KoboBeneficiaryStatus } from '@rahataid/sdk/enums';
import { JOBS } from '@rahataid/sdk/project/project.events';
import { PrismaService } from '@rumsan/prisma';
import { Queue } from 'bull';
import { UUID } from 'crypto';
import { switchMap, tap, timeout } from 'rxjs';
import { RequestContextService } from '../request-context/request-context.service';
import { createExtrasAndPIIData } from '../utils';
import { KOBO_FIELD_MAPPINGS } from '../utils/fieldMappings';
import {
  aaActions,
  beneficiaryActions,
  beneficiaryGroupActions,
  c2cActions,
  cambodiaActions,
  cvaActions,
  elActions,
  groupActions,
  projectActions,
  settingActions,
  vendorActions,
} from './actions';
import { CAMBODIA_JOBS } from './actions/cambodia.action';
import { commsActions } from './actions/comms.action';
import { rpActions } from './actions/rp.action';
import { userRequiredActions } from './actions/user-required.action';

const NODE_ENV = process.env.NODE_ENV || 'development';
const CAMBODIA_COUNTRY_CODE = '+855';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private requestContextService: RequestContextService,
    @Inject('RAHAT_CLIENT') private readonly client: ClientProxy,
    @InjectQueue(BQUEUE.META_TXN) private readonly metaTransactionQueue: Queue
  ) { }

  async create(data: CreateProjectDto) {
    // TODO: refactor to proper validator
    // switch (data.type) {
    //   case 'AA':
    //     SettingsService.get('AA')
    //     break;
    //   case 'CVA':
    //     SettingsService.get('CVA')
    //     break;
    //   case 'EL':
    //     SettingsService.get('EL')
    //     break;
    //   default:
    //     throw new Error('Invalid project type.')
    // }

    const project = await this.prisma.project.create({
      data,
    });

    this.eventEmitter.emit(ProjectEvents.PROJECT_CREATED, project);

    return project;
  }

  async list() {
    return this.prisma.project.findMany();
  }

  async findOne(uuid: UUID) {
    return this.prisma.project.findUnique({
      where: {
        uuid,
      },
    });
  }

  async update(uuid: UUID, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: {
        uuid,
      },
      data,
    });
  }

  async updateStatus(uuid: UUID, data: UpdateProjectStatusDto) {
    return this.prisma.project.update({
      where: {
        uuid,
      },
      data,
    });
  }

  async remove(uuid: UUID) {
    return this.prisma.project.delete({
      where: {
        uuid,
      },
    });
  }

  async sendWhatsAppMsg(response, cmd, payload) {
    // send whatsapp message after added referal beneficiary to project
    if (
      response?.insertedData?.some((res) => res?.walletAddress) &&
      response?.cmd === BeneficiaryJobs.BULK_REFER_TO_PROJECT &&
      payload?.dto?.type === BeneficiaryType.REFERRED
    ) {
      this.eventEmitter.emit(
        ProjectEvents.BENEFICIARY_ADDED_TO_PROJECT,
        payload.dto
      );
    }
    //send message to all admin
    if (response?.id && cmd?.cmd === ProjectJobs.REQUEST_REDEMPTION) {
      this.eventEmitter.emit(ProjectEvents.REQUEST_REDEMPTION);
    }
    if (
      response?.vendordata?.length > 0 &&
      cmd?.cmd === ProjectJobs.UPDATE_REDEMPTION
    ) {
      this.eventEmitter.emit(
        ProjectEvents.UPDATE_REDEMPTION,
        response.vendordata
      );
    }
  }

  async sendCommand(
    cmd,
    payload,
    timeoutValue = MS_TIMEOUT,
    client: ClientProxy,
    action: string,
    user: any
  ) {
    try {
      console.log("CMD", cmd);
      const requiresUser = userRequiredActions.has(action);
      console.log({ requiresUser });
      console.log("Payload", payload);
      console.log("User", user);

      return client
        .send(cmd, {
          ...payload,
          ...(requiresUser && { user }),
        })
        .pipe(
          timeout(timeoutValue),
          tap((response) => {
            this.sendWhatsAppMsg(response, cmd, payload);
          })
        );

    } catch (err) {
      console.log('Err', err);
    }
  }

  async executeMetaTxRequest(params: any, uuid: string, trigger?: any) {
    const payload: any = { params, uuid };

    if (trigger) payload.trigger = trigger;

    const res = await this.metaTransactionQueue.add(
      JOBS.META_TRANSACTION.ADD_QUEUE,
      payload
    );

    return { txHash: res.data.hash, status: res.data.status };
  }

  async sendSucessMessage(uuid, payload) {
    const { benId } = payload;

    this.eventEmitter.emit(ProjectEvents.REDEEM_VOUCHER, benId);
    return this.client
      .send({ cmd: 'rahat.jobs.project.voucher_claim', uuid }, {})
      .pipe(timeout(MS_TIMEOUT));
  }

  async handleProjectActions({ uuid, action, payload, trigger, user }) {
    //Note: This is a temporary solution to handle metaTx actions
    const metaTxActions = {
      [MS_ACTIONS.ELPROJECT.REDEEM_VOUCHER]: async () =>
        await this.executeMetaTxRequest(payload, uuid, trigger),
      [MS_ACTIONS.ELPROJECT.PROCESS_OTP]: async () =>
        await this.executeMetaTxRequest(payload, uuid, trigger),
      [MS_ACTIONS.ELPROJECT.SEND_SUCCESS_MESSAGE]: async () =>
        await this.sendSucessMessage(uuid, payload),
      [MS_ACTIONS.ELPROJECT.ASSIGN_DISCOUNT_VOUCHER]: async () =>
        await this.executeMetaTxRequest(payload, uuid, trigger),
      [MS_ACTIONS.ELPROJECT.REQUEST_REDEMPTION]: async () =>
        await this.executeMetaTxRequest(payload, uuid, trigger),
    };

    const actions = {
      ...groupActions,
      ...beneficiaryGroupActions,
      ...cambodiaActions,
      ...projectActions,
      ...elActions,
      ...aaActions,
      ...beneficiaryActions,
      ...vendorActions,
      ...settingActions,
      ...metaTxActions,
      ...c2cActions,
      ...cvaActions,
      ...rpActions,
      ...commsActions
    };

    const actionFunc = actions[action];
    if (!actionFunc) {
      throw new Error('Please provide a valid action!');
    }
    return await actionFunc(uuid, payload, (...args) =>
      this.sendCommand(args[0], args[1], args[2], this.client, action, user)
    );
  }

  // ======Only for testing=======
  async importTestBeneficiary(uuid: string, dto: TestKoboImportDto) {
    dto.phone = `+${dto.phone}`;
    const { piiData, type, ...rest } = createExtrasAndPIIData(dto);
    const extrasPayload = {
      meta: dto.meta,
      province: dto.province,
      district: dto.district,
      wardNo: dto.wardNo
    }
    const piiExist = await this.checkPiiPhone(dto.phone);
    if (piiExist) throw new Error('Phone number already exists!');
    const koboPayload = {
      name: piiData.name,
      phone: piiData.phone,
      gender: dto.gender,
      age: dto.age,
      type: dto.type,
      leadInterests: dto.leadInterests,
      extras: extrasPayload
    }
    const row = await this.prisma.koboBeneficiary.create({
      data: koboPayload,
    });

    return this.client.send({ cmd: BeneficiaryJobs.CREATE }, { piiData, ...rest }).pipe(
      timeout(MS_TIMEOUT),
      switchMap((response) => {
        const cambodiaPayload = {
          uuid: response.uuid,
          phone: dto.phone,
          walletAddress: response.walletAddress,
          type: dto?.type || 'UNKNOWN',
          leadInterests: dto?.leadInterests || [],
          extras: extrasPayload,
        };
        // 3. Send to project MS
        return this.client
          .send({ cmd: CAMBODIA_JOBS.BENEFICIARY.CREATE, uuid }, cambodiaPayload)
          .pipe(
            timeout(MS_TIMEOUT),
            tap((response) => {
              // 4. Update status and addToProject
              return this.addToProjectAndUpdate({
                projectId: uuid,
                beneficiaryId: response.uuid,
                importId: row.uuid,
              });
            })
          );
      })
    );
  }


  // TODO: fix cambodia specific country code
  async importKoboBeneficiary(uuid: UUID, data: any) {
    const benef: any = this.mapKoboFields(data);
    if (benef.type) benef.type = benef.type.toUpperCase();
    if (benef.type !== 'LEAD') benef.phone = genRandomPhone('88');
    if (!benef.phone) throw new Error('Phone number is required!');

    if (benef.gender) benef.gender = benef.gender.toUpperCase();
    if (benef.age) benef.age = parseInt(benef.age);
    if (benef.leadInterests) {
      benef.leadInterests = benef.leadInterests
        .split(' ')
        .map((item: string) => item.trim().toUpperCase());
    }
    console.log({ NODE_ENV })
    if (NODE_ENV === 'production') {
      benef.phone = `${CAMBODIA_COUNTRY_CODE}${benef.phone}`;
    } else benef.phone = `+${benef.phone}`;
    console.log("Beneficiary Phone", benef.phone);

    const { piiData, type, ...rest } = createExtrasAndPIIData(benef);
    const extrasPayload = {
      meta: benef.meta,
      occupation: benef.occupation || 'UNKNOWN',
      province: benef.province || 'UNKNOWN',
      district: benef.district || 'UNKNOWN',
      commune: benef.commune || 'UNKNOWN',
      village: benef.village || 'UNKNOWN',
    }

    const koboPayload = {
      name: piiData.name,
      phone: piiData.phone,
      gender: benef.gender,
      age: benef.age,
      type: benef.type,
      leadInterests: benef.leadInterests,
      extras: extrasPayload
    }
    // 1. Save to Kobo Import Logs
    const row = await this.prisma.koboBeneficiary.create({
      data: koboPayload,
    });
    const piiExist = await this.checkPiiPhone(benef.phone);
    console.log({ piiExist });
    if (piiExist) {
      const discardedPayload = {
        ...piiData,
        age: benef.age,
        gender: benef.gender,
        extras: { ...extrasPayload, type: benef.type, leadInterests: benef.leadInterests },
      }
      return this.saveToDiscarded(uuid, discardedPayload);
    }
    // 2. Save to Beneficiary and PII
    return this.client.send({ cmd: BeneficiaryJobs.CREATE }, { piiData, ...rest }).pipe(
      timeout(MS_TIMEOUT),
      switchMap((response) => {
        const cambodiaPayload = {
          uuid: response.uuid,
          phone: benef.phone,
          walletAddress: response.walletAddress,
          type: benef?.type || 'UNKNOWN',
          leadInterests: benef?.leadInterests || [],
          extras: extrasPayload,
        };
        // 3. Send to project MS
        return this.client
          .send({ cmd: CAMBODIA_JOBS.BENEFICIARY.CREATE, uuid }, cambodiaPayload)
          .pipe(
            timeout(MS_TIMEOUT),
            tap((response) => {
              // 4. Update status and addToProject
              return this.addToProjectAndUpdate({
                projectId: uuid,
                beneficiaryId: response.uuid,
                importId: row.uuid,
              });
            })
          );
      })
    );
  }

  async saveToDiscarded(uuid: string, discardedPayload: any) {
    return this.client
      .send(
        { cmd: CAMBODIA_JOBS.BENEFICIARY.CREATE_DISCARDED, uuid },
        discardedPayload
      )
      .pipe(timeout(MS_TIMEOUT));
  }

  async addToProjectAndUpdate({ projectId, beneficiaryId, importId }) {
    const beneficiaryExists = await this.prisma.beneficiary.findUnique({
      where: { uuid: beneficiaryId },
    });
    if (beneficiaryExists) {
      await this.updateImportStatus(importId, KoboBeneficiaryStatus.SUCCESS);

      return this.prisma.beneficiaryProject.create({
        data: {
          beneficiaryId: beneficiaryId,
          projectId: projectId,
        },
      });
    }

  }

  async updateImportStatus(uuid: string, status: KoboBeneficiaryStatus) {
    return this.prisma.koboBeneficiary.update({
      where: {
        uuid: uuid,
      },
      data: {
        status,
      },
    });
  }

  async checkPiiPhone(phone: string) {
    return this.prisma.beneficiaryPii.findUnique({
      where: {
        phone,
      },
    });
  }

  mapKoboFields(payload: any) {
    const mappedPayload = {};
    const meta = {};

    for (const key in payload) {
      if (KOBO_FIELD_MAPPINGS[key]) {
        mappedPayload[KOBO_FIELD_MAPPINGS[key]] = payload[key];
      } else {
        meta[key] = payload[key];
      }
    }
    return { ...mappedPayload, meta };
  }

  async sendTestMsg(uuid: UUID) {
    console.log({ uuid });
    return this.client
      .send({ cmd: 'rahat.jobs.test', uuid }, { msg: 'This is test msg!' })
      .pipe(timeout(MS_TIMEOUT));
  }
}
