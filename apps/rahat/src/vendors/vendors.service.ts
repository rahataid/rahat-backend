import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
// import * as jwt from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  GetVendorOtp,
  VendorAddToProjectDto,
  VendorRegisterDto,
} from '@rahataid/extensions';
import { ProjectContants, UserRoles, VendorJobs } from '@rahataid/sdk';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { CONSTANTS } from '@rumsan/sdk/constants/index';
import { Service } from '@rumsan/sdk/enums';
import { AuthsService, UsersService } from '@rumsan/user';
import { decryptChallenge } from '@rumsan/user/lib/utils/challenge.utils';
import { getSecret } from '@rumsan/user/lib/utils/config.utils';
import { getServiceTypeByAddress } from '@rumsan/user/lib/utils/service.utils';
import { UUID } from 'crypto';
import { Address, isAddress } from 'viem';
import { handleMicroserviceCall } from './handleMicroServiceCall.util';

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
    const vendor = await this.prisma.$transaction(async (prisma) => {
      const role = await prisma.role.findFirst({
        where: { name: UserRoles.VENDOR },
      });
      if (!role) throw new Error('Role not found');
      // Add to User table
      const { service, ...rest } = dto;
      if (dto?.email || dto?.phone) {
        const userData = await prisma.user.findFirst({
          where: {
            OR: [{ email: dto.email }, { phone: dto.phone }],
          },
        });

        if (userData) {
          if (userData?.email === dto.email)
            throw new Error('Email must be unique');
          if (userData?.phone === dto.phone)
            throw new Error('Phone Number must be unique');
        }
      }

      const user = await prisma.user.create({ data: rest });
      // Add to UserRole table
      const userRolePayload = { userId: user.id, roleId: role.id };
      await prisma.userRole.create({ data: userRolePayload });
      // Add to Auth table
      await prisma.auth.create({
        data: {
          userId: +user.id,
          service: dto.service as any,
          serviceId: dto[service.toLocaleLowerCase()],
          details: dto.extras,
        },
      });
      if (dto.service === Service.WALLET) return user;
      await prisma.auth.create({
        data: {
          userId: +user.id,
          service: Service.WALLET,
          serviceId: dto.wallet,
          details: dto.extras,
        },
      });
      return user;
    });

    console.log(vendor);
    return vendor;
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

    if (assigned)
      throw new RpcException(
        new BadRequestException('Vendor already assigned to the project!')
      );
    // //2. Save vendor to project
    // await this.prisma.projectVendors.create({
    //   data: {
    //     projectId,
    //     vendorId: vendorId,
    //   },
    // });

    const response = await handleMicroserviceCall({
      client: this.client.send(
        {
          cmd: VendorJobs.ADD_TO_PROJECT,
          uuid: projectId,
        },
        {
          ...projectPayload,
          vendor: vendorUser || null,
        }
      ),
      onSuccess: async (projectResponse) => {
        const createRes = await this.prisma.projectVendors.create({
          data: {
            projectId,
            vendorId,
            extras: {
              projectVendorIdentifier: projectResponse.id,
            },
          },
        });
        console.log('Vendor successfully assigned to the project:', createRes);
      },
      onError: (error) => {
        console.error('Error syncing vendor to project:', error);
      },
    });

    await handleMicroserviceCall({
      client: this.client.send(
        { cmd: 'rahat.jobs.projects.calculate_stats' },
        {
          projectUUID: projectId,
        }
      ),
      onSuccess(response) {
        console.log('Microservice response', response);
        return response;
      },
      onError(error) {
        throw new RpcException('Microservice call failed: ' + error.message);
      },
    });

    return response;
  }

  async getVendorAssignedToProject(vendorId: string, projectId: string) {
    return this.prisma.projectVendors.findUnique({
      where: { projectVendorIdentifier: { vendorId, projectId } },
      include: {
        User: true,
      },
    });
  }

  async getVendorCount() {
    return this.prisma.userRole.count({
      where: {
        Role: {
          name: UserRoles.VENDOR,
        },
      },
    });
  }

  async getVendor(id: UUID | Address) {
    const data = isAddress(id)
      ? await this.prisma.user.findFirst({ where: { wallet: id } })
      : await this.prisma.user.findUnique({ where: { uuid: id } });
    const projectData = await this.prisma.projectVendors.findMany({
      where: { vendorId: data.uuid },
      include: {
        Project: true,
      },
    });
    const vendorIdentifier = projectData[0]?.extras;
    const projects = projectData.map((project) => project.Project);
    const userdata = { ...data, projects, vendorIdentifier };
    return userdata;
  }

  async listVendor(dto) {
    return paginate(
      this.prisma.userRole,
      {
        where: {
          Role: {
            name: UserRoles.VENDOR,
          },
          User: {
            deletedAt: null,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      {
        page: dto.page,
        perPage: dto.perPage,
      }
    );
  }

  async listProjectVendor(dto) {
    const { projectId } = dto;
    const q = {
      projectId,
      deletedAt: null,
    };
    if (dto.name) {
      q['User'] = {
        name: {
          contains: dto.name,
          mode: 'insensitive',
        },
      };
    }

    const venData = await this.prisma.projectVendors.findMany({
      where: q,
      include: {
        Project: true,
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // return venData
    return this.client.send(
      {
        cmd: VendorJobs.LIST,
        uuid: projectId,
      },

      venData
    );
  }

  async listRedemptionVendor(data) {
    const uuids = data.data.map((item) => item.vendorId);
    const vendorData = await this.prisma.user.findMany({
      where: {
        uuid: {
          in: uuids,
        },
      },
    });
    const combinedData = data.data.map((item) => {
      const matchedData = vendorData.find(
        (vendor) => vendor.uuid === item.vendorId
      );
      return {
        ...item,
        Vendor: {
          ...item.Vendor,
          ...matchedData,
        },
      };
    });
    return { data: combinedData, meta: data.meta };
  }

  async getOtp(dto: GetVendorOtp, rdetails) {
    return this.authService.getOtp(dto, rdetails);
  }

  async verifyOtp(dto, rdetails) {
    const res = await this.authService.loginByOtp(dto, rdetails);
    console.log(res);
    if (res.accessToken) {
      return this.getUserDetails(dto);
    }
  }

  async getUserDetails(dto) {
    const challengeData = decryptChallenge(
      getSecret(),
      dto.challenge,
      CONSTANTS.CLIENT_TOKEN_LIFETIME
    );
    if (!challengeData.address)
      throw new ForbiddenException('Invalid credentials in challenge!');
    if (!dto.service) {
      dto.service = getServiceTypeByAddress(challengeData.address) as Service;
    }
    const auth = await this.authService.getByServiceId(
      challengeData.address,
      dto.service as Service
    );

    const user = await this.authService.getUserById(auth.userId);
    return user;
  }

  async updateVendor(dto, uuid) {
    if (dto?.email) {
      const userData = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { uuid } },
      });
      if (userData) throw new Error('Email must be unique');
    }
    if (dto.extras) {
      const user = await this.prisma.user.findUnique({
        where: {
          uuid,
        },
      });
      const extras = dto?.extras;
      const userExtras = Object(user?.extras || {});

      dto.extras = { ...extras, ...userExtras };
    }
    const result = await this.usersService.update(uuid, dto);
    const isAssigned = await this.prisma.projectVendors.findFirst({
      where: {
        vendorId: uuid,
      },
    });
    if (!isAssigned) return result;

    await this.prisma.projectVendors.updateMany({
      where: {
        vendorId: uuid,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return this.client.send({ cmd: VendorJobs.UPDATE }, result);
  }

  async removeVendor(uuid: UUID, projectId?: UUID) {
    const isVendor = await this.prisma.user.findFirst({
      where: {
        uuid,
      },
    });
    if (!isVendor) throw new Error('Data not Found');

    if (!projectId) {
      const result = await this.usersService.delete(uuid);
      return result;
    }

    const isProjectVendor = await this.prisma.projectVendors.findFirst({
      where: {
        projectId: projectId,
        vendorId: uuid,
      },
    });

    if (!isProjectVendor) throw new Error('Project vendor not found');

    await this.prisma.projectVendors.deleteMany({
      where: {
        projectId: projectId,
        vendorId: uuid,
      },
    });

    return this.client.send({ cmd: VendorJobs.REMOVE }, uuid);
  }

  async getVendorClaimStats(dto) {
    const { projectId } = dto;
    const projectVendors = await this.prisma.projectVendors.findMany({
      where: {
        projectId,
      },
      select: {
        User: true,
      },
    });
    return this.client.send(
      { cmd: VendorJobs.GET_VENDOR_STATS, uuid: projectId },
      projectVendors
    );
  }

  async getVendorByUuid(dto: { projectId: string; vendorId: string }) {
    return this.prisma.projectVendors.findUnique({
      where: {
        projectVendorIdentifier: dto,
      },
      include: {
        User: true,
      },
    });
  }
}
