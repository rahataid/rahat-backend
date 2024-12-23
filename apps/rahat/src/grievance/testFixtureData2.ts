import { faker } from "@faker-js/faker";
import { CreateGrievanceDTO, ListGrievanceDTO } from "@rahataid/extensions";
import { GrievanceStatus, GrievanceType } from "@rahataid/sdk";

export const createGrievanceDTO: CreateGrievanceDTO = {
    projectId: process.env.PROJECT_ID,
    title: faker.internet.domainWord(),
    description: faker.lorem.lines(),
    reporterContact: faker.phone.number(),
    type: GrievanceType.TECHNICAL,
    reportedBy: faker.person.fullName(),
    status: GrievanceStatus.NEW
};

export const userId = 1;

export const expectedGrievance = {
    id: 1,
    ...createGrievanceDTO,
    reporterUserId: userId,
    status: GrievanceStatus.NEW,
};

export const updatedGrievance = {
  id: 1,
  uuid: process.env.GRIEVANCE_UUID,
  reportedBy: faker.person.fullName(),
  reporterUserId: userId,
  reporterContact: faker.phone.number(),
  title: faker.internet.domainWord(),
  type: GrievanceType.TECHNICAL,
  projectId: process.env.PROJECT_ID,
  description: faker.lorem.lines(),
  status: GrievanceStatus.UNDER_REVIEW,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

export const deletedGrievance = {
  id: 1,
  uuid: process.env.GRIEVANCE_UUID,
  reportedBy: faker.person.fullName(),
  reporterUserId: userId,
  reporterContact: faker.phone.number(),
  title: faker.internet.domainWord(),
  type: GrievanceType.TECHNICAL,
  projectId: process.env.PROJECT_ID,
  description: faker.lorem.lines(),
  status: GrievanceStatus.UNDER_REVIEW,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date()
};

export const grievanceQuery: ListGrievanceDTO = {
  sort: 'createAt',
  order: 'asc',
  page: 1,
  perPage: 20,
  projectId: process.env.PROJECT_ID
};

export const grievancesList = [
  {
    id: 1,
    uuid: process.env.GRIEVANCE_UUID,
    reportedBy: faker.person.fullName(),
    reporterUserId: 1,
    reporterContact: faker.phone.number(),
    title: faker.internet.domainWord(),
    type: GrievanceType.TECHNICAL,
    projectId: process.env.PROJECT_ID,
    description: faker.lorem.lines(),
    status: GrievanceStatus.NEW,
    createdAt: new Date("2024-08-21T15:54:32.779Z"),
    updatedAt: new Date("2024-08-21T15:54:32.779Z"),
    deletedAt: null,
    project: {
      name: faker.internet.domainWord(),
      uuid: process.env.PROJECT_ID
    },
    reporterUser: {
      name: process.env.NAME,
      uuid: process.env.UUID,
      id: 1
    }
  },
  {
    id: 2,
    uuid: process.env.GRIEVANCE_UUID,
    reportedBy: faker.person.fullName(),
    reporterUserId: 1,
    reporterContact: faker.phone.number(),
    title: faker.internet.domainWord(),
    type: GrievanceType.TECHNICAL,
    projectId: process.env.PROJECT_ID,
    description: faker.lorem.lines(),
    status: GrievanceStatus.NEW,
    createdAt: new Date("2024-08-21T15:54:32.779Z"),
    updatedAt: new Date("2024-08-21T15:54:32.779Z"),
    deletedAt: null,
    project: {
      name: faker.internet.domainWord(),
      uuid: process.env.PROJECT_ID
    },
    reporterUser: {
      name: process.env.NAME,
      uuid: process.env.UUID,
      id: 1
    }
  }
];