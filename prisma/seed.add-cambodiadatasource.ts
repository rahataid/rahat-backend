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

const projectStats = (uuid: string, url: string) => {
  return {
    dataSources: {

      source3: {
        type: 'url',
        args: {
          url: `${url}/v1/projects/${uuid}/actions`,
          apiCallData: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'cambodia.app.stats',
              payload: {},
            }),
          },
        },
        data: [], // Placeholder for actual data
      },
    },
    ui: [
      {
        fields: [
          {
            icon: 'UsersRound',
            type: 'dataCard',
            props: {},
            title: 'Total Wearers',
            colSpan: 1,
            dataMap: 'TOTAL_CONSUMERS',
            dataSrc: 'source3',
            rowSpan: 1,
          },
          {
            icon: 'HousePlus',
            type: 'dataCard',
            props: {},
            title: 'Total Villagers Referred',
            colSpan: 1,
            dataMap: 'TOTAL_LEADS',
            dataSrc: 'source3',
            rowSpan: 1,
          },
          {
            icon: 'HousePlus',
            type: 'dataCard',
            props: {},
            title: 'Total Eye Checkup in VC',
            colSpan: 1,
            dataMap: 'TOTAL_LEAD_CONVERTED',
            dataSrc: 'source3',
            rowSpan: 1,
          },
        ],
      },

      {
        fields: [
          {
            icon: 'UsersRound',
            type: 'dataCard',
            props: {},
            title: 'Total Health Workers',
            colSpan: 1,
            dataMap: 'TOTAL_HEALTH_WORKERS',
            dataSrc: 'source3',
            rowSpan: 1,
          },
          {
            icon: 'Ticket',
            type: 'dataCard',
            props: {},
            title: 'Total Vision Centers',
            colSpan: 1,
            dataMap: 'TOTAL_VENDORS',
            dataSrc: 'source3',
            rowSpan: 1,
          },
          {
            icon: 'Ticket',
            type: 'dataCard',
            props: {},
            title: 'Total Eyewear Dispensed in VC',
            colSpan: 1,
            dataMap: 'TOTAL_EYEWEAR_DISPENSED',
            dataSrc: 'source3',
            rowSpan: 1,
          },
        ],
      },
      {
        fields: [
          {
            type: 'donut',
            props: {},
            title: 'Consumer Type',
            colSpan: 1,
            dataMap: `CONSUMER_TYPE`,
            dataSrc: 'source3',
            rowSpan: 1,
          },
          {
            type: 'donut',
            props: {},
            title: 'Conversion Type',
            colSpan: 1,
            dataMap: `CONVERSION_TYPE`,
            dataSrc: 'source3',
            rowSpan: 1,
          },
        ],
      },

    ],
  };
};

const main = async () => {
  rl.question('Enter project UUID: ', (projectUUID) => {
    rl.question('Enter URL: ', async (url) => {
      try {
        await prismaClient.stats.create({
          data: {
            name: `DASHBOARD_SOURCE_${projectUUID}`,
            data: projectStats(projectUUID, url),
            group: `source_${projectUUID}`,
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
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
