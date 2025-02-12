import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import * as readline from 'readline';

const prisma = new PrismaService();
const prismaClient = new PrismaClient();

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const projectStats = (url: string) => {
  return {
    dataSources: {
      source2: {
        type: 'url',
        args: {
          url: `${url}/v1/beneficiaries/stats`,
        },
        data: [], // Placeholder for actual data
      },
    },
    ui: [
      {
        fields: [
          {
            type: 'dataCard',
            props: {},
            title: 'Total Beneficiaries',
            colSpan: 1,
            dataMap: `BENEFICIARY_TOTAL`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'UsersRound',
          },

        ],
      },
      {
        fields: [
          {
            type: 'donut',
            props: {},
            title: 'Total Beneficiaries',
            colSpan: 1,
            dataMap: `BENEFICIARY_GENDER`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
          {
            type: 'donut',
            props: {},
            title: 'Household Phone Availability',
            colSpan: 1,
            dataMap: `BENEFICIARY_PHONE_AVAILABILITY_STATS`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
          {
            type: 'donut',
            props: {},
            title: 'Household Bank Status',
            colSpan: 1,
            dataMap: `BENEFICIARY_BANKEDSTATUS`,
            dataSrc: 'source2',
            rowSpan: 1,
          },

        ],
      },
      {
        title: '',
        fields: [

          {
            type: 'donut',
            props: {},
            title: 'Type of Phone',
            colSpan: 1,
            dataMap: `BENEFICIARY_PHONESTATUS`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
        ],
      },
      {
        title: 'Beneficiaries GPS Location',
        fields: [
          {
            type: 'map',
            props: {},
            title: '',
            colSpan: 3,
            dataMap: `BENEFICIARY_MAP_STATS`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
        ],
      },
    ],
  };
};

const main = async () => {
  rl.question('Enter URL: ', async (url) => {
    try {
      await prismaClient.stats.create({
        data: {
          name: `DASHBOARD_SOURCE`,
          data: projectStats(url),
          group: `source`,
        },
      });
      console.log('Stats created successfully');
    } catch (error) {
      console.error('Error creating stats:', error);
    } finally {
      rl.close();
      await prisma.$disconnect();
    }
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
