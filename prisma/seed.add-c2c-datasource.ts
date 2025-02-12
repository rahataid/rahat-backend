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

const projectStats = (url: string, uuid: string) => {
  return {
    dataSources: {
      source2: {
        type: 'url',
        args: {
          url: `${url}/v1/beneficiaries/stats`,
        },
        data: [], // Placeholder for actual data
      },
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
              action: 'rpProject.reporting.list',
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
            type: "pie",
            props: {},
            title: "Gender",
            colSpan: 1,
            dataMap: `BENEFICIARY_GENDER`,
            dataSrc: "source2",
            rowSpan: 1
          },
          {
            type: "pie",
            props: {},
            title: "Age",
            colSpan: 1,
            dataMap: `BENEFICIARY_AGE_RANGE`,
            dataSrc: "source2",
            rowSpa: 1
          },
          {
            type: "pie",
            props: {},
            title: "Disburse Methods",
            colSpan: 1,
            dataMap: `DISBURSEMENT_TOTAL`,
            dataSrc: "source3",
            rowSpan: 4
          }

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
            name: `DATA_SOURCE`,
            data: projectStats(url, projectUUID),
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
  });
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
