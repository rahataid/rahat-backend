import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ChangeGrievanceStatusDTO, CreateGrievanceDTO, ListGrievanceDTO } from "@rahataid/extensions";
import { GrievanceStatus } from "@rahataid/sdk";
import { PaginatorTypes, PrismaService, paginator } from "@rumsan/prisma";


const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class GrievanceService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async createGrievance(data: CreateGrievanceDTO, userId: number) {
    const { projectId, ...rest } = data;
    return this.prisma.grievance.create({
      data: {
        ...rest,
        project: {
          connect: {
            uuid: projectId
          }
        },
        reporterUser: {
          connect: {
            id: userId
          }
        },
        status: GrievanceStatus.NEW
      }
    })
  }

  async findAll(query: ListGrievanceDTO) {
    const include: Prisma.GrievanceInclude = {
      project: {
        select: {
          name: true,
          uuid: true
        }
      },
      reporterUser: {
        select: {
          name: true,
          uuid: true,
          id: true
        }
      }
    }
    const where: Prisma.GrievanceWhereInput = {
      deletedAt: null
    }

    if (query.projectId) {
      where.projectId = {
        equals: query.projectId
      }
    }

    if (query.title) {
      where.title = {
        contains: query.title,
        mode: 'insensitive'
      }
    }

    return paginate(this.prisma.grievance, {
      include,
      where,
      orderBy: {
        createdAt: 'desc'
      }
    }, {
      page: query.page,
      perPage: query.perPage,
    });
  }

  async changeStatus(uuid: string, data: ChangeGrievanceStatusDTO) {
    const { status } = data;
    return this.prisma.grievance.update({
      where: {
        uuid
      },
      data: {
        status
      }
    })
  }

  async getGrievance(uuid: string) {
    return this.prisma.grievance.findUnique({
      where: {
        uuid
      },
      include: {
        project: {
          select: {
            name: true,
            uuid: true
          }
        },
        reporterUser: {
          select: {
            name: true,
            uuid: true,
            id: true
          }
        }
      }
    })
  }

  async softDelete(uuid: string) {
    return this.prisma.grievance.update({
      where: {
        uuid
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

}
