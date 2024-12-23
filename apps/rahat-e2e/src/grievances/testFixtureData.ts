import * as dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker';
// import { GrievanceType, GrievanceStatus } from ;
import { randomUUID } from 'crypto';
import { GrievanceStatus, GrievanceType } from '@prisma/client';

export const grievanceData = {
    projectId: process.env.PROJECT_ID,
    reporterContact: faker.phone.number(),
    title: faker.internet.domainWord(),
    description: faker.lorem.lines(),
    type: faker.helpers.enumValue(GrievanceType),
    status: faker.helpers.enumValue(GrievanceStatus),
    reportedBy: faker.person.fullName()
};

export const errorGrievance = {
    reporterContact: faker.phone.number(),
    title: faker.internet.domainWord(),
    description: faker.lorem.lines(),
    type: faker.helpers.enumValue(GrievanceType),
    status: faker.helpers.enumValue(GrievanceStatus),
    reportedBy: faker.person.fullName()
};

export const grievanceQuery = {
    sort: 'createdAt',
    order: 'asc',
    page: 1,
    perPage: 10,
    projectId: process.env.PROJECT_ID
};

export const errorGrievanceQuery = {
    sort: 'createdAt',
    order: 'asc',
    page: 1,
    perPage: 10,
    projectId: randomUUID()
};

