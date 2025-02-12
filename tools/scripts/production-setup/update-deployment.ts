import { PrismaService } from '@rumsan/prisma';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ContractArtifacts, ContractDetails } from '../types/contract';
dotenv.config({ path: `${__dirname}/.env.setup` });

function getDeploymentFile() {
  const directoryPath = join(__dirname, 'deployments');
  const fileName = `contracts.json`;
  const filePath = join(directoryPath, fileName);

  if (existsSync(filePath)) {
    const contents = readFileSync(filePath, 'utf8');
    return JSON.parse(contents);
  } else {
    console.log(`File ${fileName} does not exist in ${directoryPath}`);
    return null;
  }
}

const contractNames = [
  'RahatAccessManager',
  'RahatTreasury',
  'RahatToken',
  'ERC2771Forwarder',

];

const prisma = new PrismaService();

class DeploymentUpdater {
  deploymentSettings: any;

  constructor() {
    this.deploymentSettings = getDeploymentFile();
  }

  private async getContractArtifacts(
    contractNames: string
  ): Promise<ContractArtifacts> {
    const contract = await import(`../contracts/${contractNames}.json`);
    return contract;
  }


  private async getDeployedContractDetails(
    contractNames: string[]
  ) {
    const contractDetails: ContractDetails = {};
    await Promise.all(
      contractNames.map(async (contract) => {
        const address = await this.deploymentSettings.contracts[contract].address;
        const { abi } = await this.getContractArtifacts(contract);
        contractDetails[contract] = { address, abi };
      })
    );
    return contractDetails;
  }

  public async addBlockchainSettings() {
    console.log("Adding Blockchain settings")

    // await settings.create({
    //   name: 'Blockchain',
    //   value: this.deploymentSettings.chainSettings,
    //   isPrivate: false
    // });

    const data = {
      name: 'Blockchain',
      value: this.deploymentSettings.chainSettings,
      isPrivate: false
    };

    const url = `${process.env.RAHAT_CORE_URL}/v1/settings`;
    await axios.post(url, data);
    console.log("Blockchain settings Added")


  }

  public async addGraphSettings() {
    console.log("Subgraph url adding")
    const formattedURL = this.deploymentSettings.subgraphUrl
    const url = `${process.env.RAHAT_CORE_URL}/v1/settings`;
    // await settings.create({
    //   name: 'SUBGRAPH_URL',
    //   value: {
    //     url: formattedURL
    //   },
    //   isPrivate: false
    // })

    const data = {
      name: 'SUBGRAPH_URL',
      value: { URL: formattedURL },
      isPrivate: false
    };

    await axios.post(url, data);
    console.log("Subgraph url added")


  }



  public async addTreasurySettings() {

    console.log("Adding settings in core")
    const contractDetails = await this.getDeployedContractDetails(contractNames)
    // const contractDetails = this.deploymentSettings

    const url = `${process.env.RAHAT_CORE_URL}/v1/settings`;

    const data = {
      name: 'CONTRACTS',
      value: {
        rahattreasury: {
          abi: contractDetails.RahatTreasury.abi,
          address: contractDetails.RahatTreasury.address,
        },
        rahataccessmanager: {
          abi: contractDetails.RahatAccessManager.abi,
          address: contractDetails.RahatAccessManager.address,
        },
        rahattoken: {
          abi: contractDetails.RahatToken.abi,
          address: contractDetails.RahatToken.address,
        },
      },
      isPrivate: false,
      isReadOnly: true,
      dataType: 'OBJECT',
      requiredFields: [],
    }

    console.log(url)

    const tx = await axios.post(url, data)
    console.log("Core settings added")

  }


  public async addContractSettings() {
    console.log("Adding contract settings")

    const contracts = await this.getDeployedContractDetails(contractNames);
    const data = {
      name: 'Contracts',
      value: contracts,
      isPrivate: false
    };

    const url = `${process.env.RAHAT_CORE_URL}/v1/settings`;
    await axios.post(url, data);
    console.log("Contract settings Added")

  }
}
async function main() {
  const deploymentUpdater = new DeploymentUpdater();

  await deploymentUpdater.addContractSettings();
  await deploymentUpdater.addBlockchainSettings();
  await deploymentUpdater.addGraphSettings();
  // await deploymentUpdater.addTreasurySettings();


  process.exit(0);
}
main();
