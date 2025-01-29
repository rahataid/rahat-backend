// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { BQUEUE, BeneficiaryJobs, ProjectContants, ValidateWallet, VerifySignature } from '@rahataid/sdk';
import { PrismaService } from '@rumsan/prisma';
import type { Address } from 'abitype';
import { Queue } from 'bull';
import * as crypto from 'crypto'; // Import the crypto module
import { recoverMessageAddress } from 'viem';

@Injectable()
export class VerificationService {

    constructor(private readonly configService: ConfigService,
        protected prisma: PrismaService,
        @InjectQueue(BQUEUE.RAHAT_BENEFICIARY)
        private readonly beneficiaryQueue: Queue,
        @Inject(ProjectContants.ELClient) private readonly client: ClientProxy
    ) { }
    private readonly algorithm = 'aes-256-cbc'
    private readonly privateKey = this.configService.get('PRIVATE_KEY')
    private iv = Buffer.from('0123456789ABCDEF0123456789ABCDEF', 'hex')

    getSecret = () => {
        if (!this.privateKey) {
            throw new Error('No PRIVATE_KEY found in config file');
        }
        const hash = crypto.createHash('sha256');
        hash.update(this.privateKey);
        return hash.digest('hex').split('').slice(0, 32).join('');
    };
    // Encryption function
    encrypt(data) {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.getSecret()), this.iv);
        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }

    // Decryption function
    decrypt(encryptedData) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.getSecret()), this.iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    async generateLink(uuid: crypto.UUID) {
        const findUuid = await this.prisma.beneficiary.findUnique({
            where: { uuid },
            include: {
                pii: true,
            },
        });
        if (!findUuid) throw new Error('Data not Found');

        const encrypted = this.encrypt(findUuid.walletAddress);
        const email = findUuid.pii.email;
        const name = findUuid.pii.name;
        await this.beneficiaryQueue.add(BeneficiaryJobs.SEND_EMAIL, {
            encrypted,
            email,
            name,
        });
        return "Success";
    }

    //set Beneficiary as verified based on walletAddress
    async setBeneficiaryAsVerified(walletAddress: string) {
        const ben = await this.prisma.beneficiary.findFirst({
            where: { walletAddress },
        });
        if (!ben) throw new Error('Data not Found');

        return this.prisma.beneficiary.update({
            where: { uuid: ben.uuid },
            data: {
                isVerified: true,
            },
        });
    }

    async validateWallet(validationData: ValidateWallet) {
        const { walletAddress, encryptedData } = validationData
        const decrypted = this.decrypt(encryptedData);
        if (decrypted === walletAddress.toString()) {
            this.setBeneficiaryAsVerified(walletAddress);
            return "success"
        }
        throw new UnauthorizedException('Invalid wallet address')
    }


    async verifySignature(verificationData: VerifySignature) {
        const { encryptedData, signature } = verificationData;
        const decryptedAddress = this.decrypt(encryptedData) as Address;
        const recoveredAddress = await recoverMessageAddress({
            message: encryptedData,
            signature: signature,
        })
        if (decryptedAddress === recoveredAddress) {
            this.setBeneficiaryAsVerified(decryptedAddress);
            return 'Success';
        }
        throw new UnauthorizedException('Wallet Not Verified');
    }
}
