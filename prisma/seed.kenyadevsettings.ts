import { Prisma, PrismaClient, Setting, SettingDataType } from '@prisma/client';
import * as fs from 'fs/promises';

const prisma = new PrismaClient();

const rootPath = process.argv[2]
const rootEnv = `${rootPath}/.env`
const gnacheAccounts = `${rootPath}/accounts.json`

async function main() {
    const accounts = await getAccounts()
    const adminAccounts = accounts?.adminAccounts as string[]
    const pvtKey = accounts?.privateKey as string[]

    await modifyRootEnv(pvtKey[0])

    /*********** kenya dev settings  **************** */
    const kenyaDevSettings: Setting = {
        value: {
            privateKey: pvtKey[0],
            adminAccounts: adminAccounts
        } as Prisma.JsonValue,
        isPrivate: true,
        isReadOnly: true,
        name: 'KENYA_DEV',
        requiredFields: ['privateKey', 'adminAccounts'],
        dataType: SettingDataType.OBJECT,
    }

    await prisma.setting.upsert({
        where: {
            name: 'KENYA_DEV'
        },
        // @ts-ignore
        create: kenyaDevSettings,
        // @ts-ignore
        update: kenyaDevSettings
    });
    /*********** kenya dev settings end  **************** */

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


async function getAccounts() {
    try {

        const accounts = await fs.readFile(gnacheAccounts, 'utf-8');
        const ganacheData = JSON.parse(accounts)

        const allAccounts = ganacheData.addresses;
        const allKeys = ganacheData.private_keys

        const adminAccounts = Object.values(allAccounts).slice(0, 2);
        const privateKey = Object.values(allKeys).slice(0, 1);

        return {
            adminAccounts,
            privateKey
        }
    } catch (error) {
        console.error('Error reading accounts file:', error);
    }
}


async function modifyRootEnv(key: string) {
    try {
        let data = await fs.readFile(rootEnv, 'utf-8');
        const lines = data.split('\n') as string[];

        const newLines = lines.map(line => {
            if (line.startsWith('PRIVATE_KEY')) {
                return `PRIVATE_KEY=${key}`;
            }
            if (line.startsWith('DEPLOYER_PRIVATE_KEY')) {
                return `DEPLOYER_PRIVATE_KEY=${key}`;
            }
            return line;
        });

        const newData = newLines.join('\n');

        await fs.writeFile(rootEnv, newData, 'utf-8');

        console.log(rootEnv)
        console.log('File updated.');
    } catch (error) {
        console.error('Error modifying dev-tools .env file:', error);
    }
}

