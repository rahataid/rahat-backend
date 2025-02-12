import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaService();
const prismaClient = new PrismaClient();

const data = {
  URL: '',
  APP_ID: '',
};

const main = async () => {
  await prismaClient.setting.create({
    data: {
      value: data as object,
      isPrivate: false,
      isReadOnly: false,
      name: 'COMMUNICATION',
      dataType: 'OBJECT',

      requiredFields: ['URL', 'APP_ID'],
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
