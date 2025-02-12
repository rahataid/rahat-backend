import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import axios from 'axios';
import * as dotenv from 'dotenv';
import {
    Contract,
    HDNodeWallet,
    JsonRpcProvider,
    Mnemonic,
    ethers
} from 'ethers';
//@ts-ignore
import ERC2771FORWARDER from '../contracts/ERC2771Forwarder.json';
//@ts-ignore
import VendorProject from '../contracts/vendor.json';

const prisma = new PrismaService();
const prismaClient = new PrismaClient()

dotenv.config();

// To be replaced
const rpProjectID = '24dbbcc7-0d1c-4036-8e1a-333d96ff6222';
const vendorContractAddress = "0x36f55e0EA9dE19B92Df60ca60382630a856Ac937";
const beneficiaries = ['0x590c4e1a0f4E1940b65d255E093310E8c50bEe80'];
const vendorsMnemonics = ['true hover embody swim drive huge bulb lift carpet team tip swallow',
    'frame option veteran improve fluid miss stem rebel day cube valid hello'];

// Constants
const baseUrl = process.env.FRONTEND_URL as string;
const url = `${baseUrl}/v1/projects/${rpProjectID}/actions`;
const signerPrivateKey = process.env.RAHAT_ADMIN_PRIVATE_KEY as string;
const rpcUrl = process.env.NETWORK_PROVIDER as string;

async function metaTxnFlow() {
    // Uncomment below lines to request claims
    vendorsMnemonics.forEach(async (vendorMnemonics) =>
        requestClaims(beneficiaries, vendorMnemonics)
    );

    // Uncomment below lines to process claims
    // vendorsMnemonics.forEach((vendorMnemonics) =>
    //     processTokenClaim(beneficiaries, vendorMnemonics)
    // );
}

metaTxnFlow().catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
        await prisma.$disconnect();
    });;



// Utility functions
async function getSettings() {
    const contract = await prismaClient.setting.findUnique({
        where: {
            name: 'CONTRACTS'
        }
    })
    const rahatTokenAddress = "0xFFC9B300d18B4Be060e4c8A908593024Cd11b0B3";
    const erc721ForwarderAddress = "0x4565Df874684d086fe279797BAA672DE51e54CF5";

    // Issue: Need to fix seed script (forwarder and token address is incorrect)
    // const erc721ForwarderAddress =  contract?.value?.ERC2771FORWARDER.ADDRESS
    //@ts-ignore
    return { rahatTokenAddress, erc721ForwarderAddress: erc721ForwarderAddress };
}

async function requestClaims(walletAddresses: string[], vendorMnemonics: string) {
    const { erc721ForwarderAddress } = await getSettings()
    const forwarderContract = await createContractInstance(
        rpcUrl,
        erc721ForwarderAddress,
        ERC2771FORWARDER.abi,
    );

    const walletInstance = getWalletUsingPrivateKey(vendorMnemonics);

    const vendorContract = await createContractInstance(
        rpcUrl,
        vendorContractAddress,
        VendorProject.abi,
    )
    const functionName = "requestTokenFromBeneficiary";

    const Authorization = await getAccessToken(vendorMnemonics);

    walletAddresses.forEach(async (addr: string) => {
        const { rahatTokenAddress } = await getSettings();
        const callData = [rahatTokenAddress, addr, BigInt(1)]
        const metaTxnRequest = await getMetaTxRequest(walletInstance, forwarderContract, vendorContract, functionName, callData);
        await axios.post(url, {
            action: "elProject.redeemVoucher",
            payload: {
                metaTxRequest: {
                    ...metaTxnRequest,
                    gas: metaTxnRequest.gas.toString(),
                    nonce: metaTxnRequest.nonce.toString(),
                    value: metaTxnRequest.value.toString(),
                },
            },
        }, {
            headers: {
                Authorization: `Bearer ${Authorization}`
            }
        })
    })

    console.log(`Requested claim for: ${walletAddresses}`)
}

async function processTokenClaim(walletAddresses: string[], vendorMnemonics: string) {
    const { erc721ForwarderAddress } = await getSettings();
    const forwarderContract = await createContractInstance(
        rpcUrl,
        erc721ForwarderAddress,
        ERC2771FORWARDER.abi,
    );

    const walletInstance = getWalletUsingPrivateKey(vendorMnemonics);

    const Authorization = await getAccessToken(vendorMnemonics);

    const vendorContract = await createContractInstance(
        rpcUrl,
        vendorContractAddress,
        VendorProject.abi,
    )
    const functionName = 'processTokenRequest';
    walletAddresses.forEach(async (addr) => {
        const callData = [addr, '9670'];
        const metaTxnRequest = await getMetaTxRequest(walletInstance, forwarderContract, vendorContract, functionName, callData)
        axios.post(url, {
            action: "elProject.processOtp",
            payload: {
                metaTxRequest: {
                    ...metaTxnRequest,
                    gas: metaTxnRequest.gas.toString(),
                    nonce: metaTxnRequest.nonce.toString(),
                    value: metaTxnRequest.value.toString(),
                },
            },
        }, {
            headers: {
                Authorization: `Bearer ${Authorization}`
            }
        })
    })
    console.log(`Processed claim for: ${walletAddresses}`)
}

async function getMetaTxRequest(
    signer: any,
    forwarderContract: any,
    elContractInstance: any,
    functionName: any,
    params: any[]
) {
    return signMetaTxRequest(signer, forwarderContract, {
        from: signer.address,
        to: elContractInstance.target,
        data: elContractInstance.interface.encodeFunctionData(functionName, params),
    });
}

async function signMetaTxRequest(signer: any, forwarderContract: any, input: any) {
    const request = await buildRequest(forwarderContract, input);
    const { domain, types } = await buildTypedData(forwarderContract);

    const signature = await signer.signTypedData(domain, types, request);

    //@ts-ignore
    request.signature = signature;
    return request;
}

async function buildRequest(forwarderContract: any, input: any) {
    const nonce = await forwarderContract.nonces.staticCall(input.from);

    return {
        from: input.from,
        to: input.to,
        value: BigInt(0),
        data: input.data,
        gas: BigInt(1e6),
        deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        nonce,
    };
}

async function buildTypedData(forwarderContract: any) {
    const domain = await getDomain(forwarderContract);
    const ForwardRequest = types.ForwardRequest;
    return {
        domain,
        types: { ForwardRequest },
    };
}

async function getDomain(contract: any) {
    const {
        fields,
        name,
        version,
        chainId,
        verifyingContract,
        salt,
        extensions,
    } = await contract.eip712Domain.staticCall();

    if (extensions.length > 0) {
        throw Error('Extensions not implemented');
    }

    const domain = {
        name,
        version,
        chainId,
        verifyingContract,
        salt,
    };

    for (const [i, { name }] of types.EIP712Domain.entries()) {
        if (!(fields & (1 << i))) {
            //@ts-ignore
            delete domain[name];
        }
    }

    return domain;
}

const mapValues = (obj: any, fn: any) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));

const formatType = (schema: any) =>
    Object.entries(schema).map(([name, type]) => ({ name, type }));

const types = mapValues(
    {
        EIP712Domain: {
            name: 'string',
            version: 'string',
            chainId: 'uint256',
            verifyingContract: 'address',
            salt: 'bytes32',
        },
        ForwardRequest: {
            from: 'address',
            to: 'address',
            value: 'uint256',
            gas: 'uint256',
            nonce: 'uint256',
            deadline: 'uint48',
            data: 'bytes',
        },
    },
    formatType
);

export async function createContractSigner(abi: any, address: string) {
    const provider = new JsonRpcProvider(rpcUrl);
    const privateKey = signerPrivateKey;
    const wallet = new ethers.Wallet(privateKey, provider);
    const contracts = new Contract(address, abi, wallet);
    return contracts
}

function getWalletUsingPrivateKey(mnemonic: string): any {
    const mnemonicWallet = Mnemonic.fromPhrase(mnemonic);
    const wall = HDNodeWallet.fromMnemonic(mnemonicWallet);
    return wall;
}


async function createContractInstance(
    rpcUrl: string,
    address: any,
    abi: any
) {
    const provider = new JsonRpcProvider(rpcUrl);
    return new Contract(address, abi, provider);
}

async function getAccessToken(vendorMnemonics: string) {
    const challengeRes = await axios.post(`${baseUrl}/v1/auth/challenge`);
    const challenge = challengeRes.data.data.challenge;

    const walletInstance = getWalletUsingPrivateKey(vendorMnemonics);
    const signature = await signMessage({
        wallet: walletInstance,
        message: challenge,
    });

    const signatureRes = await axios.post(`${baseUrl}/v1/auth/wallet`, { challenge, signature });
    return signatureRes.data.data.accessToken;
}

async function signMessage({ wallet, message }: any) {
    try {
        const signature = await wallet.signMessage(message);
        return signature;
    } catch (error: any) {
        console.error("Error signing message:", error.message);
        throw error.message;
    }
};


