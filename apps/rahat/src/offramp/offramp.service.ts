// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfframpProviderDto, CreateOfframpRequestDto, ListOfframpProviderDto, ListOfframpRequestDto, ProviderActionDto } from '@rahataid/extensions';
import { PaginatorTypes, PrismaService, paginator } from "@rumsan/prisma";
import { KotaniPayService } from './offrampProviders/kotaniPay.service';


const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class OfframpService {
  constructor(
    private prisma: PrismaService,
    private kotaniPayService: KotaniPayService
  ) { }

  registerProvider(createOfframpDto: CreateOfframpProviderDto) {
    console.log({ createOfframpDto });
    return this.prisma.offrampProvider.create({
      data: createOfframpDto
    })
  }

  listProviders(query?: ListOfframpProviderDto) {
    const where = {
      deletedAt: null
    }
    return paginate(this.prisma.offrampProvider, {
      where,
      select: {
        id: true,
        uuid: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        extras: true
      }
    }, {
      page: query.page || 1,
      perPage: query.perPage || 10,
    });
  }
  getProviderById(uuid: string) {
    return this.prisma.offrampProvider.findUnique({
      where: {
        uuid
      }
    });
  }

  async providerActions(data: ProviderActionDto) {
    console.log({ data });

    const offrampProvider = await this.getProviderById(data.uuid);
    if (!offrampProvider) {
      throw new BadRequestException('Offramp provider not found');
    }

    if (offrampProvider.name === 'Kotani Pay') {
      const action = this.kotaniPayService.kotaniPayActions[data.action];
      if (action) {
        return action(data);
      }
    }

    // Handle other providers here

    return {
      success: false,
      message: "Action not found",
      error_code: 404
    };
  }

  async createOfframpRequest(createOfframpData: CreateOfframpRequestDto) {
    console.log({ createOfframpData });
    const { providerUuid, ...offrampRequestData } = createOfframpData;
    const { data: kotaniPayResponse } = await this.kotaniPayService.createOfframpRequest(providerUuid, offrampRequestData);
    return this.prisma.offrampRequest.create({
      data: { ...offrampRequestData, requestId: kotaniPayResponse?.data.request_id, escrowAddress: kotaniPayResponse?.data.escrow_address }
    })
  }

  //TODO: Geenralize the offramp request execution
  async executeOfframpRequest(executeOfframpData: any) {
    console.log({ executeOfframpData });
    const { providerUuid, requestUuid, ...data } = executeOfframpData;
    const request = await this.prisma.offrampRequest.findUniqueOrThrow({
      where: {
        uuid: requestUuid
      }
    });
    console.log('reference', request)
    if (!request) {
      throw new BadRequestException('Offramp request not found');
    }
    // const executionData = {
    //   chain: data.data.chain,
    //   token: data.data.token,
    //   transaction_hash: data.data.transaction_hash,
    //   wallet_id: data.data.wallet_id,
    //   request_id: data.data.request_id,
    //   customer_key: data.data.customer_key,
    //   preview: true
    // }
    // const v = {
    //   "mobileMoneyReceiver": {
    //     "networkProvider": "MTN",
    //     "phoneNumber": "+233542851111",
    //     "accountName": "Patrick Oduro"
    //   },
    //   "currency": "KES",
    //   "chain": "BASE",
    //   "token": "USDC",
    //   "cryptoAmount": 1,
    //   "referenceId": "123456",
    //   "senderAddress": "0TQdKsMayR5xcEKrE6jDixUQ74xtTEA9euo"
    // }

    const executionData = {
      mobileMoneyReceiver: data.data.mobileMoneyReceiver,
      senderAddress: data.data.senderAddress,
      chain: data.data.chain,
      token: data.data.token,
      cryptoAmount: +data.data.cryptoAmount,
      currency: data.data.currency,
      referenceId: request.requestId
    }
    console.log(JSON.stringify(executionData, null, 2));
    try {
      const { data: kotaniPayResponse } = await this.kotaniPayService.executeOfframpRequest(providerUuid, executionData)

      const transaction = await this.prisma.offrampTransaction.create({
        data: {
          txHash: data.data.transaction_hash || '',
          chain: data.data.chain,
          token: data.data.token,
          walletId: data.data.wallet_id,
          customerKey: data.data.customer_key,
          referenceId: executionData.referenceId,
          offrampRequest: {
            connect: { id: request.id }
          }
        }
      });

      return { transaction, kotaniPayResponse };
    } catch (error) {
      console.log(error.response);
      throw new BadRequestException(error.response.message);

    }


    // const { data: kotaniPayResponse } = await this.kotaniPayService.executeOfframpRequest(providerUuid, offrampRequestData);
    // return this.prisma.offrampRequest.update({
    //   where: { id: offrampRequestData.id },
    //   data: { ...offrampRequestData, transactionHash: kotaniPayResponse?.data.transaction_hash }
    // })
  }

  findAllOfframpRequests(query?: ListOfframpRequestDto) {
    const where = {
      deletedAt: null
    };

    return paginate(this.prisma.offrampRequest, {
      where
    }, {
      page: query?.page || 1,
      perPage: query?.perPage || 10,
    });
  }

  findOne(payload: {
    uuid?: string;
    id?: number;
    requestId?: string;
  }) {
    if (payload.uuid) {
      return this.prisma.offrampRequest.findUniqueOrThrow({
        where: { uuid: payload.uuid }
      });
    }
    if (payload.id) {
      return this.prisma.offrampRequest.findUniqueOrThrow({
        where: { id: payload.id }
      });
    }
    if (payload.requestId) {
      return this.prisma.offrampRequest.findUniqueOrThrow({
        where: { requestId: payload.requestId }
      });
    }
    throw new BadRequestException('Must provide either uuid, id or requestId');
  }

  update(id: number, updateOfframpDto: any) {
    return `This action updates a #${id} offramp`;
  }

  remove(id: number) {
    return `This action removes a #${id} offramp`;
  }
}
