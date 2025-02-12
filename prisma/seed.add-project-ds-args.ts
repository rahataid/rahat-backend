import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';

const prisma = new PrismaService();
const prismaClient = new PrismaClient();


const projectStats = (uuid: string, url: string) => {
  return {
    "dataSources": {
      "source2": {
        "type": "url",
        "args": {
          "url": `${url}/v1/projects/${uuid}/stats`
        },
        "data": [] // Placeholder for actual data
      }
    },
    "ui": [
      {
        title: '',
        fields: [
          {
            "type": "dataCard",
            "props": {},
            "title": "Banked Beneficiaries",
            "colSpan": 1,
            "dataMap": `BENEFICIARY_BANKEDSTATUS_ID_${uuid}.BANKED`,
            "dataSrc": "source2",
            "rowSpan": 1
          },
          {
            "type": "dataCard",
            "props": {},
            "title": "Total Females",
            "colSpan": 1,
            "dataMap": `BENEFICIARY_GENDER_ID_${uuid}.FEMALE`,
            "dataSrc": "source2",
            "rowSpan": 1
          },
          {
            "type": "dataCard",
            "props": {},
            "title": "Unbanked Beneficiaries",
            "colSpan": 1,
            "dataMap": `BENEFICIARY_BANKEDSTATUS_ID_${uuid}.UNBANKED`,
            "dataSrc": "source2",
            "rowSpan": 1
          }
        ]
      },
      {
        title: '',
        fields: [
          {
            "type": "pie",
            "props": {},
            "title": "Internet Status",
            "colSpan": 1,
            "dataMap": `BENEFICIARY_INTERNETSTATUS_ID_${uuid}`,
            "dataSrc": "source2",
            "rowSpan": 1
          },
          {
            "type": "pie",
            "props": {},
            "title": "Gender",
            "colSpan": 1,
            "dataMap": `BENEFICIARY_GENDER_ID_${uuid}`,
            "dataSrc": "source2",
            "rowSpan": 1
          },
          {
            "type": "bar",
            "props": {},
            "title": "Phone Status",
            "colSpan": 1,
            "dataMap": `BENEFICIARY_PHONESTATUS_ID_${uuid}`,
            "dataSrc": "source2",
            "rowSpan": 4
          }
        ]
      }
    ]
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
