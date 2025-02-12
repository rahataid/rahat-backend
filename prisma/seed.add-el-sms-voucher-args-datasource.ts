import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';

const prisma = new PrismaService();
const prismaClient = new PrismaClient();



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
    },
    ui: [
      {
        fields: [
          {
            type: 'dataCard',
            props: {},
            title: 'Total Consumers',
            colSpan: 1,
            dataMap: `BENEFICIARY_TOTAL_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'UsersRound',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Vendors',
            colSpan: 1,
            dataMap: `VENDOR_TOTAL_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'HousePlus',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Vouchers',
            colSpan: 1,
            dataMap: `VOUCHER_TOTAL_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'Ticket',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Redeemed Vouchers',
            colSpan: 1,
            dataMap: `TOTAL_REDEMPTION_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'Ticket',
          },
          {
            type: 'dataCard',
            props: {},
            title: 'Total Reimbursed Vouchers',
            colSpan: 1,
            dataMap: `TOTAL_APPROVED_REIMBURSEMENT_ID_${uuid}`,
            dataSrc: 'source2',
            rowSpan: 1,
            icon: 'Ticket',
          }
        ],
      },
      {
        fields: [
          {
            type: 'donut',
            props: {},
            title: 'Total Consumers',
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
  // Get command-line arguments
  const [, , projectUUID, url] = process.argv;

  if (!projectUUID || !url) {
    console.error('Usage: node script.js <projectUUID> <url>');
    process.exit(1);
  }

  try {
    await prismaClient.stats.create({
      data: {
        name: `DASHBOARD_SOURCE_${projectUUID}`,
        data: projectStats(projectUUID, url),
        group: `source_${projectUUID}`
      }
    });
    console.log('Stats created successfully');
  } catch (error) {
    console.error('Error creating stats:', error);
  } finally {
    await prisma.$disconnect();
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
