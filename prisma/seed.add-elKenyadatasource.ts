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
      source2: {
        type: 'url',
        args: {
          url: `${url}/v1/projects/${uuid}/stats`,
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
            type: 'dataCard',
            props: {},
            title: 'Total Beneficiaries',
            colSpan: 1,
            dataMap: `BENEFICIARY_TOTAL_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'UsersRound',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Vision Centers/Hospitals',
            colSpan: 1,
            dataMap: `VENDOR_TOTAL_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'HousePlus',
          },
        ],
      },
      {
        fields: [
          {
            type: 'dataCard',
            props: {},
            title: 'Total Voucher Assigned',
            colSpan: 1,
            dataMap: `TOTAL_VOUCHER_ASSIGNED_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'Ticket',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Beneficiary Vouchers Redeemed',
            colSpan: 1,
            dataMap: `TOTAL_REDEMPTION_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'Ticket',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Vendor Vouchers Claimed',
            colSpan: 1,
            dataMap: `TOTAL_APPROVED_REIMBURSEMENT_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'Ticket',
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
            dataMap: `BENEFICIARY_TYPE_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
          {
            type: 'donut',
            props: {},
            title: 'Total Vouchers',
            colSpan: 1,
            dataMap: `TOTAL_VOUCHER_REDEEM_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
          {
            type: 'donut',
            props: {},
            title: 'Total Redeemed Vouchers',
            colSpan: 1,
            dataMap: `REDEMPTION_STATS_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
          },
          {
            type: 'donut',
            props: {},
            title: 'Total Reimbursement',
            colSpan: 1,
            dataMap: `REIMBURSEMENT_STATS_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
          },

        ],
      },
      {
        fields: [
          {
            type: 'line',
            props: {},
            title: 'No. of Redemptions/per week',
            colSpan: 1,
            dataMap: ``,
            dataSrc: 'source2',
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
