import { PrismaClient } from '@prisma/client';
import { SettingsService } from '@rumsan/extensions/settings';
import { PrismaService } from '@rumsan/prisma';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { Addressable, uuidV4 } from 'ethers';
import { commonLib } from './_common';
dotenv.config();

const corePrisma = new PrismaClient({
  datasourceUrl: process.env.CORE_DATABASE_URL as string,
});

const prisma = new PrismaService();
const settings = new SettingsService(prisma);

const contractName = [
  'ERC2771Forwarder',
  'RahatAccessManager',
  'RahatTreasury',
  'RahatToken'
];

const rahatTokenDetails = {
  name: 'RHT Coin',
  symbol: 'RHT',
  description: 'RHT Coin',
  decimals: 0,
  initialSupply: '100000',
};


interface DeployedContract {
  address: string | Addressable;
  startBlock: number;
}

class SeedProject extends commonLib {
  contracts: Record<string, DeployedContract>;;

  constructor() {
    super();
    this.contracts = {};
  }
  static getUUID() {
    return uuidV4(randomBytes(16));
  }
  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async deployRahatPayrollContracts() {
    const deployerAccount = this.getDeployerWallet();


    console.log('----------Deploying Rahat Access Manager-------------------');
    const RahatAccessManager = await this.deployContract('RahatAccessManager', [
      deployerAccount.address,
    ]);
    this.contracts['RahatAccessManager'] = {
      address: RahatAccessManager.contract.target,
      startBlock: RahatAccessManager.blockNumber,
    };

    console.log(
      '----------Deploying Rahat ERC7221Forwarder-------------------'
    );
    const ERC2771Forwarder = await this.deployContract('ERC2771Forwarder', [
      'RahatForwarder',
    ]);
    console.log({
      ERC2771Forwarder: ERC2771Forwarder.contract.target,
      startBlock: ERC2771Forwarder.blockNumber,
    });

    this.contracts['ERC2771Forwarder'] = {
      address: ERC2771Forwarder.contract.target,
      startBlock: ERC2771Forwarder.blockNumber,
    };

    console.log('----------Depolying Rahat Treasury-------------------');
    const RahatTreasury = await this.deployContract('RahatTreasury', [
      RahatAccessManager.contract.target,
      ERC2771Forwarder.contract.target,
    ]);
    this.contracts['RahatTreasury'] = {
      address: RahatTreasury.contract.target,
      startBlock: RahatTreasury.blockNumber,
    };



    console.log('----------Depolying Rahat Token-------------------');
    const RahatToken = await this.deployContract('RahatToken', [
      rahatTokenDetails.name,
      rahatTokenDetails.symbol,
      rahatTokenDetails.description,
      rahatTokenDetails.decimals,
      rahatTokenDetails.initialSupply,
      RahatTreasury.contract.target,
      RahatAccessManager.contract.target,
      ERC2771Forwarder.contract.target,
    ]);
    this.contracts['RahatToken'] = {
      address: RahatToken.contract.target,
      startBlock: RahatToken.blockNumber,
    };



    console.log('Writing deployed address to file');
    this.writeToDeploymentFile(
      'contracts',
      this.contracts,
    );

  }

  public async addContractSettings() {
    const contracts = await this.getDeployedContractDetails(
      'contracts',
      contractName
    );
    // console.log('contracts', contracts);
    const data = {
      name: 'Contracts',
      value: contracts,
      isPrivate: false,
    };

    return await settings.create(data);
  }

}

async function main() {
  const seedProject = new SeedProject();
  await seedProject.deployRahatPayrollContracts();
  await seedProject.addContractSettings();

  // await seedProject.updateProjectContractAddress();
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
