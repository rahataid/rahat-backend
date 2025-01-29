// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  Contract,
  JsonRpcProvider,
  ethers
} from 'ethers';


export async function createContractSigner(abi: any, address: string) {

  //  Create wallet from private key
  const provider = new JsonRpcProvider(process.env.NETWORK_PROVIDER);
  const privateKey = process.env.RAHAT_ADMIN_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  //  Create an instance of the contract
  const contracts = new Contract(address, abi, wallet);
  return contracts
}

export async function getBlocktimeStamp(txHash: string) {
  const provider = new JsonRpcProvider(process.env.NETWORK_PROVIDER);
  const receipt = await provider.waitForTransaction(txHash);
  if (!receipt) {
    console.error('Transaction is not mined or does not exist.');
    return null;
  }
  const block = await provider.getBlock(receipt.blockNumber);
  return block.timestamp;
}