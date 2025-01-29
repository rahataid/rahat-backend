// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
// import * as jwt from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { VendorAddToProjectDto, VendorRegisterDto } from '@rahataid/extensions';
import { ProjectContants, UserRoles, VendorJobs } from '@rahataid/sdk';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { CONSTANTS } from '@rumsan/sdk/constants/index';
import { Service } from '@rumsan/sdk/enums';
import { AuthsService, UsersService } from '@rumsan/user';
import { decryptChallenge } from '@rumsan/user/lib/utils/challenge.utils';
import { getSecret } from '@rumsan/user/lib/utils/config.utils';
import { getServiceTypeByAddress } from '@rumsan/user/lib/utils/service.utils';
import { isAddress } from 'viem';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class VendorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthsService,
    private readonly usersService: UsersService,
    @Inject(ProjectContants.ELClient) private readonly client: ClientProxy
  ) { }

  //TODO: Fix allow duplicate users?
  async registerVendor(dto: VendorRegisterDto) {
    const role = await this.prisma.role.findFirst({
      where: { name: UserRoles.VENDOR },
    });
    if (!role) throw new Error('Role not found');
    // Add to User table
    const { service, ...rest } = dto;
    if (dto?.email) {
      const userData = await this.prisma.user.findFirst({
        where: { email: dto.email }
      })
      if (userData) throw new Error("Email must be unique");
    }
    const user = await this.prisma.user.create({ data: rest });
    // Add to UserRole table
    const userRolePayload = { userId: user.id, roleId: role.id };
    await this.prisma.userRole.create({ data: userRolePayload });
    // Add to Auth table
    await this.prisma.auth.create({
      data: {
        userId: +user.id,
        service: dto.service as any,
        serviceId: dto[service.toLocaleLowerCase()],
        details: dto.extras,
      },
    });
    return user;
  }

  async assignToProject(dto: VendorAddToProjectDto) {
    const { vendorId, projectId } = dto;
    const vendorUser = await this.prisma.user.findUnique({
      where: { uuid: vendorId },
    });
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: vendorUser.id },
      include: {
        Role: {
          select: { name: true },
        },
      },
    });
    const isVendor = userRoles.some(
      (userRole) => userRole.Role.name === UserRoles.VENDOR
    );
    if (!isVendor) throw new Error('Not a vendor');
    const projectPayload = {
      uuid: vendorId,
      walletAddress: vendorUser.wallet,
    };

    const assigned = await this.getVendorAssignedToProject(vendorId, projectId);

    console.log('first', {
      assigned,
      vendorId,
      projectId,
      projectPayload,
    })
    // if (assigned)
    //   throw new RpcException(
    //     new BadRequestException('Vendor already assigned to the project!')
    //   );
    // //2. Save vendor to project
    // await this.prisma.projectVendors.create({
    //   data: {
    //     projectId,
    //     vendorId: vendorId,
    //   },
    // });

    // //3. sync vendor to Project
    // return this.client.send(
    //   {
    //     cmd: VendorJobs.ADD_TO_PROJECT,
    //     uuid: projectId,
    //   },
    //   projectPayload
    // );
  }

  async getVendorAssignedToProject(vendorId: string, projectId: string) {
    return this.prisma.projectVendors.findUnique({
      where: { projectVendorIdentifier: { vendorId, projectId } },
    });
  }

  async getVendorCount() {
    return this.prisma.userRole.count({
      where: {
        Role: {
          name: UserRoles.VENDOR,
        },
      }
    })
  }

  async getVendor(dto) {
    const { id } = dto;

    const data = isAddress(id)
      ? await this.prisma.user.findFirst({ where: { wallet: id } })
      : await this.prisma.user.findUnique({ where: { uuid: id } });
    const projectData = await this.prisma.projectVendors.findMany({
      where: { vendorId: data.uuid },
      include: {
        Project: true,
      },
    });
    const projects = projectData.map((project) => project.Project);
    const userdata = { ...data, projects };
    return userdata;
  }

  async listVendor(dto) {
    return paginate(this.prisma.userRole, {
      where: {
        Role: {
          name: UserRoles.VENDOR,
        },
      },
      include: {
        User: {
          include: {
            VendorProject: {
              include: {
                Project: true,
              },
            },
          },
        },
      }
    },
      {
        page: dto.page,
        perPage: dto.perPage
      }
    );
  }

  async listProjectVendor(dto) {
    const { projectId } = dto;
    const venData = await this.prisma.projectVendors.findMany({
      where: {
        projectId,
      },
      include: {
        Project: true,
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return this.client.send({
      cmd: VendorJobs.LIST,
      uuid: projectId
    },
      venData)
  }

  async listRedemptionVendor(data) {
    const uuids = data.data.map((item) => item.vendorId);
    const vendorData = await this.prisma.user.findMany({
      where: {
        uuid: {
          in: uuids
        }
      }
    });
    const combinedData = data.data.map(item => {
      const matchedData = vendorData.find(vendor => vendor.uuid === item.vendorId);
      return {
        ...item,
        Vendor:
        {
          ...item.Vendor,
          ...matchedData
        }
      }
    });
    return { data: combinedData, meta: data.meta }

  }

  async getOtp(data) {
    console.log(data)
    return this.authService.getOtp(data.dto, data.rdetails)


  }

  async verifyOtp(data) {
    const { dto, rdetails } = data;
    const res = await this.authService.loginByOtp(data.dto, data.rdetails);
    console.log(res)
    if (res.accessToken) {
      return this.getUserDetails(dto)

    }

  }

  async getUserDetails(dto) {
    const challengeData = decryptChallenge(
      getSecret(),
      dto.challenge,
      CONSTANTS.CLIENT_TOKEN_LIFETIME,
    );
    if (!challengeData.address)
      throw new ForbiddenException('Invalid credentials in challenge!');
    if (!dto.service) {
      dto.service = getServiceTypeByAddress(challengeData.address) as Service;
    }
    const auth = await this.authService.getByServiceId(
      challengeData.address,
      dto.service as Service,
    );

    const user = await this.authService.getUserById(auth.userId)
    return user
  }

  async updateVendor(dto) {
    const { uuid, ...rest } = dto;
    if (dto?.email) {
      const userData = await this.prisma.user.findFirst({
        where: { email: dto.email }
      })
      if (userData) throw new Error("Email must be unique");
    }
    const result = await this.usersService.update(uuid, rest);
    return result;

  }

}

